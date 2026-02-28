import { relations } from "drizzle-orm";
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
	dailyMessageLimit: integer("daily_message_limit").default(1000).notNull(),
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
	tablesData: jsonb("tables_data"),
	selectedTables: jsonb("selected_tables").$type<string[]>().default([]),
	databaseContext: text("database_context"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizationRelations = relations(
	organization,
	({ one, many }) => ({
		databaseConnection: one(databaseConnection, {
			fields: [organization.id],
			references: [databaseConnection.organizationId],
		}),
		models: many(organizationModel),
	}),
);

export const databaseConnectionRelations = relations(
	databaseConnection,
	({ one }) => ({
		organization: one(organization, {
			fields: [databaseConnection.organizationId],
			references: [organization.id],
		}),
	}),
);

export const organizationModelRelations = relations(
	organizationModel,
	({ one }) => ({
		organization: one(organization, {
			fields: [organizationModel.organizationId],
			references: [organization.id],
		}),
	}),
);
