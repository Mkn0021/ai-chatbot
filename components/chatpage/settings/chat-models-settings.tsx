"use client";

import useSWR, { type KeyedMutator } from "swr";
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
import {
	Copy,
	MoreHorizontal,
	MoreVertical,
	Pencil,
	Plus,
	Trash,
} from "lucide-react";
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

import { DEFAULT_MODELS } from "@/lib/ai/models";
import { PasswordInput } from "@/components/ui/password-input";
import { fetcher, getApiKey, removeApiKey, setApiKey } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type ModelStatus = "active" | "inactive" | "error";

type ModelItem = {
	id: string;
	name: string;
	provider: string;
	description: string;
	baseUrl?: string | null;
	status: ModelStatus;
	createdAt?: Date | null;
	updatedAt?: Date | null;
};

export function ChatModelsSettings() {
	const {
		data: models,
		error,
		isLoading,
		mutate,
	} = useSWR<ModelItem[]>("/api/organization/model", fetcher);

	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);

	if (error) {
		return (
			<div className="text-destructive py-8 text-center">
				Failed to load models. Please try again.
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h2 className="mb-1 text-xl font-semibold">Chat Models</h2>
					<p className="text-muted-foreground text-sm">
						Configure AI models and API keys
					</p>
				</div>

				<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							<span className="hidden sm:inline">Add Model</span>
						</Button>
					</DialogTrigger>
				</Dialog>
			</div>

			<ModelDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				mode="add"
				mutate={mutate}
			/>

			<ModelDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				mode="edit"
				selectedModel={selectedModel}
				mutate={mutate}
			/>

			{isLoading ? (
				<div className="text-muted-foreground w-full py-8 text-center">
					Loading models...
				</div>
			) : (
				<ChatModelsTable
					models={models || []}
					onEdit={(model) => {
						setSelectedModel(model);
						setEditDialogOpen(true);
					}}
					mutate={mutate}
				/>
			)}
		</div>
	);
}

interface ChatModelsTableProps {
	models: ModelItem[];
	onEdit: (model: ModelItem) => void;
	mutate: KeyedMutator<ModelItem[]>;
}

