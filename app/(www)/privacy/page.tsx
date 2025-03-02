import Link from 'next/link';
import React from 'react';

const page = () => {
	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

			<p className="italic mb-6">Last Updated: 02/03/2025</p>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Introduction
			</h2>

			<p className="mb-4">
				22vedant (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
				respects your privacy and is committed to protecting your
				personal data. This Privacy Policy outlines how we collect, use,
				and safeguard your information when you use our services.
			</p>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Information We Collect
			</h2>

			<p className="mb-2">
				We may collect the following types of information:
			</p>

			<ul className="list-disc pl-6 mb-4 space-y-1">
				<li>
					<strong className="font-bold">Personal Information</strong>:
					Name, email address, phone number, and other contact
					details.
				</li>
				<li>
					<strong className="font-bold">Usage Data</strong>: IP
					address, browser type, pages visited, and interactions with
					our website/application.
				</li>
				<li>
					<strong className="font-bold">
						Cookies and Tracking Technologies
					</strong>
					: To enhance user experience and analyze website traffic.
				</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				How We Use Your Information
			</h2>

			<p className="mb-2">We use collected data for:</p>

			<ul className="list-disc pl-6 mb-4 space-y-1">
				<li>Providing and maintaining our services.</li>
				<li>Improving and personalizing user experiences.</li>
				<li>
					Communicating updates and marketing information (if
					consented to).
				</li>
				<li>Ensuring security and fraud prevention.</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Data Sharing and Disclosure
			</h2>

			<p className="mb-2">
				We do not sell or rent personal data. We may share data with:
			</p>
			<ul className="list-disc pl-6 mb-4 space-y-1">
				<li>Service providers who assist in our operations</li>
				<li>Legal authorities when required by law</li>
				<li>Business partners with your consent</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Data Retention
			</h2>

			<p className="mb-4">
				We retain personal data only as long as necessary to fulfill its
				purpose unless a longer retention period is required by law.
			</p>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Your Rights and Choices
			</h2>

			<p className="mb-2">You may have rights to:</p>

			<ul className="list-disc pl-6 mb-4 space-y-1">
				<li>Access, modify, or delete your data.</li>
				<li>Opt-out of marketing communications.</li>
				<li>Restrict or object to data processing.</li>
				<li>Data portability.</li>
				<li>Withdraw consent at any time.</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Security Measures
			</h2>

			<p className="mb-4">
				We implement appropriate technical and organizational measures
				to protect your data from unauthorized access, alteration, or
				loss.
			</p>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Third-Party Links
			</h2>

			<p className="mb-4">
				Our services may contain links to third-party websites. We are
				not responsible for their privacy policies or practices.
			</p>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Changes to This Privacy Policy
			</h2>

			<p className="mb-4">
				We may update this Privacy Policy periodically. The latest
				version will be posted on this page with the updated date.
			</p>

			<h2 className="text-2xl font-semibold mt-6 mb-2 pb-1  border-gray-200">
				Contact Information
			</h2>

			<p className="mb-4">
				For any questions regarding this Privacy Policy, please contact
				us at:{' '}
				<Link
					href={'mailto:vedantchinta223@gmail.com'}
					className="underline"
				>
					vedantchinta223@gmail.com
				</Link>
			</p>
		</div>
	);
};

export default page;
