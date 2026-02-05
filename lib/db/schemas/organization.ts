import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const organization = pgTable("organizations", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	dailyMessageLimit: integer("daily_message_limit").default(1000),
	userDailyLimit: integer("user_daily_limit").default(100),
	defaultModelId: text("default_model_id"),
	databaseUrl: text("database_url"),
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
});
