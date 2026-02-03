import Image from "next/image";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Logo } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";
import AuthForm from "@/components/loginpage/auth-form";
import {
	SectionHeader,
	SectionSubHeader,
} from "@/components/ui/section-header";

export default function Login() {
	return (
		<div className="relative flex h-screen overflow-y-hidden font-sans">
			<div className="flex h-full w-full xl:mx-12">
				<div
					className={cn(
						"relative hidden flex-col items-start px-14 py-5 lg:flex lg:w-1/2",
						"before:absolute before:inset-y-0 before:right-0 before:-left-[100vw] before:-z-10 before:bg-gray-50",
					)}
				>
					<Logo className="mb-8" />
					<div className="flex flex-col gap-2 py-10">
						<SectionHeader as="h1">
							Transform Your
							<span className="text-primary"> Data</span>
							<br />
							into <span className="text-primary">AI-Driven</span> Actions
						</SectionHeader>
						<SectionSubHeader className="max-w-lg">
							Instantly query, analyze, and automate across your databases with
							AI that runs locally or in the cloud, fully private and under your
							control.
						</SectionSubHeader>
						<Image
							src={"/dotted-world-map.svg"}
							width={600}
							height={600}
							alt="Dotted Map"
							className="mt-10"
						/>
					</div>
				</div>
				<div className="flex flex-1 flex-col items-center justify-center px-6 py-4">
					<Logo className="mb-8 lg:hidden" />
					<Suspense
						fallback={
							<div className="flex h-dvh items-center justify-center">
								<Spinner size="large" />
							</div>
						}
					>
						<AuthForm />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
