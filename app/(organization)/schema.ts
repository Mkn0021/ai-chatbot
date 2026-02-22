import "server-only";

import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { organization } from "@/lib/db/schemas";

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
