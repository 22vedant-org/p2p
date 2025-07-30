// Use anchor's web3 exports to avoid type conflicts
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Use anchor's web3 exports for Connection and PublicKey
const { Connection, PublicKey } = anchor.web3;

// Your program ID from the smart contract
const PROGRAM_ID = new PublicKey(
	'Gbq5WRDUXp7o38wuUAH1fSvS88RgPEEaw32FpPZRnBZ4'
);

// Import your IDL - make sure this matches your actual IDL structure
import RideEscrowIDL from './ride_escrow.json';

// Use a more flexible approach for typing
export function getProgram(
	wallet: WalletContextState,
	connection: anchor.web3.Connection
) {
	if (!wallet.publicKey || !wallet.signTransaction) {
		throw new Error('Wallet not connected');
	}
	const provider = new AnchorProvider(connection, wallet);
	// Use the program ID directly instead of relying on IDL typing
	return new Program(RideEscrowIDL, provider);
}

export function getEscrowAddress(
	driver: anchor.web3.PublicKey,
	rideId: number
): [anchor.web3.PublicKey, number] {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from('escrow'),
			driver.toBuffer(),
			new BN(rideId).toArrayLike(Buffer, 'le', 8), // Little-endian 8-byte
		],
		PROGRAM_ID
	);
}
