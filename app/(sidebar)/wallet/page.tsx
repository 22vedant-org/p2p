import React from 'react';
import { WalletOverview } from './_components/wallet-overview';
import { TransactionHistory } from './_components/ride-history';
import { RideDetails } from './_components/ride-details';

const page = () => {
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 p-4 space-x-3 space-y-3 md:space-y-0">
				<WalletOverview />
				{/* <WalletOverview /> */}
				<RideDetails />
			</div>
			<div className="px-4">
				<TransactionHistory />
			</div>
		</div>
	);
};

export default page;
