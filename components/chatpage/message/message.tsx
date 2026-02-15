"use client";
import { useState } from "react";
import type { ChatMessage } from "@/types";
import { SparklesIcon } from "lucide-react";
import type { Vote } from "@/lib/db/schemas";
import { cn, sanitizeText } from "@/lib/utils";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useDataStream } from "../data-stream-provider";
import { MessageContent } from "@/components/ai-element/message";
import { Response } from "@/components/ai-element/response";
import { SqlQueryResult } from "../tools/sql-query-result";

import { MessageActions } from "./message-actions";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import { PreviewAttachment } from "./preview-attachment";
import { ToolPart, ToolRenderer } from "../tools/tool-renderer";

const PurePreviewMessage = ({
	addToolApprovalResponse,
	chatId,
	message,
	vote,
	isLoading,
	setMessages,
	regenerate,
	isReadonly,
	requiresScrollPadding: _requiresScrollPadding,
}: {
	addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
	chatId: string;
	message: ChatMessage;
	vote: Vote | undefined;
	isLoading: boolean;
	setMessages: UseChatHelpers<ChatMessage>["setMessages"];
	regenerate: UseChatHelpers<ChatMessage>["regenerate"];
	isReadonly: boolean;
	requiresScrollPadding: boolean;
}) => {
	const [mode, setMode] = useState<"view" | "edit">("view");

	const attachmentsFromMessage = message.parts.filter(
		(part) => part.type === "file",
	);

	useDataStream();

	return (
		<div
			className="group/message fade-in animate-in w-full duration-200"
			data-role={message.role}
			data-testid={`message-${message.role}`}
		>
			<div
				className={cn("flex w-full items-start gap-2 md:gap-3", {
					"justify-end": message.role === "user" && mode !== "edit",
					"justify-start": message.role === "assistant",
				})}
			>
				{message.role === "assistant" && (
					<div className="bg-background ring-border -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
						<SparklesIcon size={14} />
					</div>
				)}

				<div
					className={cn("flex flex-col", {
						"gap-2 md:gap-4": message.parts?.some(
							(p) => p.type === "text" && p.text?.trim(),
						),
						"w-full":
							(message.role === "assistant" &&
								(message.parts?.some(
									(p) => p.type === "text" && p.text?.trim(),
								) ||
									message.parts?.some((p) => p.type.startsWith("tool-")))) ||
							mode === "edit",
						"max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]":
							message.role === "user" && mode !== "edit",
					})}
				>
					{attachmentsFromMessage.length > 0 && (
						<div
							className="flex flex-row justify-end gap-2"
							data-testid={"message-attachments"}
						>
							{attachmentsFromMessage.map((attachment) => (
								<PreviewAttachment
									attachment={{
										name: attachment.filename ?? "file",
										contentType: attachment.mediaType,
										url: attachment.url,
									}}
									key={attachment.url}
								/>
							))}
						</div>
					)}

					{message.parts?.map((part, index) => {
						const { type } = part;
						const key = `message-${message.id}-part-${index}`;

						if (type === "reasoning") {
							const hasContent = part.text?.trim().length > 0;
							const isStreaming = "state" in part && part.state === "streaming";
							if (hasContent || isStreaming) {
								return (
									<MessageReasoning
										isLoading={isLoading || isStreaming}
										key={key}
										reasoning={part.text || ""}
									/>
								);
							}
						}

						if (type === "text") {
							if (mode === "view") {
								return (
									<div key={key}>
										<MessageContent
											className={cn({
												"w-fit rounded-[10px_0px_10px_10px] border border-[#E3E3E3] bg-linear-to-br from-[#FFA756] to-[#EE602C] px-3 py-2 text-right wrap-break-word text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-4px_rgba(0,0,0,0.10)]":
													message.role === "user",
												"bg-transparent px-0 py-0 text-left selection:bg-orange-200":
													message.role === "assistant",
											})}
											data-testid="message-content"
											style={
												message.role === "user"
													? { backgroundColor: "#006cff" }
													: undefined
											}
										>
											<Response>{sanitizeText(part.text)}</Response>
										</MessageContent>
									</div>
								);
							}

							if (mode === "edit") {
								return (
									<div
										className="flex w-full flex-row items-start gap-3"
										key={key}
									>
										<div className="size-8" />
										<div className="min-w-0 flex-1">
											<MessageEditor
												key={message.id}
												message={message}
												regenerate={regenerate}
												setMessages={setMessages}
												setMode={setMode}
											/>
										</div>
									</div>
								);
							}
						}

						if (type === "tool-sqlQuery") {
							return (
								<ToolRenderer
									key={key}
									toolName="sqlQuery"
									part={part as ToolPart}
									addToolApprovalResponse={addToolApprovalResponse}
									renderOutput={
										part.state === "output-available" &&
										part.output.visualizationType !== "none" ? (
											<SqlQueryResult result={part.output} />
										) : undefined
									}
								/>
							);
						}

						return null;
					})}

					{!isReadonly && (
						<MessageActions
							chatId={chatId}
							isLoading={isLoading}
							key={`action-${message.id}`}
							message={message}
							setMode={setMode}
							vote={vote}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export const PreviewMessage = PurePreviewMessage;

export const ThinkingMessage = () => {
	return (
		<div
			className="group/message fade-in animate-in w-full duration-300"
			data-role="assistant"
			data-testid="message-assistant-loading"
		>
			<div className="flex items-start justify-start gap-3">
				<div className="bg-background ring-border -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
					<div className="animate-pulse">
						<SparklesIcon size={14} />
					</div>
				</div>

				<div className="flex w-full flex-col gap-2 md:gap-4">
					<div className="text-muted-foreground flex items-center gap-1 p-0 text-sm">
						<span className="animate-pulse">Thinking</span>
						<span className="inline-flex">
							<span className="animate-bounce [animation-delay:0ms]">.</span>
							<span className="animate-bounce [animation-delay:150ms]">.</span>
							<span className="animate-bounce [animation-delay:300ms]">.</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
