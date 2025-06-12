/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/carpooling_reviews.json`.
 */
export type CarpoolingReviews = {
	address: '6fBE38JrANKWtNLJ6esab6fXos2HHnsczRnSS2gSpxAB';
	metadata: {
		name: 'carpoolingReviews';
		version: '0.1.0';
		spec: '0.1.0';
		description: 'Created with Anchor';
	};
	instructions: [
		{
			name: 'completeRide';
			discriminator: [196, 120, 0, 113, 17, 178, 79, 225];
			accounts: [
				{
					name: 'rideAccount';
					writable: true;
				},
				{
					name: 'driver';
					signer: true;
				}
			];
			args: [];
		},
		{
			name: 'getUserReviews';
			discriminator: [184, 215, 35, 143, 121, 27, 248, 36];
			accounts: [
				{
					name: 'user';
				}
			];
			args: [];
		},
		{
			name: 'initializeRide';
			discriminator: [237, 237, 29, 192, 246, 22, 90, 7];
			accounts: [
				{
					name: 'rideAccount';
					writable: true;
					pda: {
						seeds: [
							{
								kind: 'const';
								value: [114, 105, 100, 101];
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
					type: 'string';
				},
				{
					name: 'driver';
					type: 'pubkey';
				},
				{
					name: 'maxPassengers';
					type: 'u8';
				},
				{
					name: 'pricePerSeat';
					type: 'u64';
				},
				{
					name: 'startLocation';
					type: 'string';
				},
				{
					name: 'endLocation';
					type: 'string';
				},
				{
					name: 'departureTime';
					type: 'i64';
				}
			];
		},
		{
			name: 'joinRide';
			discriminator: [241, 252, 48, 83, 148, 33, 41, 137];
			accounts: [
				{
					name: 'rideAccount';
					writable: true;
				},
				{
					name: 'passenger';
					signer: true;
				}
			];
			args: [];
		},
		{
			name: 'reportReview';
			discriminator: [194, 154, 52, 151, 148, 248, 74, 46];
			accounts: [
				{
					name: 'reviewAccount';
					writable: true;
				},
				{
					name: 'reporter';
					signer: true;
				}
			];
			args: [
				{
					name: 'reason';
					type: 'string';
				}
			];
		},
		{
			name: 'submitReview';
			discriminator: [106, 30, 50, 83, 89, 46, 213, 239];
			accounts: [
				{
					name: 'rideAccount';
				},
				{
					name: 'reviewAccount';
					writable: true;
					pda: {
						seeds: [
							{
								kind: 'const';
								value: [114, 101, 118, 105, 101, 119];
							},
							{
								kind: 'account';
								path: 'rideAccount';
							},
							{
								kind: 'account';
								path: 'reviewer';
							}
						];
					};
				},
				{
					name: 'reviewer';
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
					name: 'rating';
					type: 'u8';
				},
				{
					name: 'comment';
					type: 'string';
				},
				{
					name: 'reviewType';
					type: {
						defined: {
							name: 'reviewType';
						};
					};
				}
			];
		}
	];
	accounts: [
		{
			name: 'reviewAccount';
			discriminator: [119, 177, 213, 232, 143, 161, 255, 66];
		},
		{
			name: 'rideAccount';
			discriminator: [109, 42, 135, 22, 195, 142, 65, 186];
		}
	];
	errors: [
		{
			code: 6000;
			name: 'rideIdTooLong';
			msg: 'Ride ID too long (max 50 characters)';
		},
		{
			code: 6001;
			name: 'locationTooLong';
			msg: 'Location too long (max 100 characters)';
		},
		{
			code: 6002;
			name: 'invalidPassengerCount';
			msg: 'Invalid passenger count (must be 1-8)';
		},
		{
			code: 6003;
			name: 'rideNotActive';
			msg: 'Ride is not active';
		},
		{
			code: 6004;
			name: 'rideFull';
			msg: 'Ride is full';
		},
		{
			code: 6005;
			name: 'alreadyJoined';
			msg: 'Already joined this ride';
		},
		{
			code: 6006;
			name: 'driverCannotJoin';
			msg: 'Driver cannot join their own ride';
		},
		{
			code: 6007;
			name: 'unauthorizedDriver';
			msg: 'Unauthorized driver';
		},
		{
			code: 6008;
			name: 'invalidRating';
			msg: 'Invalid rating (must be 1-5)';
		},
		{
			code: 6009;
			name: 'commentTooLong';
			msg: 'Comment too long (max 500 characters)';
		},
		{
			code: 6010;
			name: 'rideNotCompleted';
			msg: 'Ride not completed yet';
		},
		{
			code: 6011;
			name: 'reviewerNotParticipant';
			msg: 'Reviewer did not participate in this ride';
		},
		{
			code: 6012;
			name: 'invalidReviewType';
			msg: 'Invalid review type for reviewer role';
		},
		{
			code: 6013;
			name: 'reasonTooLong';
			msg: 'Report reason too long (max 200 characters)';
		}
	];
	types: [
		{
			name: 'reviewAccount';
			type: {
				kind: 'struct';
				fields: [
					{
						name: 'rideId';
						type: 'string';
					},
					{
						name: 'reviewer';
						type: 'pubkey';
					},
					{
						name: 'reviewee';
						type: 'pubkey';
					},
					{
						name: 'rating';
						type: 'u8';
					},
					{
						name: 'comment';
						type: 'string';
					},
					{
						name: 'reviewType';
						type: {
							defined: {
								name: 'reviewType';
							};
						};
					},
					{
						name: 'createdAt';
						type: 'i64';
					},
					{
						name: 'isVerified';
						type: 'bool';
					},
					{
						name: 'isReported';
						type: 'bool';
					},
					{
						name: 'reportReason';
						type: {
							option: 'string';
						};
					}
				];
			};
		},
		{
			name: 'reviewType';
			type: {
				kind: 'enum';
				variants: [
					{
						name: 'driverReview';
					},
					{
						name: 'passengerReview';
					}
				];
			};
		},
		{
			name: 'rideAccount';
			type: {
				kind: 'struct';
				fields: [
					{
						name: 'rideId';
						type: 'string';
					},
					{
						name: 'driver';
						type: 'pubkey';
					},
					{
						name: 'maxPassengers';
						type: 'u8';
					},
					{
						name: 'currentPassengers';
						type: 'u8';
					},
					{
						name: 'pricePerSeat';
						type: 'u64';
					},
					{
						name: 'startLocation';
						type: 'string';
					},
					{
						name: 'endLocation';
						type: 'string';
					},
					{
						name: 'departureTime';
						type: 'i64';
					},
					{
						name: 'status';
						type: {
							defined: {
								name: 'rideStatus';
							};
						};
					},
					{
						name: 'createdAt';
						type: 'i64';
					},
					{
						name: 'completedAt';
						type: {
							option: 'i64';
						};
					},
					{
						name: 'passengers';
						type: {
							vec: 'pubkey';
						};
					}
				];
			};
		},
		{
			name: 'rideStatus';
			type: {
				kind: 'enum';
				variants: [
					{
						name: 'active';
					},
					{
						name: 'completed';
					},
					{
						name: 'cancelled';
					}
				];
			};
		}
	];
};
