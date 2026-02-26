"use client";

import { memo } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarToggle } from "./sidebar/sidebar-toggle";
import { VisibilitySelector } from "./visibility-selector";
import type { VisibilityType } from "@/app/(chat)/schema";

function PureChatHeader({
	chatId,
	selectedVisibilityType,
	isReadonly,
}: {
	chatId: string;
	selectedVisibilityType: VisibilityType;
	isReadonly: boolean;
}) {
	const router = useRouter();

	return (
		<header className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between gap-2 bg-linear-to-b from-white to-transparent px-2 py-6 md:px-2 dark:from-black dark:to-transparent">
			<div className="flex items-center gap-2">
				<SidebarToggle className="mr-2" />
				<Button
					className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2 md:group-data-[state=expanded]/sidebar-wrapper:hidden"
					onClick={() => {
						router.push("/chat");
						router.refresh();
					}}
					variant="outline"
				>
					<Plus />
					<span className="md:sr-only">New Chat</span>
				</Button>
			</div>

			{!isReadonly && (
				<VisibilitySelector
					chatId={chatId}
					className="order-1 mr-6 md:order-2"
					selectedVisibilityType={selectedVisibilityType}
				/>
			)}
		</header>
	);
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
	return (
		prevProps.chatId === nextProps.chatId &&
		prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
		prevProps.isReadonly === nextProps.isReadonly
	);
});
