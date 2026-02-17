"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";

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
						isDbError
							? "Server unavailable. Please try again later."
							: message
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

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					{mode === "signup" && (
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter your full name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Enter your email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<PasswordInput
										placeholder="••••••••"
										autoComplete={
											mode === "signup" ? "new-password" : "password"
										}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{mode === "signup" && (
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<PasswordInput
											placeholder="••••••••"
											autoComplete="new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
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
			</Form>

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
