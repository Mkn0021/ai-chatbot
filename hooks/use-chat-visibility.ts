"use client";

import { useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { fetcher } from "@/lib/utils";
import {
    type ChatHistory,
    getChatHistoryPaginationKey,
} from "@/components/chatpage/sidebar/sidebar-history";
import type { VisibilityType } from "@/app/(chat)/schema";

export function useChatVisibility({
    chatId,
    initialVisibilityType,
}: {
    chatId: string;
    initialVisibilityType: VisibilityType;
}) {
    const { mutate, cache } = useSWRConfig();
    const history: ChatHistory = cache.get("/api/history")?.data;

    const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
        `${chatId}-visibility`,
        null,
        {
            fallbackData: initialVisibilityType,
        }
    );

    const visibilityType = useMemo(() => {
        if (!history) {
            return localVisibility;
        }
        const chat = history.chats.find((currentChat) => currentChat.id === chatId);
        if (!chat) {
            return "private";
        }
        return chat.visibility;
    }, [history, chatId, localVisibility]);

    const setVisibilityType = async (updatedVisibilityType: VisibilityType) => {
        setLocalVisibility(updatedVisibilityType);
        mutate(unstable_serialize(getChatHistoryPaginationKey));

        await fetcher("/api/chat/visibility", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: chatId,
                visibility: updatedVisibilityType,
            }),
        });
    };

    return { visibilityType, setVisibilityType };
}