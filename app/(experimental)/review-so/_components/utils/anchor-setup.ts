import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import idl from '../carpooling_reviews.json';
import { CarpoolingReviews } from '../lib/types/carpooling_reviews';

export const PROGRAM_ID = new PublicKey(
	'6fBE38JrANKWtNLJ6esab6fXos2HHnsczRnSS2gSpxAB'
);

export const getProgram = (connection: Connection, wallet: Wallet) => {
	const provider = new AnchorProvider(connection, wallet, {
		commitment: 'confirmed',
	});

	// You'll need to import your IDL here

	return new Program<CarpoolingReviews>(idl, provider);
};
