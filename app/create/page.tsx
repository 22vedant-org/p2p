// 'use client';
import OlaMaplibre from '@/components/ola-maplibre';
// import ToAndFrom from '@/components/ToAndFrom';
// import ToAndFrom from '@/components/ToAndFroTrial';
import ToAndFrom from './_components/to-and-from';
// import CollapsibleCard from '@/components/collapsibleCard';
import ChooseRide from '@/components/choose-ride';
export default function Home() {
	return (
		<div className="grid grid-cols-2 h-screen w-full">
			<div className="overflow-y-scroll h-full">
				<ToAndFrom />
				<ChooseRide />
			</div>
			<div className="rounded-lg">
				<OlaMaplibre />
			</div>
		</div>
	);
}
