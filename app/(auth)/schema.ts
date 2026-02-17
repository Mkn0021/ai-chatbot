import { z } from "zod";
import { user } from "@/lib/db/schemas";
import { createSelectSchema } from "drizzle-zod";

const UserSchema = createSelectSchema(user, {
	email: z.email("Please enter a valid email address"),
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be less than 100 characters"),
});

export const SignupFormSchema = z
	.object({
		name: UserSchema.shape.name,
		email: UserSchema.shape.email,
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const LoginFormSchema = z.object({
	email: UserSchema.shape.email,
	password: SignupFormSchema.shape.password,
});

export type SignupForm = z.infer<typeof SignupFormSchema>;
export type LoginForm = z.infer<typeof LoginFormSchema>;
