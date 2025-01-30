import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'k1fe7q2u22.ufs.sh',
				pathname: '/f/**',
			},
		],
	},
};

export default nextConfig;
