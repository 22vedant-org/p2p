// hooks/useRideEscrow.ts
'use client';

import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { getProgram, getEscrowAddress } from '../lib/anchor-setup';
import { CreateEscrowParams, RideEscrow } from '../lib/ride-escrow';

export function useRideEscrow() {
	const { connection } = useConnection();
	const wallet = useWallet();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createEscrow = useCallback(
		async (params: CreateEscrowParams) => {
			if (!wallet.publicKey) {
				throw new Error('Wallet not connected');
			}

			setLoading(true);
			setError(null);

			try {
				const program = await getProgram(wallet, connection);
				const [escrowAddress] = getEscrowAddress(
					wallet.publicKey,
					params.rideId
				);

				const tx = await program.methods
					.createEscrow(
						new BN(params.rideId),
						new BN(params.perSeatPrice * LAMPORTS_PER_SOL),
						new BN(params.driverSecurityDeposit * LAMPORTS_PER_SOL),
						new BN(params.riderSecurityDeposit * LAMPORTS_PER_SOL)
					)
					.accounts({
						escrow: escrowAddress,
						driver: wallet.publicKey,
						systemProgram: SystemProgram.programId,
					})
					.rpc();

				return { signature: tx, escrowAddress };
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : 'Unknown error';
				setError(errorMsg);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[wallet, connection]
	);

	const joinRide = useCallback(
		async (escrowAddress: PublicKey) => {
			if (!wallet.publicKey) {
				throw new Error('Wallet not connected');
			}

			setLoading(true);
			setError(null);

			try {
				const program = await getProgram(wallet, connection);

				const tx = await program.methods
					.joinRide()
					.accounts({
						escrow: escrowAddress,
						rider: wallet.publicKey,
						systemProgram: SystemProgram.programId,
					})
					.rpc();

				return tx;
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : 'Unknown error';
				setError(errorMsg);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[wallet, connection]
	);

	const completeRide = useCallback(
		async (escrowAddress: PublicKey) => {
			if (!wallet.publicKey) {
				throw new Error('Wallet not connected');
			}

			setLoading(true);
			setError(null);

			try {
				const program = await getProgram(wallet, connection);

				const tx = await program.methods
					.completeRide()
					.accounts({
						escrow: escrowAddress,
						driver: wallet.publicKey,
					})
					.rpc();

				return tx;
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : 'Unknown error';
				setError(errorMsg);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[wallet, connection]
	);

	const returnRiderSecurity = useCallback(
		async (escrowAddress: PublicKey) => {
			if (!wallet.publicKey) {
				throw new Error('Wallet not connected');
			}

			setLoading(true);
			setError(null);

			try {
				const program = await getProgram(wallet, connection);

				const tx = await program.methods
					.returnRiderSecurity()
					.accounts({
						escrow: escrowAddress,
						rider: wallet.publicKey,
					})
					.rpc();

				return tx;
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : 'Unknown error';
				setError(errorMsg);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[wallet, connection]
	);

	const cancelRide = useCallback(
		async (escrowAddress: PublicKey) => {
			if (!wallet.publicKey) {
				throw new Error('Wallet not connected');
			}

			setLoading(true);
			setError(null);

			try {
				const program = await getProgram(wallet, connection);

				const tx = await program.methods
					.cancelRide()
					.accounts({
						escrow: escrowAddress,
						driver: wallet.publicKey,
					})
					.rpc();

				return tx;
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : 'Unknown error';
				setError(errorMsg);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[wallet, connection]
	);

	const fetchEscrow = useCallback(
		async (escrowAddress: PublicKey): Promise<RideEscrow | null> => {
			try {
				const program = await getProgram(wallet, connection);
				const escrowAccount = await program.account.rideEscrow.fetch(
					escrowAddress
				);
				return escrowAccount as RideEscrow;
			} catch (err) {
				console.error('Error fetching escrow:', err);
				return null;
			}
		},
		[wallet, connection]
	);

	return {
		createEscrow,
		joinRide,
		completeRide,
		returnRiderSecurity,
		cancelRide,
		fetchEscrow,
		loading,
		error,
	};
}
