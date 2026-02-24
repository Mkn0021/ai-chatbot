import {
	pgTable,
	text,
	integer,
	timestamp,
	jsonb,
	boolean,
} from "drizzle-orm/pg-core";

export const organization = pgTable("organizations", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	dailyMessageLimit: integer("daily_message_limit").default(1000),
	createdAt: timestamp("created_at").defaultNow(),
});

export const organizationModel = pgTable("organization_models", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, {
			onDelete: "cascade",
		}),

	name: text("name").notNull(),
	provider: text("provider").notNull(),
	description: text("description").notNull(),
	baseUrl: text("base_url"),
	status: text("status").default("active"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const databaseConnection = pgTable("database_connections", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, {
			onDelete: "cascade",
		}),
	connectionString: text("connection_string").notNull(),
	name: text("name"),
	tablesData: jsonb("tables_data"), // Stores array of {table_schema, table_name, columns}
	selectedTables: jsonb("selected_tables").$type<string[]>().default([]), // Array like ['public.users', 'public.products']
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
