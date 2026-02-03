import { z } from "zod";
import { user } from "@/lib/db/schemas";
import { createSelectSchema } from "drizzle-zod";

const UserSchema = createSelectSchema(user);

export const SignupFormSchema = z
	.object({
		name: UserSchema.shape.email,
		email: UserSchema.shape.email,
		password: z.string().min(6, "Password must be at least 6 characters"),
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
