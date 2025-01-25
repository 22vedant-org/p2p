import {
	Car,
	Package,
	Calendar,
	Clock,
	Navigation,
	Circle,
	Square,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function ToAndFrom() {
	return (
		<div className="max-w-xl mx-auto p-6 space-y-8">
			<h1 className="text-4xl font-bold tracking-tight">
				Commute Smart, Share the Ride.
			</h1>

			{/* <div className="flex gap-8 mb-8">
				<button className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors">
					<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
						<Car className="w-8 h-8" />
					</div>
					<span className="font-semibold">Ride</span>
				</button>

				<button className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors opacity-50">
					<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
						<Package className="w-8 h-8" />
					</div>
					<span className="font-semibold">Courier</span>
				</button>
			</div> */}

			<div className="space-y-4">
				<div className="relative">
					<div className="absolute left-4 top-0 bottom-0 flex flex-col items-center justify-between py-[1.125rem]">
						<Circle className="w-3 h-3 fill-current" />
						<div className="w-0.5 h-full bg-gray-200 my-1" />
						<Square className="w-3 h-3 fill-current" />
					</div>

					<div className="space-y-4">
						<div className="relative">
							<Input
								placeholder="Pickup location"
								className="pl-12 pr-12 h-14 bg-gray-100 border-0"
							/>
							<Navigation className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
						</div>

						<Input
							placeholder="Dropoff location"
							className="pl-12 pr-4 h-14 bg-gray-100 border-0"
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Select defaultValue="today">
						<SelectTrigger className="h-14 bg-gray-100 border-0">
							<Calendar className="w-5 h-5 mr-2" />
							<SelectValue placeholder="Select date" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="tomorrow">Tomorrow</SelectItem>
						</SelectContent>
					</Select>

					<Select defaultValue="now">
						<SelectTrigger className="h-14 bg-gray-100 border-0">
							<Clock className="w-5 h-5 mr-2" />
							<SelectValue placeholder="Select time" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="now">Now</SelectItem>
							<SelectItem value="later">
								Schedule for later
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Button className="w-full h-14 text-lg font-semibold rounded-lg">
				See prices
			</Button>
		</div>
	);
}
