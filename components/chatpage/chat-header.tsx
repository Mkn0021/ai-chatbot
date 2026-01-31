"use client";

import { memo } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
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
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center gap-2 px-2 py-6 md:px-2 bg-linear-to-b from-white to-transparent dark:from-black dark:to-transparent">
      <div>
        <SidebarToggle className="mr-2" />
        {(!open || windowWidth < 768) && (
          <Button
            className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
            onClick={() => {
              router.push("/chat");
              router.refresh();
            }}
            variant="outline"
          >
            <Plus />
            <span className="md:sr-only">New Chat</span>
          </Button>
        )}
      </div>

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          className="order-1 md:order-2 mr-6"
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
