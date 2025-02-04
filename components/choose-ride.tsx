'use client';

import { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export default function ChooseRide() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="p-6 mx-auto space-y-6 w-full">
			<div className="mb-6">
				<h2 className="text-xl mb-3">Recommended</h2>

				<Collapsible
					open={isOpen}
					onOpenChange={setIsOpen}
					className="border rounded-xl overflow-hidden"
				>
					<CollapsibleTrigger asChild>
						<div className="p-4 flex items-center gap-4 cursor-pointer transition-colors">
							<div className="relative flex-shrink-0">
								<Image
									src="https://k1fe7q2u22.ufs.sh/f/DgxaonI3rzDhl4oD7XGscZbn5fMeuoYqdk82z3rOyC9FEVmK"
									alt="Auto rickshaw"
									width={48}
									height={48}
									className="object-contain"
								/>
							</div>

							<div className="flex-grow">
								<div className="flex items-center gap-2">
									<h3 className="font-medium">Uber Auto</h3>
									<div className="flex items-center text-sm text-gray-600">
										<Users className="w-4 h-4 mr-1" />
										<span>3</span>
									</div>
								</div>

								<div className="text-sm text-gray-600">
									<p>1 min away • 11:08 am</p>
									<p>No bargaining, digital/cash payments</p>
								</div>
							</div>

							<div className="flex flex-col items-end">
								<div className="font-medium">₹72.06</div>
								{isOpen ? (
									<ChevronUp className="w-5 h-5 text-gray-500" />
								) : (
									<ChevronDown className="w-5 h-5 text-gray-500" />
								)}
							</div>
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent className="p-4 space-y-4">
						<div className="space-y-2">
							<h4 className="font-medium">Driver Details</h4>
							<p>Name: John Doe</p>
							<p>Rating: 4.8 ⭐</p>
							<p>Languages: English, Hindi</p>
						</div>

						<div className="space-y-2">
							<h4 className="font-medium">Vehicle Details</h4>
							<p>Model: Bajaj RE</p>
							<p>Color: Yellow and Green</p>
							<p>License Plate: DL 1RT 1234</p>
						</div>

						<div className="space-y-2">
							<h4 className="font-medium">Ride Details</h4>
							<p>Estimated Time: 15 minutes</p>
							<p>Distance: 5.2 km</p>
							<p>
								Fare Breakdown: Base (₹50) + Distance (₹22.06)
							</p>
						</div>

						<Button className="w-full">Book Now</Button>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
}
