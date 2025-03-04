// 'use client';
import OlaMaplibre from '@/components/ola-maplibre';
import ToAndFrom from './_components/to-and-from';
// import CollapsibleCard from '@/components/collapsibleCard';
import ChooseRide from '@/components/choose-ride';
import ToFrom from './_components/tofrom';
export default function Home() {
	return (
		<div className="grid grid-cols-2 h-screen w-full">
			<div className="overflow-y-scroll h-full">
				<ToAndFrom />
				<ToFrom />
				{/* <ChooseRide /> */}
			</div>
			<div className="rounded-lg">
				<OlaMaplibre />
			</div>
		</div>
	);
}
