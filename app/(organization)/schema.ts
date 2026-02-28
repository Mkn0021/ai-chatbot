import "server-only";

import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import {
	organization,
	organizationModel,
	databaseConnection,
} from "@/lib/db/schemas";

const OrgSelectSchema = createSelectSchema(organization);
const OrgInsertSchema = createInsertSchema(organization).omit({
	id: true,
	createdAt: true,
});

export const UpdateOrganizationSchema = {
	body: OrgInsertSchema.partial(),
};

export type UpdateOrganizationInput = z.infer<
	typeof UpdateOrganizationSchema.body
>;

export type Organization = z.infer<typeof OrgSelectSchema>;
export type OrganizationFormData = Pick<Organization, "name"> & {
	dailyMessageLimit: number;
};

const OrgModelSelectSchema = createSelectSchema(organizationModel);
const OrgModelInsertSchema = createInsertSchema(organizationModel).omit({
	organizationId: true,
	createdAt: true,
	updatedAt: true,
});

export const CreateOrganizationModelSchema = {
	body: OrgModelInsertSchema,
};

export const UpdateOrganizationModelSchema = {
	body: OrgModelInsertSchema.partial(),
};

export type CreateOrganizationModelInput = z.infer<
	typeof CreateOrganizationModelSchema.body
>;
export type UpdateOrganizationModelInput = z.infer<
	typeof UpdateOrganizationModelSchema.body
>;
export type OrganizationModel = z.infer<typeof OrgModelSelectSchema>;

export const ConnectDatabaseSchema = {
	body: z.object({
		connectionString: z.string().min(1, "Connection string is required"),
		name: z.string().optional(),
	}),
};

export const UpdateTableSelectionSchema = {
	body: z.object({
		selectedTables: z.array(z.string()),
	}),
};

export type ConnectDatabaseInput = z.infer<typeof ConnectDatabaseSchema.body>;

export type UpdateTableSelectionInput = z.infer<
	typeof UpdateTableSelectionSchema.body
>;

const DbConnectionSelectSchema = createSelectSchema(databaseConnection);
export type DatabaseConnection = z.infer<typeof DbConnectionSelectSchema>;

export interface DatabaseColumn {
	column_name: string;
	data_type: string;
}

export interface DatabaseTable {
	table_schema: string;
	table_name: string;
	columns: DatabaseColumn[];
	isSelected?: boolean;
}
