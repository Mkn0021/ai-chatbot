"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { DEFAULT_MODELS } from "@/lib/ai/models";
import { OrganizationFormData } from "@/app/(organization)/schema";

export function OrganizationSettings() {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const data: OrganizationFormData = {
			name: String(formData.get("name") ?? ""),
			dailyMessageLimit: Number(formData.get("dailyMessageLimit") ?? 0),
			defaultModelId: String(formData.get("defaultModelId") ?? ""),
		};

		console.log(data);
	};

	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<header>
				<h2 className="mb-1 text-xl font-semibold">Organization Settings</h2>
				<p className="text-muted-foreground text-sm">
					Manage your organization details and global settings
				</p>
			</header>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Organization Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						placeholder="Enter organization name"
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="dailyMessageLimit">Daily Message Limit</Label>
						<Input
							id="dailyMessageLimit"
							name="dailyMessageLimit"
							type="number"
							placeholder="e.g., 1000"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="defaultModelId">Default Model</Label>

						<Select name="defaultModelId" defaultValue="">
							<SelectTrigger id="defaultModelId">
								<SelectValue placeholder="Select a default model" />
							</SelectTrigger>

							<SelectContent>
								{DEFAULT_MODELS.map((model) => (
									<SelectItem key={model.id} value={model.id}>
										{model.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex w-full justify-center pt-4">
					<Button type="submit" className="gap-2">
						<Save className="h-4 w-4" />
						Save Changes
					</Button>
				</div>
			</div>
		</form>
	);
}
