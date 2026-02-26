"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Permission {
	id: string;
	name: string;
	description: string;
}

interface TeamMemberAccess {
	id: string;
	name: string;
	email: string;
	role: string;
	permissions: string[];
}

const availablePermissions: Permission[] = [
	{
		id: "db.read",
		name: "Database Read",
		description: "Read from connected databases",
	},
	{
		id: "db.write",
		name: "Database Write",
		description: "Write to connected databases",
	},
	{
		id: "team.view",
		name: "View Team",
		description: "View team members",
	},
	{
		id: "team.manage",
		name: "Manage Team",
		description: "Add and remove team members",
	},
];

export function AccessControlSettings() {
	const [members, setMembers] = useState<TeamMemberAccess[]>([
		{
			id: "1",
			name: "John Doe",
			email: "john@example.com",
			role: "Admin",
			permissions: ["db.read", "db.write", "team.view", "team.manage"],
		},
		{
			id: "2",
			name: "Jane Smith",
			email: "jane@example.com",
			role: "Member",
			permissions: ["db.read", "team.view"],
		},
		{
			id: "3",
			name: "Bob Wilson",
			email: "bob@example.com",
			role: "Viewer",
			permissions: ["team.view"],
		},
	]);

	const [selectedMember, setSelectedMember] = useState<TeamMemberAccess | null>(
		null,
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const togglePermission = (permissionId: string) => {
		if (!selectedMember) return;

		const hasPermission = selectedMember.permissions.includes(permissionId);
		const updatedPermissions = hasPermission
			? selectedMember.permissions.filter((p) => p !== permissionId)
			: [...selectedMember.permissions, permissionId];

		setSelectedMember({ ...selectedMember, permissions: updatedPermissions });
	};

	const handleSavePermissions = () => {
		if (!selectedMember) return;

		setMembers(
			members.map((m) => (m.id === selectedMember.id ? selectedMember : m)),
		);
		setIsDialogOpen(false);
		toast.success("Permissions updated");
	};

	const openPermissionsDialog = (member: TeamMemberAccess) => {
		setSelectedMember({ ...member });
		setIsDialogOpen(true);
	};

	return (
		<div>
			<div className="mb-6">
				<h2 className="mb-1 text-xl font-semibold">Access Control</h2>
				<p className="text-muted-foreground text-sm">
					Manage team member permissions and access levels
				</p>
			</div>

			<AccessControlTable
				members={members}
				onManagePermissions={openPermissionsDialog}
			/>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="flex max-h-[80vh] max-w-2xl flex-col overflow-hidden">
					<DialogHeader>
						<DialogTitle>Manage Permissions</DialogTitle>
						<DialogDescription>
							{selectedMember && (
								<>Configure permissions for {selectedMember.name}</>
							)}
						</DialogDescription>
					</DialogHeader>

					<PermissionsMap
						selectedMember={selectedMember}
						togglePermission={togglePermission}
					/>

					<div className="flex justify-end gap-2 border-t pt-4">
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSavePermissions}>Save Changes</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

interface AccessControlTableProps {
	members: TeamMemberAccess[];
	onManagePermissions: (member: TeamMemberAccess) => void;
}

const AccessControlTable = ({
	members,
	onManagePermissions,
}: AccessControlTableProps) => {
	return (
		<div className="mt-4 overflow-x-auto rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead className="hidden sm:table-cell">Email</TableHead>
						<TableHead className="hidden sm:table-cell">Role</TableHead>
						<TableHead className="hidden sm:table-cell">Permissions</TableHead>
						<TableHead className="text-center">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{members.map((member) => (
						<TableRow key={member.id}>
							<TableCell className="font-medium">
								<div>
									<div>{member.name}</div>
									<Badge className="mt-1 sm:hidden" variant="outline">
										{member.role}
									</Badge>
								</div>
							</TableCell>

							<TableCell className="text-muted-foreground hidden sm:table-cell">
								{member.email}
							</TableCell>

							<TableCell className="hidden sm:table-cell">
								<Badge variant="outline">{member.role}</Badge>
							</TableCell>

							<TableCell className="hidden sm:table-cell">
								<span className="text-muted-foreground text-sm">
									{member.permissions.length} of {availablePermissions.length}{" "}
									granted
								</span>
							</TableCell>

							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<span className="text-muted-foreground text-xs sm:hidden">
										{member.permissions.length}/{availablePermissions.length}
									</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onManagePermissions(member)}
										className="gap-2"
									>
										<Settings className="h-4 w-4" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}

					{members.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className="text-muted-foreground py-8 text-center"
							>
								No team members found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

interface PermissionsMapProps {
	selectedMember: TeamMemberAccess | null;
	togglePermission: (permissionId: string) => void;
}

const PermissionsMap = ({
	selectedMember,
	togglePermission,
}: PermissionsMapProps) => {
	return (
		selectedMember && (
			<div className="bg-sidebar flex-1 space-y-4 overflow-y-auto">
				<div className="divide-y rounded-lg border">
					{availablePermissions.map((permission) => {
						const hasPermission = selectedMember.permissions.includes(
							permission.id,
						);

						return (
							<div
								key={permission.id}
								className="hover:bg-muted/30 flex items-center justify-between p-4 transition-colors"
							>
								<div className="flex flex-1 items-start gap-3">
									<div className="pt-1">
										<Shield
											className={`h-6 w-6 ${
												hasPermission
													? "text-sidebar-primary"
													: "text-muted-foreground"
											}`}
										/>
									</div>
									<div className="flex-1">
										<div className="text-sm font-medium">{permission.name}</div>
										<div className="text-muted-foreground text-xs">
											{permission.description}
										</div>
									</div>
								</div>
								<label className="relative inline-flex cursor-pointer items-center">
									<input
										type="checkbox"
										checked={hasPermission}
										onChange={() => togglePermission(permission.id)}
										className="peer sr-only"
									/>
									<div className="peer peer-checked:bg-sidebar-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
								</label>
							</div>
						);
					})}
				</div>
			</div>
		)
	);
};
