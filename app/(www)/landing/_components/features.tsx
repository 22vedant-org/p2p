'use client';

import { motion } from 'framer-motion';
import { BarChart3, Zap, Shield, Layers, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeaturesGrid() {
	// Animation variants
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

	// Feature card data
	const features = [
		{
			title: 'Real-time Analytics',
			description:
				'Process and visualize data instantly with our powerful analytics engine. Make informed decisions faster than ever before.',
			icon: <BarChart3 className="w-6 h-6" />,
			color: 'from-purple-500 to-indigo-700',
			span: 'md:col-span-2 md:row-span-1',
		},
		{
			title: 'Lightning Fast Performance',
			description:
				'Built with speed in mind. Our optimized algorithms ensure your application runs smoothly even with massive datasets.',
			icon: <Zap className="w-6 h-6" />,
			color: 'from-amber-500 to-orange-700',
			span: 'md:col-span-1 md:row-span-2',
		},
		{
			title: 'Enterprise Security',
			description:
				'Bank-level encryption and security protocols keep your data safe. Compliant with industry standards including GDPR, HIPAA, and SOC2.',
			icon: <Shield className="w-6 h-6" />,
			color: 'from-emerald-500 to-green-700',
			span: 'md:col-span-1 md:row-span-1',
		},
		{
			title: 'Scalable Architecture',
			description:
				'From startups to enterprises, our platform scales with your needs. Handle millions of users without performance degradation.',
			icon: <Layers className="w-6 h-6" />,
			color: 'from-blue-500 to-cyan-700',
			span: 'md:col-span-1 md:row-span-1',
		},
		{
			title: 'Collaborative Workspace',
			description:
				'Work together seamlessly with your team. Real-time updates, commenting, and sharing make collaboration effortless.',
			icon: <Users className="w-6 h-6" />,
			color: 'from-rose-500 to-pink-700',
			span: 'md:col-span-1 md:row-span-1',
		},
		{
			title: 'Global Infrastructure',
			description:
				'Deployed across multiple regions worldwide, ensuring low latency and high availability for users everywhere. 99.99% uptime guaranteed.',
			icon: <Globe className="w-6 h-6" />,
			color: 'from-teal-500 to-cyan-700',
			span: 'md:col-span-2 md:row-span-1',
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
						Everything you need to build, deploy, and scale your
						application
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
							{/* Gradient background */}
							<div
								className={`absolute inset-0 bg-gray-400 bg-opacity-10`}
							></div>

							{/* Content */}
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
