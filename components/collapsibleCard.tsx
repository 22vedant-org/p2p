'use client';
import { useState } from 'react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronDownIcon } from 'lucide-react';

interface collapsibleCardProps {
	title: String;
	description: String;
	children: React.ReactNode;
}

const CollapsibleCard = ({
	title,
	description,
	children,
}: collapsibleCardProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="mb-3 rounded-lg shadow-md"
		>
			{/* <Card className="flex items-center justify-between"> */}
			<Card className="flex flex-col justify-between space-y-0 pb-2">
				<CardHeader className="flex flex-row justify-between">
					<div>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
					<CollapsibleTrigger asChild>
						<Button
							size={'sm'}
							variant={'ghost'}
							className="w-9 p-0"
						>
							<ChevronDownIcon
								className={`h-4 w-4 transition-transform ${
									isOpen ? 'rotate-180' : ''
								}`}
							/>
							<span className="sr-only">Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</CardHeader>
				<CollapsibleContent>{children}</CollapsibleContent>
			</Card>
		</Collapsible>
	);
};

export default CollapsibleCard;
