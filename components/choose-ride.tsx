import { Users } from 'lucide-react';
import Image from 'next/image';

export default function ChooseRide() {
	return (
		<div className="p-6 mx-auto space-y-6 w-full">
			<div className="mb-6">
				<h2 className="text-xl mb-3">Recommended</h2>

				<div className="border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors">
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

					<div className="flex-shrink-0 font-medium">₹72.06</div>
				</div>
			</div>
		</div>
	);
}
