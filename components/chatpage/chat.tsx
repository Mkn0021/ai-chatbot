"use client";

import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDataStream } from "./data-stream-provider";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatVisibility } from "@/hooks/use-chat-visibility";

import type { Vote } from "@/lib/db/schemas";
import type { Attachment, ChatMessage } from "@/types";
import type { VisibilityType } from "@/app/(chat)/schema";

import { ChatHeader } from "./chat-header";
import { Messages } from "./message/messages";
import { MultimodalInput } from "./multimodal-input";
import { getChatHistoryPaginationKey } from "./sidebar/sidebar-history";
import { generateUUID, getLocalStorageItem } from "@/lib/utils";
import APIError from "@/lib/api/error";
import { useApi } from "@/lib/api/client";

export function Chat({
	id,
	initialMessages,
	initialChatModel,
	initialVisibilityType,
	isReadonly,
	autoResume,
}: {
	id: string;
	initialMessages: ChatMessage[];
	initialChatModel: string;
	initialVisibilityType: VisibilityType;
	isReadonly: boolean;
	autoResume: boolean;
}) {
	const router = useRouter();

	const { visibilityType } = useChatVisibility({
		chatId: id,
		initialVisibilityType,
	});

	const { mutate } = useSWRConfig();

	const handlePopState = useCallback(() => {
		router.refresh();
	}, [router]);

	useEffect(() => {
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [handlePopState]);
	const { setDataStream } = useDataStream();

	const [input, setInput] = useState<string>("");
	const [currentModelId, setCurrentModelId] = useState(initialChatModel);
	const currentModelIdRef = useRef(currentModelId);

	useEffect(() => {
		currentModelIdRef.current = currentModelId;
	}, [currentModelId]);

	async function fetchWithErrorHandlers(
		input: RequestInfo | URL,
		init?: RequestInit,
	) {
		try {
			const response = await fetch(input, init);

			if (!response.ok) {
				const body = await response.json();
				throw new APIError(body.error ?? body.cause, response.status, {
					code: body.code,
				});
			}

			return response;
		} catch (error: unknown) {
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				throw new APIError("You appear to be offline", 0);
			}

			throw error;
		}
	}

	const {
		messages,
		setMessages,
		sendMessage,
		status,
		stop,
		regenerate,
		resumeStream,
		addToolApprovalResponse,
	} = useChat<ChatMessage>({
		id,
		messages: initialMessages,
		generateId: generateUUID,
		sendAutomaticallyWhen: ({ messages: currentMessages }) => {
			const lastMessage = currentMessages.at(-1);
			const shouldContinue =
				lastMessage?.parts?.some(
					(part) =>
						"state" in part &&
						part.state === "approval-responded" &&
						"approval" in part &&
						(part.approval as { approved?: boolean })?.approved === true,
				) ?? false;
			return shouldContinue;
		},
		transport: new DefaultChatTransport({
			api: "/api/chat",
			fetch: fetchWithErrorHandlers,
			prepareSendMessagesRequest(request) {
				const lastMessage = request.messages.at(-1);
				const isToolApprovalContinuation =
					lastMessage?.role !== "user" ||
					request.messages.some((msg) =>
						msg.parts?.some((part) => {
							const state = (part as { state?: string }).state;
							return (
								state === "approval-responded" || state === "output-denied"
							);
						}),
					);

				const apiKey = getLocalStorageItem(
					`api_key:${currentModelIdRef.current}`,
				);
				const [provider] = currentModelIdRef.current.split("/");

				if (provider !== "ollama" && !apiKey) {
					toast.error(
						`API key required for ${provider} models. Please set it in the settings.`,
					);
				}

				return {
					body: {
						id: request.id,
						...(isToolApprovalContinuation
							? { messages: request.messages }
							: { message: lastMessage }),
						selectedChatModel: currentModelIdRef.current,
						selectedVisibilityType: visibilityType,
						apiKey,
						...request.body,
					},
				};
			},
		}),
		onData: (dataPart) => {
			setDataStream((ds) => (ds ? [...ds, dataPart] : []));
		},
		onFinish: () => {
			mutate(unstable_serialize(getChatHistoryPaginationKey));
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "An error occurred";
			const isApiKeyError =
				message.includes("API key") ||
				message.includes("api_key") ||
				message.includes("apiKey") ||
				message.includes("401") ||
				message.includes("Unauthorized") ||
				message.includes("Invalid authentication");
			toast.error(
				isApiKeyError
					? "Incorrect API key. Please check your settings."
					: message,
			);
		},
	});

	const searchParams = useSearchParams();
	const query = searchParams.get("query");

	const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

	useEffect(() => {
		if (query && !hasAppendedQuery) {
			sendMessage({
				role: "user" as const,
				parts: [{ type: "text", text: query }],
			});

			setHasAppendedQuery(true);
			window.history.replaceState({}, "", `/chat/${id}`);
		}
	}, [query, sendMessage, hasAppendedQuery, id]);

	const { data: votes } = useApi<Vote[]>(
		messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
	);

	const [attachments, setAttachments] = useState<Attachment[]>([]);

	useAutoResume({
		autoResume,
		initialMessages,
		resumeStream,
		setMessages,
	});

	return (
		<div className="overscroll-behavior-contain bg-background relative flex h-dvh min-w-0 touch-pan-y flex-col">
			<ChatHeader
				chatId={id}
				isReadonly={isReadonly}
				selectedVisibilityType={initialVisibilityType}
			/>

			<Messages
				addToolApprovalResponse={addToolApprovalResponse}
				chatId={id}
				isArtifactVisible={false}
				isReadonly={isReadonly}
				messages={messages}
				regenerate={regenerate}
				selectedModelId={initialChatModel}
				setMessages={setMessages}
				status={status}
				votes={votes}
			/>

			<div className="bg-background sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 px-2 pb-3 md:px-4 md:pb-4">
				{!isReadonly && (
					<MultimodalInput
						attachments={attachments}
						chatId={id}
						input={input}
						messages={messages}
						onModelChange={setCurrentModelId}
						selectedModelId={currentModelId}
						selectedVisibilityType={visibilityType}
						sendMessage={sendMessage}
						setAttachments={setAttachments}
						setInput={setInput}
						setMessages={setMessages}
						status={status}
						stop={stop}
					/>
				)}
			</div>
		</div>
	);
}
