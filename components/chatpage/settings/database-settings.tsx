"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Database,
	Link as LinkIcon,
	CheckCircle2,
	XCircle,
	MoreHorizontal,
	Trash,
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface DatabaseTable {
	id: string;
	name: string;
	schema: string;
	rowCount: number;
	selected: boolean;
}

export function DatabaseSettings() {
	const [connectionString, setConnectionString] = useState("");
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [tables, setTables] = useState<DatabaseTable[]>([]);

	const handleConnect = async () => {
		if (!connectionString) {
			toast.error("Please enter a connection string");
			return;
		}

		setIsConnecting(true);

		// Simulating database connection
		setTimeout(() => {
			setIsConnected(true);
			setIsConnecting(false);
			toast.success("Connected successfully");

			// Simulating fetched tables
			setTables([
				{
					id: "1",
					name: "users",
					schema: "public",
					rowCount: 1543,
					selected: false,
				},
				{
					id: "2",
					name: "products",
					schema: "public",
					rowCount: 892,
					selected: false,
				},
				{
					id: "3",
					name: "orders",
					schema: "public",
					rowCount: 3421,
					selected: false,
				},
			]);
		}, 1500);
	};

	const handleDisconnect = () => {
		setIsConnected(false);
		setTables([]);
		setConnectionString("");
		toast.info("Disconnected from database");
	};

	const handleToggleAccess = (table: DatabaseTable) => {
		setTables(
			tables.map((t) =>
				t.id === table.id ? { ...t, selected: !t.selected } : t,
			),
		);
		toast.success(
			`${table.name} is now ${!table.selected ? "accessible" : "restricted"}`,
		);
	};

	const handleRemoveTable = (id: string) => {
		setTables(tables.filter((t) => t.id !== id));
		toast.success("Table removed");
	};

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
						{!isConnected ? (
							<Button
								onClick={handleConnect}
								disabled={!connectionString || isConnecting}
								className="gap-2"
							>
								<LinkIcon className="h-4 w-4" />
								{isConnecting ? "Connecting..." : "Connect"}
							</Button>
						) : (
							<Button
								onClick={handleDisconnect}
								variant="outline"
								className="gap-2"
							>
								<XCircle className="h-4 w-4" />
								Disconnect
							</Button>
						)}
					</div>
					{isConnected && (
						<div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
							<CheckCircle2 className="h-4 w-4" />
							Connected successfully
						</div>
					)}
				</div>
			</div>

			<DatabaseTablesTable
				tables={tables}
				isConnected={isConnected}
				onToggleAccess={handleToggleAccess}
				onRemove={handleRemoveTable}
			/>
		</div>
	);
}

interface DatabaseTablesTableProps {
	tables: DatabaseTable[];
	isConnected: boolean;
	onToggleAccess: (table: DatabaseTable) => void;
	onRemove: (id: string) => void;
}

const DatabaseTablesTable = ({
	tables,
	isConnected,
	onToggleAccess,
	onRemove,
}: DatabaseTablesTableProps) => {
	const getStatusVariant = (selected: boolean) => {
		return selected ? "default" : "secondary";
	};

	return (
		<div className="mt-4 overflow-hidden rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Table Name</TableHead>
						<TableHead>Schema</TableHead>
						<TableHead>Row Count</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="w-[60px] text-right">Actions</TableHead>
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
						<TableRow key={table.id}>
							<TableCell>
								<div className="flex items-center gap-2">
									<Database className="text-muted-foreground h-4 w-4" />
									<span className="font-medium">{table.name}</span>
								</div>
							</TableCell>

							<TableCell className="text-muted-foreground">
								<Badge variant="outline">{table.schema}</Badge>
							</TableCell>

							<TableCell className="text-muted-foreground">
								{table.rowCount.toLocaleString()} rows
							</TableCell>

							<TableCell>
								<Badge
									variant={getStatusVariant(table.selected)}
									className="capitalize"
								>
									{table.selected ? "Accessible" : "Restricted"}
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
										<DropdownMenuItem onClick={() => onToggleAccess(table)}>
											<CheckCircle2 className="mr-2 h-4 w-4" />
											{table.selected ? "Restrict Access" : "Grant Access"}
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={() => onRemove(table.id)}
											className="text-destructive focus:text-destructive"
										>
											<Trash className="text-destructive mr-2 h-4 w-4" />
											Remove
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
