import React from 'react';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Anton } from 'next/font/google';

const anton = Anton({
	subsets: ['latin'],
	weight: ['400'],
	display: 'swap',
});
const TopbarPrior = () => {
	return (
		<header className="backdrop-blur-xl border rounded-lg flex items-center sticky top-0 z-50">
			<div className="flex justify-between px-4 h-14 items-center w-full ">
				<div className="flex items-center">
					<Link href={'/landing'} className={`${anton.className}`}>
						Ride Shares
					</Link>
				</div>

				{/* <div className="grid grid-cols-2 gap-1"> */}
				<div className="flex items-center justify-center">
					<form action={'/sign-up'} className=" mr-1">
						<Button variant={'secondary'}>
							Sign up
							<ArrowRight strokeWidth={'2px'} size={'24px'} />
						</Button>
					</form>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
};

export default TopbarPrior;
