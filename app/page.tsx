import OlaMaplibre from '@/components/ola-maplibre';
import Image from 'next/image';
// import ToAndFrom from '@/components/ToAndFrom';
import ToAndFrom from '@/components/ToAndFroTrial';
import CollapsibleCard from '@/components/collapsibleCard';
export default function Home() {
	return (
		<div className="grid grid-cols-2 h-screen w-full ">
			<div className="overflow-y-scroll h-full">
				{/* <ToAndFrom /> */}
				<ToAndFrom />
				{/* <div>Hello</div> */}
			</div>
			<div className="rounded-lg">
				<OlaMaplibre />
			</div>
		</div>
	);
}
