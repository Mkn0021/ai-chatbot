import "server-only";

import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { organization, organizationModel } from "@/lib/db/schemas";

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
	defaultModelId: string;
};

const OrgModelSelectSchema = createSelectSchema(organizationModel);
const OrgModelInsertSchema = createInsertSchema(organizationModel).omit({
	id: true,
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
