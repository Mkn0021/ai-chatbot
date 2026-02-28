"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Save } from "lucide-react";
import { fetcher } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useOrganization } from "@/components/chatpage/organization-provider";

export function OrganizationSettings() {
	const [isUpdating, setIsUpdating] = useState(false);
	const { organization, isLoading, mutate } = useOrganization();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const data = {
			name: String(formData.get("name") ?? ""),
			dailyMessageLimit: Number(formData.get("dailyMessageLimit") ?? 0),
		};

		setIsUpdating(true);

		try {
			await fetcher("/api/organization", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			mutate();
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
