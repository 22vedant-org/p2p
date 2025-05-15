'use client';
import OlaMaplibre from './_components/ola-maplibre';
import ToFrom from './_components/tofrom';
import { useIsMobile } from '@/hooks/use-mobile';
export default function Home() {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<div className="grid grid-cols-1 h-screen w-full">
				<div className="rounded-lg">
					<OlaMaplibre />
				</div>
				<div className="overflow-y-scroll h-full">
					<ToFrom />
				</div>
			</div>
		);
	} else {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 h-screen w-full">
				<div className="overflow-y-scroll h-full">
					<ToFrom />
				</div>
				<div className="rounded-lg">
					<OlaMaplibre />
				</div>
			</div>
		);
	}
}
