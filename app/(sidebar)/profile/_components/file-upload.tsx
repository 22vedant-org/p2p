import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function FileUpload() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Upload your file</CardTitle>
				<CardDescription>
					File size should not exceed 10MB
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center space-y-4">
				<div className="w-full grid gap-0.5">
					<Label htmlFor="file">Choose a file</Label>
					<Input id="file" type="file" />
				</div>
				<Button>Submit</Button>
			</CardContent>
		</Card>
	);
}
