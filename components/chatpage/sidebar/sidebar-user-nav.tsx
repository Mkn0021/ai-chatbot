"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { useTheme } from "next-themes";
import type { User } from "@/app/(user)/schema";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/(auth)/actions";
import { ChevronUp, Loader2 } from "lucide-react";
import { Settings } from "@/components/chatpage/settings";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarUserNav({ user }: { user: User }) {
	const router = useRouter();
	const { isPending } = authClient.useSession();
	const { setTheme, resolvedTheme } = useTheme();
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						{isPending ? (
							<SidebarMenuButton className="bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 justify-between">
								<div className="flex flex-row gap-2">
									<div className="size-6 animate-pulse rounded-full bg-zinc-500/30" />
									<span className="animate-pulse rounded-md bg-zinc-500/30 text-transparent">
										Loading auth status
									</span>
								</div>
								<div className="animate-spin text-zinc-500">
									<Loader2 />
								</div>
							</SidebarMenuButton>
						) : (
							<SidebarMenuButton
								className="bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 focus-visible:ring-0"
								data-testid="user-nav-button"
							>
								<Image
									alt={user.name ?? "User Avatar"}
									className="rounded-full"
									height={24}
									src={user.image!}
									width={24}
								/>
								<span className="truncate" data-testid="user-name">
									{user?.name}
								</span>
								<ChevronUp className="ml-auto" />
							</SidebarMenuButton>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-popper-anchor-width)"
						data-testid="user-nav-menu"
						side="top"
					>
						<DropdownMenuItem
							className="cursor-pointer"
							data-testid="user-nav-item-theme"
							onSelect={() =>
								setTheme(resolvedTheme === "dark" ? "light" : "dark")
							}
						>
							{`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
						</DropdownMenuItem>
						<DropdownMenuItem
							data-testid="user-nav-item-settings"
							onSelect={(e) => e.preventDefault()}
						>
							<Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild data-testid="user-nav-item-auth">
							<button
								className="w-full cursor-pointer"
								onClick={async () => {
									if (isPending) {
										toast.error(
											"Checking authentication status, please try again!",
										);
										return;
									}

									await authClient.signOut();
									router.push("/");
								}}
								type="button"
							>
								Sign out
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
