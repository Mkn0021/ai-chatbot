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
import { Copy, MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type ModelStatus = "active" | "inactive" | "error";

type ModelItem = {
	id: string;
	modelName: string;
	provider: string;
	apiKey: string;
	status: ModelStatus;
};

export function ChatModelsSettings() {
	const [models, setModels] = useState<ModelItem[]>([
		{
			id: "1",
			modelName: "GPT-4 Turbo",
			provider: "OpenAI",
			apiKey: "sk-abc123456789xyz",
			status: "active",
		},
		{
			id: "2",
			modelName: "Claude 3 Opus",
			provider: "Anthropic",
			apiKey: "claude-987654321",
			status: "inactive",
		},
		{
			id: "3",
			modelName: "Gemini Pro",
			provider: "Google",
			apiKey: "gm-445566778899",
			status: "error",
		},
	]);

	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);

	const handleAddModel = (data: {
		name: string;
		provider: string;
		apiKey: string;
	}) => {
		const model: ModelItem = {
			id: Date.now().toString(),
			modelName: data.name,
			provider: data.provider,
			apiKey: data.apiKey,
			status: "active",
		};
		setModels([...models, model]);
		setAddDialogOpen(false);
	};

	const handleEditModel = (data: {
		name: string;
		provider: string;
		apiKey: string;
	}) => {
		if (!selectedModel) return;
		setModels((prev) =>
			prev.map((m) =>
				m.id === selectedModel.id
					? {
							...m,
							modelName: data.name,
							provider: data.provider,
							apiKey: data.apiKey,
						}
					: m,
			),
		);
		setEditDialogOpen(false);
	};

	return (
		<div>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h2 className="mb-1 text-xl font-semibold">Chat Models</h2>
					<p className="text-muted-foreground text-sm">
						Configure AI models and API keys for your organization
					</p>
				</div>

				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Add Model
						</Button>
					</DialogTrigger>
				</Dialog>
			</div>

			<ModelDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				mode="add"
				onSubmit={handleAddModel}
				modelOptions={models}
			/>

			<ModelDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				mode="edit"
				initialData={
					selectedModel
						? {
								name: selectedModel.modelName,
								provider: selectedModel.provider,
								apiKey: selectedModel.apiKey,
							}
						: undefined
				}
				onSubmit={handleEditModel}
				modelOptions={models}
			/>

			<ChatModelsTable
				models={models}
				setModels={setModels}
				onEdit={(model) => {
					setSelectedModel(model);
					setEditDialogOpen(true);
				}}
			/>
		</div>
	);
}

interface ChatModelsTableProps {
	models: ModelItem[];
	setModels: React.Dispatch<React.SetStateAction<ModelItem[]>>;
	onEdit: (model: ModelItem) => void;
}

const ChatModelsTable = ({
	models,
	setModels,
	onEdit,
}: ChatModelsTableProps) => {
	const copyToClipboard = async (value: string) => {
		await navigator.clipboard.writeText(value);
		toast.success("API key copied");
	};

	const maskKey = (key: string) => {
		if (!key) return "";
		return `${key.slice(0, 3)}••••••`;
	};

	const getStatusVariant = (status: ModelStatus) => {
		switch (status) {
			case "active":
				return "default";
			case "inactive":
				return "secondary";
			case "error":
				return "destructive";
			default:
				return "outline";
		}
	};

	const handleDelete = (id: string) => {
		setModels((prev: ModelItem[]) =>
			prev.filter((m: ModelItem) => m.id !== id),
		);
		toast.success("Model deleted");
	};

	return (
		<div className="mt-4 overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Model Name</TableHead>
						<TableHead>Provider</TableHead>
						<TableHead>API Key</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="w-[60px] text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{models.map((item) => (
						<TableRow key={item.id}>
							<TableCell className="font-medium">{item.modelName}</TableCell>

							<TableCell>{item.provider}</TableCell>

							<TableCell>
								<div className="flex items-center gap-2">
									<span className="font-mono text-sm tracking-wide">
										{maskKey(item.apiKey)}
									</span>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => copyToClipboard(item.apiKey)}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</div>
							</TableCell>

							<TableCell>
								<Badge
									variant={getStatusVariant(item.status)}
									className="capitalize"
								>
									{item.status}
								</Badge>
							</TableCell>

							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => onEdit(item)}>
											<Pencil className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={() => handleDelete(item.id)}
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

					{models.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className="text-muted-foreground py-8 text-center"
							>
								No models configured.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

interface ModelDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "add" | "edit";
	initialData?: { name: string; provider: string; apiKey: string };
	onSubmit: (data: { name: string; provider: string; apiKey: string }) => void;
	modelOptions: ModelItem[];
}

function ModelDialog({
	open,
	onOpenChange,
	mode,
	initialData,
	onSubmit,
	modelOptions,
}: ModelDialogProps) {
	const [form, setForm] = useState({ name: "", provider: "", apiKey: "" });

	useEffect(() => {
		if (mode === "edit" && initialData) setForm(initialData);
		if (mode === "add") setForm({ name: "", provider: "", apiKey: "" });
	}, [mode, initialData, open]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit Model" : "Add New Model"}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? "Update the configuration for this model"
							: "Configure a new AI model for your organization"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 pt-4">
					<div className="flex gap-4">
						<div className="flex-1 space-y-2">
							<Label>Model Name</Label>
							<Select
								value={form.name}
								onValueChange={(v) => setForm({ ...form, name: v })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a model" />
								</SelectTrigger>
								<SelectContent>
									{modelOptions.map((m) => (
										<SelectItem key={m.id} value={m.modelName}>
											{m.modelName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1 space-y-2">
							<Label>Provider</Label>
							<Select
								value={form.provider}
								onValueChange={(v) => setForm({ ...form, provider: v })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a provider" />
								</SelectTrigger>
								<SelectContent>
									{[...new Set(modelOptions.map((m) => m.provider))].map(
										(provider) => (
											<SelectItem key={provider} value={provider}>
												{provider}
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label>API Key</Label>
						<Input
							placeholder="Enter API key"
							value={form.apiKey}
							onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button onClick={() => onSubmit(form)}>
							{mode === "edit" ? "Save Changes" : "Add Model"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
