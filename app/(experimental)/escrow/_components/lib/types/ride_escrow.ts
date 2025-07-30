/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ride_escrow.json`.
 */
export type RideEscrow = {
	address: 'Gbq5WRDUXp7o38wuUAH1fSvS88RgPEEaw32FpPZRnBZ4';
	metadata: {
		name: 'rideEscrow';
		version: '0.1.0';
		spec: '0.1.0';
		description: 'Created with Anchor';
	};
	instructions: [
		{
			name: 'cancelRide';
			discriminator: [150, 77, 203, 32, 143, 141, 243, 192];
			accounts: [
				{
					name: 'escrow';
					writable: true;
				},
				{
					name: 'driver';
					writable: true;
					signer: true;
				}
			];
			args: [];
		},
		{
			name: 'completeRide';
			discriminator: [196, 120, 0, 113, 17, 178, 79, 225];
			accounts: [
				{
					name: 'escrow';
					writable: true;
				},
				{
					name: 'driver';
					writable: true;
					signer: true;
				}
			];
			args: [];
		},
		{
			name: 'createEscrow';
			discriminator: [253, 215, 165, 116, 36, 108, 68, 80];
			accounts: [
				{
					name: 'escrow';
					writable: true;
					pda: {
						seeds: [
							{
								kind: 'const';
								value: [101, 115, 99, 114, 111, 119];
							},
							{
								kind: 'account';
								path: 'driver';
							},
							{
								kind: 'arg';
								path: 'rideId';
							}
						];
					};
				},
				{
					name: 'driver';
					writable: true;
					signer: true;
				},
				{
					name: 'systemProgram';
					address: '11111111111111111111111111111111';
				}
			];
			args: [
				{
					name: 'rideId';
					type: 'u64';
				},
				{
					name: 'perSeatPrice';
					type: 'u64';
				},
				{
					name: 'driverSecurityDeposit';
					type: 'u64';
				},
				{
					name: 'riderSecurityDeposit';
					type: 'u64';
				}
			];
		},
		{
			name: 'joinRide';
			discriminator: [241, 252, 48, 83, 148, 33, 41, 137];
			accounts: [
				{
					name: 'escrow';
					writable: true;
				},
				{
					name: 'rider';
					writable: true;
					signer: true;
				},
				{
					name: 'systemProgram';
					address: '11111111111111111111111111111111';
				}
			];
			args: [];
		},
		{
			name: 'returnRiderSecurity';
			discriminator: [130, 152, 231, 148, 236, 19, 147, 96];
			accounts: [
				{
					name: 'escrow';
					writable: true;
				},
				{
					name: 'rider';
					writable: true;
					signer: true;
				}
			];
			args: [];
		}
	];
	accounts: [
		{
			name: 'rideEscrow';
			discriminator: [245, 2, 67, 211, 221, 201, 13, 116];
		}
	];
	errors: [
		{
			code: 6000;
			name: 'rideAlreadyCompleted';
			msg: 'Ride is already completed';
		},
		{
			code: 6001;
			name: 'rideAtCapacity';
			msg: 'Ride is at maximum capacity (4 riders)';
		},
		{
			code: 6002;
			name: 'riderAlreadyJoined';
			msg: 'Rider has already joined this ride';
		},
		{
			code: 6003;
			name: 'unauthorizedDriver';
			msg: 'Only the driver can perform this action';
		},
		{
			code: 6004;
			name: 'rideNotCompleted';
			msg: 'Ride is not completed yet';
		},
		{
			code: 6005;
			name: 'riderNotInRide';
			msg: 'Rider is not part of this ride';
		}
	];
	types: [
		{
			name: 'rideEscrow';
			type: {
				kind: 'struct';
				fields: [
					{
						name: 'driver';
						type: 'pubkey';
					},
					{
						name: 'rideId';
						type: 'u64';
					},
					{
						name: 'perSeatPrice';
						type: 'u64';
					},
					{
						name: 'driverSecurityDeposit';
						type: 'u64';
					},
					{
						name: 'riderSecurityDeposit';
						type: 'u64';
					},
					{
						name: 'riders';
						type: {
							vec: 'pubkey';
						};
					},
					{
						name: 'isCompleted';
						type: 'bool';
					},
					{
						name: 'bump';
						type: 'u8';
					}
				];
			};
		}
	];
};
