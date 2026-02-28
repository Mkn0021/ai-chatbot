"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Database,
	Link as LinkIcon,
	CheckCircle2,
	XCircle,
	Save,
	Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type {
	DatabaseTable,
	GetDatabaseConnectionResult,
} from "@/app/(organization)/schema";
import { fetcher } from "@/lib/utils";

export function DatabaseSettings() {
	const [connectionString, setConnectionString] = useState("");
	const [isConnecting, setIsConnecting] = useState(false);
	const [localTables, setLocalTables] = useState<DatabaseTable[]>([]);

	const { data: connectionData, mutate } =
		useSWR<GetDatabaseConnectionResult | null>(
			"/api/organization/database",
			fetcher,
		);

	const isConnected = connectionData !== null;
	const savedTables = connectionData?.tables || [];
	const displayTables = localTables.length > 0 ? localTables : savedTables;

	const handleConnect = async () => {
		if (!connectionString) {
			toast.error("Please enter a connection string");
			return;
		}

		setIsConnecting(true);

		try {
			const result = await fetcher<GetDatabaseConnectionResult>(
				"/api/organization/database",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ connectionString }),
				},
			);

			mutate(result);
			setConnectionString("");
			setLocalTables([]);
			toast.success("Connected and saved successfully");
		} catch (error: any) {
			toast.error(error.message || "Failed to connect to database");
		} finally {
			setIsConnecting(false);
		}
	};

	const handleDisconnect = async () => {
		setIsConnecting(true);

		try {
			await fetcher("/api/organization/database", {
				method: "DELETE",
			});

			mutate(null);
			setLocalTables([]);
			toast.success("Database disconnected successfully");
		} catch (error: any) {
			toast.error(error.message || "Failed to disconnect database");
		} finally {
			setIsConnecting(false);
		}
	};

	const handleToggleAccess = (table: DatabaseTable) => {
		const updatedTables = displayTables.map((t) =>
			t.table_schema === table.table_schema && t.table_name === table.table_name
				? { ...t, isSelected: !t.isSelected }
				: t,
		);
		setLocalTables(updatedTables);
	};

	const handleSaveSelection = async () => {
		const selectedTables = displayTables
			.filter((t) => t.isSelected)
			.map((t) => `${t.table_schema}.${t.table_name}`);

		try {
			const result = await fetcher<GetDatabaseConnectionResult>(
				"/api/organization/database",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ selectedTables }),
				},
			);

			mutate(result);
			setLocalTables([]);
			toast.success("Table selection saved");
		} catch (error: any) {
			toast.error(error.message || "Failed to save selection");
		}
	};

	const hasChanges = localTables.length > 0;

	return (
		<div>
			<div className="mb-6">
				<h2 className="mb-1 text-xl font-semibold">Database Configuration</h2>
				<p className="text-muted-foreground text-sm">
					Connect your database and select tables for AI model access
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="connection-string">Connection String</Label>
					<div className="flex gap-2">
						<Input
							id="connection-string"
							placeholder="postgresql://user:password@host:port/database"
							value={connectionString}
							onChange={(e) => setConnectionString(e.target.value)}
							disabled={isConnected || isConnecting}
						/>
						<Button
							onClick={isConnected ? handleDisconnect : handleConnect}
							disabled={isConnecting || (!isConnected && !connectionString)}
							className="gap-2"
							variant={isConnected ? "destructive" : "secondary"}
						>
							{isConnecting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : isConnected ? (
								<XCircle className="h-4 w-4" />
							) : (
								<LinkIcon className="h-4 w-4" />
							)}
							<span className="hidden sm:inline">
								{isConnecting
									? isConnected
										? "Disconnecting..."
										: "Connecting..."
									: isConnected
										? "Disconnect"
										: "Connect & Save"}
							</span>
						</Button>
					</div>
					{isConnected && (
						<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
							<CheckCircle2 className="h-4 w-4" />
							Connected successfully
						</div>
					)}
				</div>

				{isConnected && hasChanges && (
					<Button onClick={handleSaveSelection} className="w-full gap-2">
						<Save className="h-4 w-4" />
						Save Table Selection
					</Button>
				)}
			</div>

			<DatabaseTablesTable
				tables={displayTables}
				isConnected={isConnected}
				onToggleAccess={handleToggleAccess}
			/>
		</div>
	);
}

interface DatabaseTablesTableProps {
	tables: DatabaseTable[];
	isConnected: boolean;
	onToggleAccess: (table: DatabaseTable) => void;
}

const DatabaseTablesTable = ({
	tables,
	isConnected,
	onToggleAccess,
}: DatabaseTablesTableProps) => {
	const getStatusVariant = (isSelected?: boolean) => {
		return isSelected ? "default" : "secondary";
	};

	return (
		<div className="mt-4 overflow-x-auto rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Table Name</TableHead>
						<TableHead
							className={isConnected ? "hidden sm:table-cell" : "hidden"}
						>
							Schema
						</TableHead>
						<TableHead
							className={isConnected ? "hidden md:table-cell" : "hidden"}
						>
							Columns
						</TableHead>
						<TableHead
							className={isConnected ? "hidden sm:table-cell" : "hidden"}
						>
							Status
						</TableHead>
						<TableHead className={isConnected ? "text-center" : "hidden"}>
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{tables.length === 0 && (
						<TableRow>
							<TableCell className="text-muted-foreground py-8 text-center">
								{isConnected ? (
									<>
										<Database className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
										<p>No tables found in the connected database</p>
									</>
								) : (
									<>
										<Database className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
										<p className="font-medium">
											Connect database to fetch all tables
										</p>
										<p className="text-sm">
											Enter your connection string above and click Connect
										</p>
									</>
								)}
							</TableCell>
						</TableRow>
					)}

					{tables.map((table) => (
						<TableRow key={`${table.table_schema}.${table.table_name}`}>
							<TableCell className="flex items-center gap-2">
								<Database className="text-muted-foreground size-6 sm:size-4" />
								<div>
									<h3 className="font-medium">{table.table_name}</h3>
									<Badge variant="outline" className="mt-1 sm:hidden">
										{table.columns.length} columns
									</Badge>
								</div>
							</TableCell>

							<TableCell className="text-muted-foreground hidden sm:table-cell">
								<Badge variant="outline">{table.table_schema}</Badge>
							</TableCell>

							<TableCell className="text-muted-foreground hidden text-sm md:table-cell">
								{table.columns.length} columns
							</TableCell>

							<TableCell className="hidden sm:table-cell">
								<Badge
									variant={getStatusVariant(table.isSelected)}
									className="capitalize"
								>
									{table.isSelected ? "Accessible" : "Restricted"}
								</Badge>
							</TableCell>

							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<Badge
										variant={getStatusVariant(table.isSelected)}
										className="capitalize sm:hidden"
									>
										{table.isSelected ? "Accessible" : "Restricted"}
									</Badge>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onToggleAccess(table)}
										className="gap-2"
									>
										{table.isSelected ? (
											<>
												<XCircle className="h-4 w-4" />
												<span className="hidden lg:inline">Restrict</span>
											</>
										) : (
											<>
												<CheckCircle2 className="h-4 w-4" />
												<span className="hidden lg:inline">Grant</span>
											</>
										)}
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
