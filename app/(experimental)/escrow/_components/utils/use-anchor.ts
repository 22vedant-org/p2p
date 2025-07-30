import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import idl from '../ride_escrow.json';
// import { CarpoolingReviews } from '../lib/types/carpooling_reviews';
import { RideEscrow } from '../lib/types/ride_escrow';

export const PROGRAM_ID = new PublicKey(
	'Gbq5WRDUXp7o38wuUAH1fSvS88RgPEEaw32FpPZRnBZ4'
);

export const getProgram = (connection: Connection, wallet: Wallet) => {
	const provider = new AnchorProvider(connection, wallet, {
		commitment: 'confirmed',
	});

	// You'll need to import your IDL here

	return new Program<RideEscrow>(idl, provider);
};
