import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
	Program,
	AnchorProvider,
	web3,
	BN,
	Idl,
	AnchorWallet,
} from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Connection } from '@solana/web3.js';
import { useMemo, useCallback } from 'react';
import idl from '../ride_escrow.json';
import { RideEscrow } from '../lib/types/ride_escrow';

const PROGRAM_ID = new PublicKey(
	'Gbq5WRDUXp7o38wuUAH1fSvS88RgPEEaw32FpPZRnBZ4'
);

// Define a client-side type for the RideEscrow account
export interface RideEscrowAccount {
	driver: PublicKey;
	rideId: BN;
	perSeatPrice: BN;
	driverSecurityDeposit: BN;
	riderSecurityDeposit: BN;
	riders: PublicKey[];
	isCompleted: boolean;
	bump: number;
}

// Custom error types for better error handling
export class EscrowError extends Error {
	constructor(message: string, public code?: string) {
		super(message);
		this.name = 'EscrowError';
	}
}

export const useEscrowProgram = () => {
	const { connection } = useConnection();
	const wallet = useWallet();

	const provider = useMemo(() => {
		if (!wallet.publicKey) return null;
		return new AnchorProvider(connection, wallet as AnchorWallet, {
			commitment: 'confirmed',
		});
	}, [connection, wallet]);

	const program = useMemo(() => {
		if (!provider) return null;
		return new Program<RideEscrow>(idl as Idl, provider);
	}, [provider]);

	const getEscrowAccountPDA = useCallback((driver: PublicKey, rideId: BN) => {
		return PublicKey.findProgramAddressSync(
			[
				Buffer.from('escrow'),
				driver.toBuffer(),
				rideId.toArrayLike(Buffer, 'le', 8),
			],
			PROGRAM_ID
		);
	}, []);

	const fetchEscrowAccount = useCallback(
		async (
			driver: PublicKey,
			rideId: BN
		): Promise<RideEscrowAccount | null> => {
			if (!program) return null;

			try {
				const [escrowPDA] = getEscrowAccountPDA(driver, rideId);
				const escrowAccount = await program.account.rideEscrow.fetch(
					escrowPDA
				);
				return escrowAccount as RideEscrowAccount;
			} catch (error) {
				console.error('Error fetching escrow account:', error);
				return null;
			}
		},
		[program, getEscrowAccountPDA]
	);

	const createEscrow = useCallback(
		async (
			rideId: BN,
			perSeatPrice: BN,
			driverSecurityDeposit: BN,
			riderSecurityDeposit: BN
		) => {
			if (!program || !wallet.publicKey) {
				throw new EscrowError(
					'Wallet not connected or program not available',
					'WALLET_NOT_CONNECTED'
				);
			}

			try {
				const [escrowPDA] = getEscrowAccountPDA(
					wallet.publicKey,
					rideId
				);

				const tx = await program.methods
					.createEscrow(
						rideId,
						perSeatPrice,
						driverSecurityDeposit,
						riderSecurityDeposit
					)
					.accounts({
						escrow: escrowPDA,
						driver: wallet.publicKey,
						systemProgram: SystemProgram.programId,
					})
					.rpc();

				return { transaction: tx, escrowPDA };
			} catch (error) {
				console.error('Error creating escrow:', error);
				throw new EscrowError(
					'Failed to create escrow account',
					'ESCROW_CREATION_FAILED'
				);
			}
		},
		[program, wallet.publicKey, getEscrowAccountPDA]
	);

	const joinRide = useCallback(
		async (driver: PublicKey, rideId: BN) => {
			if (!program || !wallet.publicKey) {
				throw new EscrowError(
					'Wallet not connected or program not available',
					'WALLET_NOT_CONNECTED'
				);
			}

			try {
				const [escrowPDA] = getEscrowAccountPDA(driver, rideId);

				// Check if escrow account exists
				const escrowAccount = await fetchEscrowAccount(driver, rideId);
				if (!escrowAccount) {
					throw new EscrowError(
						'Ride not found on blockchain',
						'RIDE_NOT_FOUND'
					);
				}

				// Check if ride is already completed
				if (escrowAccount.isCompleted) {
					throw new EscrowError(
						'Ride is already completed',
						'RIDE_COMPLETED'
					);
				}

				// Check if rider already joined
				const isAlreadyJoined = escrowAccount.riders.some((rider) =>
					rider.equals(wallet.publicKey!)
				);
				if (isAlreadyJoined) {
					throw new EscrowError(
						'You have already joined this ride',
						'ALREADY_JOINED'
					);
				}

				// Check if ride is at capacity (assuming max 4 riders)
				if (escrowAccount.riders.length >= 4) {
					throw new EscrowError(
						'Ride is at maximum capacity',
						'RIDE_FULL'
					);
				}

				// Estimate transaction fee
				const recentBlockhash = await connection.getLatestBlockhash();

				const tx = await program.methods
					.joinRide()
					.accounts({
						escrow: escrowPDA,
						rider: wallet.publicKey,
						systemProgram: SystemProgram.programId,
					})
					.rpc();

				// Wait for confirmation
				const confirmation = await connection.confirmTransaction({
					signature: tx,
					blockhash: recentBlockhash.blockhash,
					lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
				});

				if (confirmation.value.err) {
					throw new EscrowError(
						'Transaction failed to confirm',
						'CONFIRMATION_FAILED'
					);
				}

				return tx;
			} catch (error) {
				console.error('Error in joinRide:', error);

				// Handle specific Anchor errors
				if (error instanceof Error) {
					if (error.message.includes('0x1771')) {
						// RideAtCapacity
						throw new EscrowError(
							'Ride is at maximum capacity',
							'RIDE_FULL'
						);
					}
					if (error.message.includes('0x1772')) {
						// RiderAlreadyJoined
						throw new EscrowError(
							'You have already joined this ride',
							'ALREADY_JOINED'
						);
					}
					if (error.message.includes('0x1770')) {
						// RideAlreadyCompleted
						throw new EscrowError(
							'Ride is already completed',
							'RIDE_COMPLETED'
						);
					}
					if (error.message.includes('User rejected')) {
						throw new EscrowError(
							'Transaction was cancelled by user',
							'USER_REJECTED'
						);
					}
					if (error.message.includes('insufficient funds')) {
						throw new EscrowError(
							'Insufficient funds for transaction',
							'INSUFFICIENT_FUNDS'
						);
					}
				}

				// Re-throw EscrowError instances
				if (error instanceof EscrowError) {
					throw error;
				}

				throw new EscrowError(
					'Failed to join ride',
					'JOIN_RIDE_FAILED'
				);
			}
		},
		[
			program,
			wallet.publicKey,
			getEscrowAccountPDA,
			fetchEscrowAccount,
			connection,
		]
	);

	const completeRide = useCallback(
		async (rideId: BN) => {
			if (!program || !wallet.publicKey) {
				throw new EscrowError(
					'Wallet not connected or program not available',
					'WALLET_NOT_CONNECTED'
				);
			}

			try {
				const [escrowPDA] = getEscrowAccountPDA(
					wallet.publicKey,
					rideId
				);

				const tx = await program.methods
					.completeRide()
					.accounts({
						escrow: escrowPDA,
						driver: wallet.publicKey,
					})
					.rpc();

				return tx;
			} catch (error) {
				console.error('Error completing ride:', error);
				throw new EscrowError(
					'Failed to complete ride',
					'COMPLETE_RIDE_FAILED'
				);
			}
		},
		[program, wallet.publicKey, getEscrowAccountPDA]
	);

	const cancelRide = useCallback(
		async (rideId: BN) => {
			if (!program || !wallet.publicKey) {
				throw new EscrowError(
					'Wallet not connected or program not available',
					'WALLET_NOT_CONNECTED'
				);
			}

			try {
				const [escrowPDA] = getEscrowAccountPDA(
					wallet.publicKey,
					rideId
				);

				const tx = await program.methods
					.cancelRide()
					.accounts({
						escrow: escrowPDA,
						driver: wallet.publicKey,
					})
					.rpc();

				return tx;
			} catch (error) {
				console.error('Error cancelling ride:', error);
				throw new EscrowError(
					'Failed to cancel ride',
					'CANCEL_RIDE_FAILED'
				);
			}
		},
		[program, wallet.publicKey, getEscrowAccountPDA]
	);

	const returnRiderSecurity = useCallback(
		async (driver: PublicKey, rideId: BN) => {
			if (!program || !wallet.publicKey) {
				throw new EscrowError(
					'Wallet not connected or program not available',
					'WALLET_NOT_CONNECTED'
				);
			}

			try {
				const [escrowPDA] = getEscrowAccountPDA(driver, rideId);

				const tx = await program.methods
					.returnRiderSecurity()
					.accounts({
						escrow: escrowPDA,
						rider: wallet.publicKey,
					})
					.rpc();

				return tx;
			} catch (error) {
				console.error('Error returning rider security:', error);
				throw new EscrowError(
					'Failed to return rider security',
					'RETURN_SECURITY_FAILED'
				);
			}
		},
		[program, wallet.publicKey, getEscrowAccountPDA]
	);

	const fetchAllEscrows = useCallback(async (): Promise<
		{ account: RideEscrowAccount; publicKey: PublicKey }[]
	> => {
		if (!program) return [];
		try {
			const accounts = await program.account.rideEscrow.all();
			return accounts.map((account) => ({
				account: account.account as RideEscrowAccount,
				publicKey: account.publicKey,
			}));
		} catch (error) {
			console.error('Error fetching all escrow accounts:', error);
			return [];
		}
	}, [program]);

	const getWalletBalance = useCallback(async (): Promise<number> => {
		if (!wallet.publicKey) return 0;
		try {
			const balance = await connection.getBalance(wallet.publicKey);
			return balance / 1e9; // Convert lamports to SOL
		} catch (error) {
			console.error('Error fetching wallet balance:', error);
			return 0;
		}
	}, [connection, wallet.publicKey]);

	return {
		program,
		programId: PROGRAM_ID,
		getEscrowAccountPDA,
		createEscrow,
		joinRide,
		completeRide,
		cancelRide,
		returnRiderSecurity,
		fetchEscrowAccount,
		fetchAllEscrows,
		getWalletBalance,
		isConnected: !!wallet.publicKey,
		walletAddress: wallet.publicKey?.toString(),
	};
};
