import Link from 'next/link';
const Footer = () => {
	return (
		<footer className="mt-1 rounded-lg border w-full bottom-0">
			<div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
				<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
					© 2025{' '}
					<Link
						href="http://22vedant.online/"
						className="hover:underline"
					>
						22vedant
					</Link>
					. All Rights Reserved.
				</span>
				<ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
					<li>
						<Link
							href="/about"
							className="hover:underline me-4 md:me-6"
						>
							About
						</Link>
					</li>
					<li>
						<Link
							href="/privacy"
							className="hover:underline me-4 md:me-6"
						>
							Privacy Policy
						</Link>
					</li>
					<li>
						<Link
							href="mailto:vedantchinta223@gmail.com"
							className="hover:underline"
						>
							Contact
						</Link>
					</li>
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
