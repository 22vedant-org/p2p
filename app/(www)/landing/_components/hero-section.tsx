'use client';

import { ShineBorder } from '@/components/magicui/shine-border';
import { PulsatingButton } from '@/components/magicui/pulsating-button';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { AuroraText } from '@/components/magicui/aurora-text';

export default function HeroSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: '-100px' });
	return (
		<section
			id="hero"
			className="relative mx-auto mt-4 px-6 md:px-8 max-w-[80rem] text-center"
		>
			<div className="flex items-center justify-center">
				<div
					className={cn(
						'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800'
					)}
				>
					<AnimatedShinyText className="inline-flex items-center justify-center px-4 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
						<span>✨ Beta version (Devnet only)</span>
						{/* <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /> */}
						<ArrowRight />
					</AnimatedShinyText>
				</div>
			</div>
			<h1 className="text-4xl font-bold tracking-tighter md:text-5xl ">
				Book Rides instantly with <AuroraText>Blockchain</AuroraText>
			</h1>
			{/* <p className="opacity-0 mb-12 text-balance text-gray-400 text-lg md:text-xl tracking-tight translate-y-[-1rem] animate-fade-in [--animation-delay:400ms]">
				MintTix allows you to create, transact and store digital tickets
				<br className="md:block hidden" /> on a carbon-neutral
				blockchain.
			</p> */}
			<div className="flex justify-center items-center mt-4">
				<Link href="/sign-up" className="">
					{/* <HoverBorderGradient
						containerClassName="rounded-full"
						as="button"
						className="flex items-center space-x-2 bg-white dark:bg-black text-black dark:text-white"
					>
						Get Started
						<ChevronRight className="ml-1 transition-all group-hover:translate-x-1 duration-300 ease-out size-4" />
					</HoverBorderGradient> */}
					<PulsatingButton>Get Started</PulsatingButton>
				</Link>
			</div>

			<div
				ref={ref}
				className="relative after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)] after:z-50 after:absolute after:inset-0 opacity-0 mt-[8rem] animate-fade-up [--animation-delay:400ms] [perspective:2000px]"
			>
				<div
					className={`rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] ${
						inView ? 'before:animate-image-glow' : ''
					}`}
				>
					<ShineBorder
						// borderRadius={}
						borderWidth={1}
						duration={12}
						color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
					/>

					{/* <Image
						src="/hero-dark.png"
						alt="Hero Image"
						className="dark:block relative hidden border rounded-[inherit] w-full h-full object-contain"
					/> */}
				</div>
			</div>
		</section>
	);
}
