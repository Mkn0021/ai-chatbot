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

interface DatabaseColumn {
	column_name: string;
	data_type: string;
}

interface DatabaseTable {
	table_schema: string;
	table_name: string;
	columns: DatabaseColumn[];
	isSelected?: boolean;
}

interface ConnectionData {
	connection: {
		id: string;
		name: string | null;
		isActive: boolean | null;
	};
	tables: DatabaseTable[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DatabaseSettings() {
	const [connectionString, setConnectionString] = useState("");
	const [isConnecting, setIsConnecting] = useState(false);
	const [localTables, setLocalTables] = useState<DatabaseTable[]>([]);

	const { data: connectionData, mutate } = useSWR<{
		success: boolean;
		data: ConnectionData | null;
	}>("/api/organization/database/connect", fetcher);

	const isConnected = connectionData?.data !== null;
	const savedTables = connectionData?.data?.tables || [];
	const displayTables = localTables.length > 0 ? localTables : savedTables;

	const handleConnect = async () => {
		if (!connectionString) {
			toast.error("Please enter a connection string");
			return;
		}

		setIsConnecting(true);

		try {
			const response = await fetch("/api/organization/database/connect", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ connectionString }),
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.error || "Failed to connect to database");
				setIsConnecting(false);
				return;
			}

			mutate();
			setConnectionString("");
			setLocalTables([]);
			toast.success("Connected and saved successfully");
		} catch (error: any) {
			toast.error(error.message || "Failed to connect to database");
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
			const response = await fetch("/api/organization/database/connect", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ selectedTables }),
			});

			if (!response.ok) {
				const result = await response.json();
				toast.error(result.error || "Failed to save selection");
				return;
			}

			mutate();
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
							type="password"
							placeholder="postgresql://user:password@host:port/database"
							value={connectionString}
							onChange={(e) => setConnectionString(e.target.value)}
							disabled={isConnected}
						/>
						<Button
							onClick={handleConnect}
							disabled={!connectionString || isConnecting || isConnected}
							className="gap-2"
						>
							<LinkIcon className="h-4 w-4" />
							{isConnecting ? "Connecting..." : "Connect & Save"}
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
		<div className="mt-4 overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Table Name</TableHead>
						<TableHead>Schema</TableHead>
						<TableHead>Columns</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="w-[100px] text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{tables.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className="text-muted-foreground py-8 text-center"
							>
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
							<TableCell>
								<div className="flex items-center gap-2">
									<Database className="text-muted-foreground h-4 w-4" />
									<span className="font-medium">{table.table_name}</span>
								</div>
							</TableCell>

							<TableCell className="text-muted-foreground">
								<Badge variant="outline">{table.table_schema}</Badge>
							</TableCell>

							<TableCell className="text-muted-foreground text-sm">
								{table.columns.length} columns
							</TableCell>

							<TableCell>
								<Badge
									variant={getStatusVariant(table.isSelected)}
									className="capitalize"
								>
									{table.isSelected ? "Accessible" : "Restricted"}
								</Badge>
							</TableCell>

							<TableCell className="text-right">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onToggleAccess(table)}
									className="gap-2"
								>
									{table.isSelected ? (
										<>
											<XCircle className="h-4 w-4" />
											Restrict
										</>
									) : (
										<>
											<CheckCircle2 className="h-4 w-4" />
											Grant
										</>
									)}
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
