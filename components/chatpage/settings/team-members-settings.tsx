"use client";

import { useEffect, useState } from "react";
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
import { MoreHorizontal, Pencil, Trash, UserPlus } from "lucide-react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const TEAM_ROLES = ["Admin", "Moderator", "Member", "Viewer"];

interface TeamMember {
	id: string;
	name: string;
	email: string;
	role: string;
	status: "active" | "inactive" | "pending";
	joinedDate: string;
}

export function TeamMembersSettings() {
	const [members, setMembers] = useState<TeamMember[]>([
		{
			id: "1",
			name: "John Doe",
			email: "john@example.com",
			role: "Admin",
			status: "active",
			joinedDate: "2024-01-15",
		},
		{
			id: "2",
			name: "Jane Smith",
			email: "jane@example.com",
			role: "Member",
			status: "active",
			joinedDate: "2024-02-10",
		},
		{
			id: "3",
			name: "Bob Wilson",
			email: "bob@example.com",
			role: "Viewer",
			status: "pending",
			joinedDate: "2024-02-20",
		},
	]);

	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

	const handleAddMember = (data: {
		name: string;
		email: string;
		role: string;
	}) => {
		const member: TeamMember = {
			id: Date.now().toString(),
			name: data.name,
			email: data.email,
			role: data.role,
			status: "pending",
			joinedDate: new Date().toISOString().split("T")[0],
		};
		setMembers([...members, member]);
		setAddDialogOpen(false);
		toast.success("Team member invited");
	};

	const handleEditMember = (data: {
		name: string;
		email: string;
		role: string;
	}) => {
		if (!selectedMember) return;
		setMembers((prev) =>
			prev.map((m) =>
				m.id === selectedMember.id
					? {
							...m,
							name: data.name,
							email: data.email,
							role: data.role,
						}
					: m,
			),
		);
		setEditDialogOpen(false);
		toast.success("Member updated");
	};

	return (
		<div>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h2 className="mb-1 text-xl font-semibold">Team Members</h2>
					<p className="text-muted-foreground text-sm">
						Manage your team members and their roles
					</p>
				</div>

				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<UserPlus className="h-4 w-4" />
							Invite Member
						</Button>
					</DialogTrigger>
				</Dialog>
			</div>

			<MemberDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				mode="add"
				onSubmit={handleAddMember}
			/>

			<MemberDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				mode="edit"
				initialData={
					selectedMember
						? {
								name: selectedMember.name,
								email: selectedMember.email,
								role: selectedMember.role,
							}
						: undefined
				}
				onSubmit={handleEditMember}
			/>

			<TeamMembersTable
				members={members}
				setMembers={setMembers}
				onEdit={(member) => {
					setSelectedMember(member);
					setEditDialogOpen(true);
				}}
			/>
		</div>
	);
}

interface TeamMembersTableProps {
	members: TeamMember[];
	setMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
	onEdit: (member: TeamMember) => void;
}

const TeamMembersTable = ({
	members,
	setMembers,
	onEdit,
}: TeamMembersTableProps) => {
	const getStatusVariant = (
		status: "active" | "inactive" | "pending",
	): "default" | "secondary" | "outline" => {
		switch (status) {
			case "active":
				return "default";
			case "inactive":
				return "secondary";
			case "pending":
				return "outline";
		}
	};

	const handleDelete = (id: string) => {
		setMembers((prev) => prev.filter((m) => m.id !== id));
		toast.success("Member removed");
	};

	const handleStatusChange = (
		id: string,
		status: "active" | "inactive" | "pending",
	) => {
		setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
		toast.success("Status updated");
	};

	return (
		<div className="mt-4 overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Joined Date</TableHead>
						<TableHead className="w-[60px] text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{members.map((member) => (
						<TableRow key={member.id}>
							<TableCell className="font-medium">{member.name}</TableCell>

							<TableCell className="text-muted-foreground">
								{member.email}
							</TableCell>

							<TableCell>{member.role}</TableCell>

							<TableCell>
								<Badge
									variant={getStatusVariant(member.status)}
									className="capitalize"
								>
									{member.status}
								</Badge>
							</TableCell>

							<TableCell className="text-muted-foreground">
								{member.joinedDate}
							</TableCell>

							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => onEdit(member)}>
											<Pencil className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={() => handleDelete(member.id)}
											className="text-destructive focus:text-destructive"
										>
											<Trash className="text-destructive mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}

					{members.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={6}
								className="text-muted-foreground py-8 text-center"
							>
								No team members yet. Invite your first member to get started.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

interface MemberDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "add" | "edit";
	initialData?: { name: string; email: string; role: string };
	onSubmit: (data: { name: string; email: string; role: string }) => void;
}

function MemberDialog({
	open,
	onOpenChange,
	mode,
	initialData,
	onSubmit,
}: MemberDialogProps) {
	const [form, setForm] = useState({ name: "", email: "", role: "" });

	useEffect(() => {
		if (mode === "edit" && initialData) setForm(initialData);
		if (mode === "add") setForm({ name: "", email: "", role: "" });
	}, [mode, initialData, open]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit Member" : "Invite Team Member"}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? "Update the details for this member"
							: "Add a new member to your organization"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 pt-4">
					<div className="space-y-2">
						<Label>Name</Label>
						<Input
							placeholder="Enter member name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label>Email</Label>
						<Input
							type="email"
							placeholder="member@example.com"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label>Role</Label>
						<Select
							value={form.role}
							onValueChange={(v) => setForm({ ...form, role: v })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								{TEAM_ROLES.map((role) => (
									<SelectItem key={role} value={role}>
										{role}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button onClick={() => onSubmit(form)}>
							{mode === "edit" ? "Save Changes" : "Send Invite"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
