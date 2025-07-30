// types/ride-escrow.ts
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export interface RideEscrow {
	driver: PublicKey;
	rideId: BN;
	perSeatPrice: BN;
	driverSecurityDeposit: BN;
	riderSecurityDeposit: BN;
	riders: PublicKey[];
	isCompleted: boolean;
	bump: number;
}

export interface CreateEscrowParams {
	rideId: number;
	perSeatPrice: number;
	driverSecurityDeposit: number;
	riderSecurityDeposit: number;
}
