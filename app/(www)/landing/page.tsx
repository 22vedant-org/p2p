'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuroraText } from '@/components/magicui/aurora-text';
import Image from 'next/image';
import FeaturesGrid from './_components/features';
import Link from 'next/link';

export default function HeavyAILanding() {
	return (
		<div className="min-h-screen bg-black relative overflow-hidden">
			{/* Animated background gradient */}
			{/* <motion.div
				className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"
				animate={{
					background: [
						'linear-gradient(45deg, #111111 0%, #000000 50%, #111111 100%)',
						'linear-gradient(45deg, #000000 0%, #111111 50%, #000000 100%)',
						'linear-gradient(45deg, #111111 0%, #000000 50%, #111111 100%)',
					],
				}}
				transition={{
					duration: 8,
					repeat: Number.POSITIVE_INFINITY,
					ease: 'easeInOut',
				}}
			/> */}

			{/* Floating background elements */}
			<div className="absolute inset-0 overflow-hidden">
				{[...Array(30)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-white rounded-full opacity-30"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							y: [-20, 20, -20],
							opacity: [0.3, 0.8, 0.3],
						}}
						transition={{
							duration: 3 + Math.random() * 2,
							repeat: Number.POSITIVE_INFINITY,
							delay: Math.random() * 2,
						}}
					/>
				))}
			</div>

			{/* Header */}
			{/* <motion.header
				className="relative z-50 px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-800"
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, ease: 'easeOut' }}
			>
				<motion.div
					className="flex items-center"
					whileHover={{ scale: 1.05 }}
					transition={{ type: 'spring', stiffness: 400, damping: 10 }}
				>
					<div className="flex items-center space-x-2">
						<motion.div
							className="w-8 h-8 bg-white rounded-sm flex items-center justify-center"
							whileHover={{ rotate: 180 }}
							transition={{ duration: 0.3 }}
						>
							<div className="w-4 h-4 bg-black rounded-sm"></div>
						</motion.div>
						<span className="text-white font-bold text-xl">
							HEAVY.AI
						</span>
					</div>
				</motion.div>

				<nav className="hidden md:flex items-center space-x-8">
					{['Platform', 'Solutions', 'Learn', 'Company'].map(
						(item, index) => (
							<motion.div
								key={item}
								className="flex items-center space-x-1 text-gray-300 hover:text-white cursor-pointer"
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{
									delay: 0.1 * index,
									duration: 0.5,
								}}
								whileHover={{ y: -2 }}
							>
								<span>{item}</span>
								<ChevronDown className="w-4 h-4" />
							</motion.div>
						)
					)}
				</nav>

				<motion.div
					className="flex items-center space-x-4"
					initial={{ x: 100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button
							variant="ghost"
							className="text-gray-300 hover:text-white hover:bg-gray-800"
						>
							Request Demo
						</Button>
					</motion.div>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 shadow-lg shadow-emerald-600/20">
							Get HEAVY.AI Free
						</Button>
					</motion.div>
				</motion.div>
			</motion.header> */}

			{/* Hero Section */}
			<main className="relative">
				<div className="container mx-auto px-4 pt-16 pb-8">
					{/* Hero Text */}
					<div className="text-center max-w-5xl mx-auto mb-12">
						<motion.h1
							className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
							initial={{ y: 50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 1, delay: 0.3 }}
						>
							<motion.span
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.8, delay: 0.5 }}
							>
								{/* A Revolutionary GPU-Accelerated */}
								Book Rides Instantly with
							</motion.span>
							<br />
							<motion.span
								className="text-gray-300"
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.8, delay: 0.7 }}
							>
								{/* Database & Analytics Platform */}
								<AuroraText>Blockchain</AuroraText>
							</motion.span>
						</motion.h1>

						<motion.p
							className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
							initial={{ y: 30, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.9 }}
						>
							Connect with verified riders and drivers, split
							costs seamlessly, and build trust on every trip—no
							middlemen, no hidden fees.
						</motion.p>

						<motion.div
							className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
							initial={{ y: 40, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.8, delay: 1.1 }}
						>
							<motion.div
								whileHover={{
									scale: 1.05,
									boxShadow:
										'0 10px 30px rgba(249, 115, 22, 0.3)',
								}}
								whileTap={{ scale: 0.95 }}
							>
								<Button className="bg-purple-500 hover:bg-purple-400 text-white px-8 py-3 text-lg shadow-lg shadow-purple-500/20">
									<Link href={'/sign-up'}>Get Started</Link>
									<ArrowRight />
								</Button>
							</motion.div>
							{/* <motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant="outline"
									className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 px-8 py-3 text-lg"
								>
									Learn More →
								</Button>
							</motion.div> */}
						</motion.div>
					</div>

					{/* Dashboard Preview */}
					<motion.div
						className="relative max-w-6xl w-full mx-auto"
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 1, delay: 1.3 }}
					>
						<Image
							src={'/p2p_dashboard.png'}
							alt="Dashobard"
							width={'1200'}
							height={'900'}
						/>
					</motion.div>
				</div>
			</main>

			<FeaturesGrid />
		</div>
	);
}