const ChatModelsTable = ({ models, onEdit, mutate }: ChatModelsTableProps) => {
	const handleDeleteModel = async (modelId: string) => {
		try {
			const response = await fetch(`/api/organization/model?id=${modelId}`, {
				method: "DELETE",
			});

			const result = await response.json();

			if (response.ok) {
				removeApiKey(modelId);

				await mutate();
				toast.success("Model deleted successfully");
			} else {
				toast.error(result.message || "Failed to delete model");
			}
		} catch (error) {
			console.error("Error deleting model:", error);
			toast.error("Failed to delete model");
		}
	};

	const copyToClipboard = async (modelId: string) => {
		const apiKey = getApiKey(modelId);
		if (!apiKey) {
			toast.error("No API key found");
			return;
		}
		await navigator.clipboard.writeText(apiKey);
		toast.success("API key copied");
	};

	const maskKey = (modelId: string) => {
		const key = getApiKey(modelId);
		if (!key) return "Not set";
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

	return (
		<div className="mt-4 overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							Model
							<span className="hidden sm:inline"> Name</span>
						</TableHead>
						<TableHead className="hidden sm:table-cell">Provider</TableHead>
						<TableHead className="hidden md:table-cell">
							API Key / URL
						</TableHead>
						<TableHead className="hidden sm:table-cell">Status</TableHead>
						<TableHead className="text-center">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{models.map((item) => (
						<TableRow key={item.id}>
							<TableCell className="font-medium">
								<div>
									<div>{item.name}</div>
									<Badge
										className="mt-1 capitalize sm:hidden"
										variant="outline"
									>
										{item.provider}
									</Badge>
								</div>
							</TableCell>

							<TableCell className="hidden capitalize sm:table-cell">
								{item.provider}
							</TableCell>

							<TableCell className="hidden md:table-cell">
								<div className="flex items-center gap-2">
									{item.baseUrl ? (
										<span className="font-mono text-sm">{item.baseUrl}</span>
									) : (
										<>
											<span className="font-mono text-sm tracking-wide">
												{maskKey(item.id)}
											</span>

											<Button
												variant="ghost"
												size="icon"
												onClick={() => copyToClipboard(item.id)}
											>
												<Copy className="h-4 w-4" />
											</Button>
										</>
									)}
								</div>
							</TableCell>

							<TableCell className="hidden sm:table-cell">
								<Badge
									variant={getStatusVariant(item.status)}
									className="capitalize"
								>
									{item.status}
								</Badge>
							</TableCell>

							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<Badge
										variant={getStatusVariant(item.status)}
										className="capitalize sm:hidden"
									>
										{item.status}
									</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onEdit(item)}>
												<Pencil className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={() => handleDeleteModel(item.id)}
												className="text-destructive focus:text-destructive"
											>
												<Trash className="text-destructive mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</TableCell>
						</TableRow>
					))}

					{models.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className="text-muted-foreground py-8 text-center"
							>
								No models configured. Click "Add Model" to get started.
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
	selectedModel?: ModelItem | null;
	mutate: KeyedMutator<ModelItem[]>;
}

function ModelDialog({
	open,
	onOpenChange,
	mode,
	selectedModel,
	mutate,
}: ModelDialogProps) {
	const [form, setForm] = useState({
		name: "",
		provider: "",
		description: "",
		apiKey: "",
		baseUrl: "",
	});

	useEffect(() => {
		if (mode === "edit" && selectedModel) {
			setForm({
				name: selectedModel.name,
				provider: selectedModel.provider,
				description: selectedModel.description,
				apiKey: getApiKey(selectedModel.id),
				baseUrl: selectedModel.baseUrl || "",
			});
		}
		if (mode === "add") {
			setForm({
				name: "",
				provider: "",
				description: "",
				apiKey: "",
				baseUrl: "",
			});
		}
	}, [mode, selectedModel, open]);

	const handleSubmit = async () => {
		if (mode === "add") {
			try {
				const response = await fetch("/api/organization/model", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: form.name,
						provider: form.provider,
						description: form.description,
						baseUrl: form.baseUrl || null,
						status: "active",
					}),
				});

				const result = await response.json();

				if (response.ok) {
					if (form.apiKey) {
						setApiKey(result.data.id, form.apiKey);
					}

					mutate();
					onOpenChange(false);
					toast.success("Model added successfully");
				} else {
					toast.error(result.message || "Failed to add model");
				}
			} catch (error) {
				console.error("Error adding model:", error);
				toast.error("Failed to add model");
			}
		} else if (mode === "edit" && selectedModel) {
			try {
				const response = await fetch(
					`/api/organization/model?id=${selectedModel.id}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							name: form.name,
							provider: form.provider,
							description: form.description,
							baseUrl: form.baseUrl || null,
						}),
					},
				);

				const result = await response.json();

				if (response.ok) {
					if (form.apiKey) {
						setApiKey(selectedModel.id, form.apiKey);
					}

					mutate();
					onOpenChange(false);
					toast.success("Model updated successfully");
				} else {
					toast.error(result.message || "Failed to update model");
				}
			} catch (error) {
				console.error("Error updating model:", error);
				toast.error("Failed to update model");
			}
		}
	};

	const isLocalProvider =
		form.provider.toLowerCase() === "ollama" ||
		form.provider.toLowerCase() === "local";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-96">
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
							<Label>Provider</Label>
							<Select
								value={form.provider}
								onValueChange={(v) =>
									setForm({ ...form, provider: v, name: "", description: "" })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a provider" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="openai">OpenAI</SelectItem>
									<SelectItem value="google">Google</SelectItem>
									<SelectItem value="ollama">Ollama (Local)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1 space-y-2">
							<Label>Model Name</Label>
							<Select
								value={
									DEFAULT_MODELS.find(
										(m) => m.name === form.name && m.provider === form.provider,
									)?.id || (form.name ? "custom" : "")
								}
								disabled={!form.provider}
								onValueChange={(v) => {
									const selectedModel = DEFAULT_MODELS.find((m) => m.id === v);
									if (selectedModel) {
										setForm({
											...form,
											name: selectedModel.name,
											provider: selectedModel.provider,
											description: selectedModel.description,
										});
									} else {
										setForm({ ...form, name: v });
									}
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a model" />
								</SelectTrigger>
								<SelectContent>
									{DEFAULT_MODELS.filter(
										(m) => m.provider === form.provider,
									).map((m) => (
										<SelectItem key={m.id} value={m.id}>
											{m.name}
										</SelectItem>
									))}
									<SelectItem value="custom">Custom Model</SelectItem>
								</SelectContent>
							</Select>
							{(DEFAULT_MODELS.find(
								(m) => m.name === form.name && m.provider === form.provider,
							)?.id || (form.name ? "custom" : "")) === "custom" && (
								<Input
									placeholder="Enter custom model name"
									value={form.name === "custom" ? "" : form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									className="mt-2"
								/>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Description</Label>
						<Textarea
							placeholder="Enter model description"
							value={form.description}
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
							rows={3}
						/>
					</div>

					{isLocalProvider ? (
						<div className="space-y-2">
							<Label>Base URL</Label>
							<Input
								placeholder="http://localhost:11434 (for Ollama)"
								value={form.baseUrl}
								onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
							/>
							<p className="text-muted-foreground text-xs">
								Enter the base URL for your local model server
							</p>
						</div>
					) : (
						<div className="space-y-2">
							<Label>API Key</Label>
							<PasswordInput
								placeholder="Enter API key"
								value={form.apiKey}
								onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
							/>
							<p className="text-muted-foreground text-xs">
								API keys are stored securely in your browser's local storage
							</p>
						</div>
					)}

					<div className="flex justify-end gap-2 pt-4">
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={!form.name || !form.provider || !form.description}
						>
							{mode === "edit" ? "Save Changes" : "Add Model"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
