// 'use client';
import OlaMaplibre from './_components/ola-maplibre';
import ToFrom from './_components/tofrom';
export default function Home() {
	return (
		<div className="grid grid-cols-2 h-screen w-full">
			<div className="overflow-y-scroll h-full">
				<ToFrom />
			</div>
			<div className="rounded-lg">
				<OlaMaplibre />
			</div>
		</div>
	);
}
