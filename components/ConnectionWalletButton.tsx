// 'use client';

// import { buttonVariants } from '@/components/ui/button';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { useEffect, useState } from 'react';
// // import { useSession } from 'next-auth/react'; // Import useSession
// import { authClient } from '@/lib/auth-client';

// export default async function ConnectWalletButton() {
// 	const [isClient, setIsClient] = useState(false);
// 	const [balance, setBalance] = useState<number | null>(null);
// 	const { publicKey } = useWallet();
// 	const { connection } = useConnection();
// 	const session = await authClient.getSession(); // Get session data
// 	useEffect(() => {
// 		setIsClient(true);
// 	}, []);
// 	// const handleUpdateUserWalletAddress = async () => {
// 	// 	if (session?.user) {
// 	// 		await updateUser(session.user.id, { walletAddress: publicKey?.toString() })
// 	// 	}
// 	// }
// 	useEffect(() => {
// 		if (publicKey && session) {
// 			(async function getBalanceEvery10Seconds() {
// 				const newBalance = await connection.getBalance(publicKey);
// 				setBalance(newBalance / LAMPORTS_PER_SOL);
// 				setTimeout(getBalanceEvery10Seconds, 10000);
// 			})();

// 			// handleUpdateUserWalletAddress()
// 		} else {
// 			setBalance(null);
// 		}
// 	}, [publicKey, connection, balance, session]);
// 	if (!isClient) {
// 		return null;
// 	}
// 	return (
// 		<div className="flex flex-row">
// 			<WalletMultiButton
// 				className={buttonVariants({ size: 'sm' })}
// 				style={{ height: '36px' }}
// 			>
// 				{balance ? `${balance.toFixed(2)} SOL` : 'Connect Wallet'}
// 			</WalletMultiButton>
// 		</div>
// 	);
// }
