import OlaMaplibre from '@/components/ola-maplibre';
import Image from 'next/image';
import ToAndFrom from '@/components/ToAndFrom';
export default function Home() {
	return (
		<div className="grid grid-cols-2 p-7">
			<div>
				<ToAndFrom />
				<div>Hello</div>
			</div>
			<div className="rounded-lg">
				<OlaMaplibre />
			</div>
		</div>
	);
}
