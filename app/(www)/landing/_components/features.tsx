'use client';

import { motion } from 'framer-motion';
import { BarChart3, Zap, Shield, Layers, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeaturesGrid() {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15 } },
	};

	const features = [
		{
			title: 'Automated Ride Payments',
			description:
				'Smart contract-powered transactions ensure secure and transparent payments between drivers and riders, without middlemen.',
			icon: <Zap className="w-6 h-6" />,
			color: 'from-amber-500 to-orange-700',
			span: 'md:col-span-1 md:row-span-2',
		},
		{
			title: 'Solana Blockchain Integration',
			description:
				'Leverages Solana’s lightning-fast and low-cost network for handling ride bookings, token transfers, and real-time updates.',
			icon: <Globe className="w-6 h-6" />,
			color: 'from-blue-600 to-indigo-700',
			span: 'md:col-span-2 md:row-span-1',
		},
		{
			title: 'Verified User Identities',
			description:
				'Only allows registrations using organizational or institutional email domains. Public domains like Gmail are automatically rejected.',
			icon: <Shield className="w-6 h-6" />,
			color: 'from-emerald-500 to-green-700',
			span: 'md:col-span-1 md:row-span-1',
		},
		{
			title: 'Decentralized Review System',
			description:
				'Users can leave tamper-proof reviews after every ride. Feedback is stored on-chain for transparency and trust.',
			icon: <Users className="w-6 h-6" />,
			color: 'from-rose-500 to-pink-700',
			span: 'md:col-span-1 md:row-span-1',
		},
		{
			title: 'Lightning Fast Booking Engine',
			description:
				'Enjoy instant ride matching and transaction finality with our ultra-responsive backend, optimized for real-time use cases.',
			icon: <BarChart3 className="w-6 h-6" />,
			color: 'from-yellow-500 to-orange-600',
			span: 'md:col-span-2 md:row-span-1',
		},
		{
			title: 'Scalable Ride Infrastructure',
			description:
				'Supports thousands of concurrent rides, payments, and verifications — thanks to modular architecture and distributed execution.',
			icon: <Layers className="w-6 h-6" />,
			color: 'from-purple-600 to-fuchsia-700',
			span: 'md:col-span-1 md:row-span-1',
		},
	];

	return (
		<div className="bg-black min-h-screen py-16 px-4 md:px-6">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<motion.h2
						className="text-3xl md:text-5xl font-bold text-white mb-4"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						Powerful Features
					</motion.h2>
					<motion.p
						className="text-lg text-gray-400 max-w-3xl mx-auto"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						Everything you need to build a secure, scalable, and
						seamless blockchain-based carpooling platform.
					</motion.p>
				</div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto"
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: '-100px' }}
				>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							className={`${feature.span} bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative`}
							variants={item}
							whileHover={{
								y: -5,
								transition: { type: 'spring', stiffness: 300 },
							}}
						>
							<div
								className={`absolute inset-0 bg-gray-400 bg-opacity-10`}
							></div>

							<div className="p-8 h-full flex flex-col">
								<div className="mb-6">
									<motion.div
										className={`w-12 h-12 rounded-2xl flex items-center justify-center`}
										whileHover={{ rotate: 5, scale: 1.1 }}
										transition={{
											type: 'spring',
											stiffness: 400,
										}}
									>
										{feature.icon}
									</motion.div>
								</div>

								<h3 className="text-xl md:text-2xl font-bold mb-3">
									{feature.title}
								</h3>
								<p className="mb-6 flex-grow">
									{feature.description}
								</p>

								<motion.div
									whileHover={{ x: 5 }}
									className="mt-auto"
								>
									<Button
										variant="ghost"
										className="text-white p-0 hover:bg-transparent hover:text-gray-300"
									>
										Learn more →
									</Button>
								</motion.div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
}
