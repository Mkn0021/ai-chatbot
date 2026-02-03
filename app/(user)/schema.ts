import "server-only";

import { z } from "zod";
import { user } from "@/lib/db/schemas";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

const UserSelectSchema = createSelectSchema(user);

const UserInsertSchema = createInsertSchema(user).omit({
	id: true,
	email: true,
	emailVerified: true,
	createdAt: true,
	updatedAt: true,
});

export const UpdateMeSchema = {
	body: UserInsertSchema.omit({
		role: true,
	}).partial(),
};

export const AdminUpdateUserSchema = {
	params: z.object({
		userId: z.string().min(1),
	}),
	body: UserInsertSchema.partial(),
};

export const UserIdParamsSchema = {
	params: z.object({
		userId: z.string().min(1),
	}),
};

export const FetchUsersSchema = {
	query: z
		.object({
			limit: z.number().min(1).max(100).optional(),
			offset: z.number().min(0).optional(),
		})
		.optional(),
};

export type User = z.infer<typeof UserSelectSchema>;
export type UserWriteInput = z.infer<typeof UserInsertSchema>;
export type UpdateMeInput = z.infer<typeof UpdateMeSchema.body>;
export type AdminUpdateUserInput = z.infer<typeof AdminUpdateUserSchema.body>;
export type UserIdParams = z.infer<typeof UserIdParamsSchema.params>;
export type FetchUsersQuery = z.infer<typeof FetchUsersSchema.query>;
