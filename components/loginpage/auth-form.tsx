"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorContext } from "better-auth/react";
import { authClient } from "@/app/(auth)/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
	SignupFormSchema,
	SignupForm,
	LoginFormSchema,
	LoginForm,
} from "@/app/(auth)/schema";

import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const AuthForm: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const urlMode = searchParams.get("tab");
	const initialMode = urlMode === "sign-up" ? "signup" : "login";
	const [mode, setMode] = useState<"login" | "signup">(initialMode);
	const [loading, setLoading] = useState(false);

	const form = useForm<SignupForm | LoginForm>({
		resolver: zodResolver(
			mode === "signup" ? SignupFormSchema : LoginFormSchema,
		),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
	});

	useEffect(() => {
		const currentValues = form.getValues();
		form.reset({
			name: "",
			email: currentValues.email || "",
			password: currentValues.password || "",
			confirmPassword: "",
		});
	}, [mode]);

	const onSubmit = async (values: SignupForm | LoginForm) => {
		setLoading(true);

		const formConfig = {
			callbackURL: "/chat",
			fetchOptions: {
				onResponse: () => setLoading(false),
				onRequest: () => setLoading(true),
				onError: (ctx: ErrorContext) => {
					const message = ctx.error.message;

					const isDbError =
						message.includes("connect ECONNREFUSED") ||
						message.includes("Failed query") ||
						message.includes("SERVER_ERROR");

					toast.error(
						isDbError ? "Server unavailable. Please try again later." : message,
					);

					if (!isDbError) {
						form.setError("email", { type: "manual", message: message });
						form.setError("password", { type: "manual", message: message });
					}
				},
				onSuccess: async () => {
					const session = await authClient.getSession();
					const redirectPath =
						session.data?.user.role === "admin" ? "/dashboard" : "/chat";
					router.push(redirectPath);
				},
			},
		};

		try {
			if (mode === "signup") {
				const signupValues = values as SignupForm;

				await authClient.signUp.email({
					name: signupValues.name,
					email: signupValues.email,
					password: signupValues.password,
					organizationId: "",
					...formConfig,
				});
			} else {
				const loginValues = values as LoginForm;

				await authClient.signIn.email({
					email: loginValues.email,
					password: loginValues.password,
					...formConfig,
				});
			}
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleForgotPassword = async () => {
		//TODO: Implement forget password flow
	};

	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/chat",
		});
	};

	return (
		<div className="w-full max-w-md space-y-6">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold text-neutral-800">
					{mode === "signup" ? "Create your account" : "Welcome Back"}
				</h1>
				<p className="text-sm text-neutral-600">
					{mode === "signup" ? "Sign up to continue" : "Sign in to get started"}
				</p>
			</div>

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				{mode === "signup" && (
					<Controller
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Full Name</FieldLabel>
								<Input
									aria-invalid={fieldState.invalid}
									placeholder="Enter your full name"
									{...field}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				)}

				<Controller
					control={form.control}
					name="email"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Email</FieldLabel>
							<Input
								aria-invalid={fieldState.invalid}
								placeholder="Enter your email"
								{...field}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="password"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>Password</FieldLabel>
							<PasswordInput
								aria-invalid={fieldState.invalid}
								placeholder="••••••••"
								autoComplete={mode === "signup" ? "new-password" : "password"}
								{...field}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{mode === "signup" && (
					<Controller
						control={form.control}
						name="confirmPassword"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Confirm Password</FieldLabel>
								<PasswordInput
									aria-invalid={fieldState.invalid}
									placeholder="••••••••"
									autoComplete="new-password"
									{...field}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				)}

				<Button
					type="submit"
					className="w-full"
					disabled={loading}
					variant="default"
				>
					{mode === "signup" ? "Continue" : "Sign In"}
				</Button>
				<Button
					type="button"
					disabled={loading}
					className="flex w-full items-center justify-center gap-2"
					onClick={handleGoogleLogin}
				>
					<Icons.google />
					Continue with Google
				</Button>
			</form>

			<div className="text-center text-sm">
				{mode === "signup" ? "Already registered? " : "Don't have an account? "}
				<button
					className="text-primary font-semibold hover:underline"
					onClick={() => setMode(mode === "signup" ? "login" : "signup")}
				>
					{mode === "signup" ? "Sign In" : "Sign Up"}
				</button>
			</div>
		</div>
	);
};

export default AuthForm;
