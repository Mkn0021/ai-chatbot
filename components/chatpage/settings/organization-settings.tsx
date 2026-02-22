"use client";

import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";
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
import { fetcher } from "@/lib/utils";
import { DEFAULT_MODELS } from "@/lib/ai/models";
import { Spinner } from "@/components/ui/spinner";
import { Organization } from "@/app/(organization)/schema";

export function OrganizationSettings() {
	const [isUpdating, setIsUpdating] = useState(false);

	const {
		data: organization,
		isLoading,
		mutate,
	} = useSWR<Organization>("/api/organization", fetcher);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const data = {
			name: String(formData.get("name") ?? ""),
			dailyMessageLimit: Number(formData.get("dailyMessageLimit") ?? 0),
			defaultModelId: String(formData.get("defaultModelId") ?? ""),
		};

		setIsUpdating(true);

		try {
			const response = await fetch("/api/organization", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.cause || "Failed to update organization");
			}

			const result = await response.json();
			mutate(result.data);
			toast.success("Organization updated successfully");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update organization",
			);
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Spinner variant="secondary" />
			</div>
		);
	}

	if (!organization) {
		return (
			<div className="flex items-center justify-center py-8">
				<p className="text-muted-foreground">No organization data available</p>
			</div>
		);
	}

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
						defaultValue={organization.name}
						placeholder="Enter organization name"
						disabled={isUpdating}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="dailyMessageLimit">Daily Message Limit</Label>
						<Input
							id="dailyMessageLimit"
							name="dailyMessageLimit"
							type="number"
							defaultValue={organization.dailyMessageLimit ?? 1000}
							placeholder="e.g., 1000"
							disabled={isUpdating}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="defaultModelId">Default Model</Label>

						<Select
							name="defaultModelId"
							defaultValue={organization.defaultModelId ?? DEFAULT_MODELS[0].id}
							disabled={isUpdating}
						>
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
					<Button type="submit" className="gap-2" disabled={isUpdating}>
						{isUpdating ? (
							<>
								<Spinner variant="secondary" size="small" />
								Updating...
							</>
						) : (
							<>
								<Save className="h-4 w-4" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</div>
		</form>
	);
}
