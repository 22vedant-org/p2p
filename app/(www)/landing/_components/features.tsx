'use client';

import { motion } from 'framer-motion';
import { BarChart3, Zap, Shield, Layers, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
						className="text-lg text-gray-400 max-w-4xl mx-auto"
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
					{/* Feature 1: Automated Ride Payments */}
					<motion.div
						className="md:col-span-1 md:row-span-2 bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative"
						variants={item}
						whileHover={{
							y: -5,
							transition: { type: 'spring', stiffness: 300 },
						}}
					>
						<div className="absolute inset-0 bg-gray-400 bg-opacity-10"></div>
						<div className="p-8 h-full flex flex-col">
							<h3 className="text-xl md:text-2xl font-bold mb-3">
								Automated Ride Payments
							</h3>
							<p className="mb-6 flex-grow">
								Smart contract-powered transactions ensure
								secure and transparent payments between drivers
								and riders, without middlemen.
							</p>
							<Image
								src="/solana-sol-logo.png"
								alt="Automated Ride Payments"
								width={200}
								height={200}
							/>
						</div>
					</motion.div>

					{/* Feature 2: Solana Blockchain Integration */}
					<motion.div
						className="md:col-span-2 md:row-span-1 flex bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative"
						variants={item}
						whileHover={{
							y: -5,
							transition: { type: 'spring', stiffness: 300 },
						}}
					>
						<div className="absolute inset-0 bg-blue-600 bg-opacity-10"></div>
						<div className="p-8 h-full flex">
							<div className="flex flex-col">
								<h3 className="text-xl md:text-2xl font-bold mb-3">
									Solana Blockchain Integration
								</h3>
								<p className="mb-6 flex-grow">
									Leverages Solana’s lightning-fast and
									low-cost network for handling ride bookings,
									token transfers, and real-time updates.
								</p>
							</div>
							<Image
								src="/solana-sol-logo.png"
								alt="Solana Blockchain Integration"
								width={200}
								height={200}
							/>
						</div>
					</motion.div>

					{/* Feature 3: Verified User Identities */}
					<motion.div
						className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative"
						variants={item}
						whileHover={{
							y: -5,
							transition: { type: 'spring', stiffness: 300 },
						}}
					>
						<div className="absolute inset-0 bg-emerald-500 bg-opacity-10"></div>
						<div className="p-8 h-full flex flex-col">
							<h3 className="text-xl md:text-2xl font-bold mb-3">
								Verified User Identities
							</h3>
							<p className="mb-6 flex-grow">
								Only allows registrations using organizational
								or institutional email domains. Public domains
								like Gmail are automatically rejected.
							</p>
							<Image
								src="/solana-sol-logo.png"
								alt="Verified User Identities"
								width={200}
								height={200}
							/>
						</div>
					</motion.div>

					{/* Feature 4: Decentralized Review System */}
					<motion.div
						className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative"
						variants={item}
						whileHover={{
							y: -5,
							transition: { type: 'spring', stiffness: 300 },
						}}
					>
						<div className="absolute inset-0 bg-rose-500 bg-opacity-10"></div>
						<div className="p-8 h-full flex flex-col">
							<h3 className="text-xl md:text-2xl font-bold mb-3">
								Decentralized Review System
							</h3>
							<p className="mb-6 flex-grow">
								Users can leave tamper-proof reviews after every
								ride. Feedback is stored on-chain for
								transparency and trust.
							</p>
							<Image
								src="/solana-sol-logo.png"
								alt="Decentralized Review System"
								width={200}
								height={200}
							/>
						</div>
					</motion.div>

					{/* Feature 5: Lightning Fast Booking Engine */}
					<motion.div
						className="md:col-span-2 md:row-span-1 bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative"
						variants={item}
						whileHover={{
							y: -5,
							transition: { type: 'spring', stiffness: 300 },
						}}
					>
						<div className="absolute inset-0 bg-yellow-500 bg-opacity-10"></div>
						<div className="p-8 flex">
							<div className="flex-col">
								<h3 className="text-xl md:text-2xl font-bold mb-3">
									Lightning Fast Booking Engine
								</h3>
								<p className="mb-6 	">
									Enjoy instant ride matching and transaction
									finality with our ultra-responsive backend,
									optimized for real-time use cases.
								</p>
							</div>

							<Image
								src="/solana-sol-logo.png"
								alt="Lightning Fast Booking Engine"
								width={200}
								height={200}
							/>
						</div>
					</motion.div>

					{/* Feature 6: Scalable Ride Infrastructure */}
					<motion.div
						className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 relative"
						variants={item}
						whileHover={{
							y: -5,
							transition: { type: 'spring', stiffness: 300 },
						}}
					>
						<div className="absolute inset-0 bg-purple-600 bg-opacity-10"></div>
						<div className="p-8 h-full flex flex-col">
							<h3 className="text-xl md:text-2xl font-bold mb-3">
								Scalable Ride Infrastructure
							</h3>
							<p className="mb-6 flex-grow">
								Supports thousands of concurrent rides,
								payments, and verifications — thanks to modular
								architecture and distributed execution.
							</p>
							{/* <Image
								src="/solana-sol-logo.png"
								alt="Scalable Ride Infrastructure"
								width={200}
								height={200}
							/> */}
						</div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
