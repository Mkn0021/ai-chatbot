import equal from "fast-deep-equal";
import { memo } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import type { ChatMessage } from "@/types";
import { useCopyToClipboard } from "usehooks-ts";
import type { Vote } from "@/lib/db/schemas/ai-chat";
import { Copy, Edit, ThumbsDown, ThumbsUp } from "lucide-react";
import { Action, Actions } from "@/components/ai-element/actions";
import { fetcher } from "@/lib/api/client";

export function PureMessageActions({
	chatId,
	message,
	vote,
	isLoading,
	setMode,
}: {
	chatId: string;
	message: ChatMessage;
	vote: Vote | undefined;
	isLoading: boolean;
	setMode?: (mode: "view" | "edit") => void;
}) {
	const { mutate } = useSWRConfig();
	const [_, copyToClipboard] = useCopyToClipboard();

	if (isLoading) {
		return null;
	}

	const textFromParts = message.parts
		?.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("\n")
		.trim();

	const handleCopy = async () => {
		if (!textFromParts) {
			toast.error("There's no text to copy!");
			return;
		}

		await copyToClipboard(textFromParts);
		toast.success("Copied to clipboard!");
	};

	const handleVote = async (isUpvoted: boolean) => {
		await fetcher<Vote, Vote[]>("/api/vote", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chatId, messageId: message.id, isUpvoted }),
			mutator: (current) => {
				const without = (current ?? []).filter(
					(v) => v.messageId !== message.id,
				);
				return [...without, { chatId, messageId: message.id, isUpvoted }];
			},
			toast: {
				loading: isUpvoted ? "Upvoting Response..." : "Downvoting Response...",
				success: isUpvoted ? "Upvoted Response!" : "Downvoted Response!",
				error: isUpvoted
					? "Failed to upvote response."
					: "Failed to downvote response.",
			},
		});
	};

	// User messages get edit (on hover) and copy actions
	if (message.role === "user") {
		return (
			<Actions className="-mr-0.5 justify-end">
				<div className="relative">
					{setMode && (
						<Action
							className="absolute top-0 -left-10 opacity-0 transition-opacity group-hover/message:opacity-100 focus-visible:opacity-100"
							data-testid="message-edit-button"
							onClick={() => setMode("edit")}
							tooltip="Edit"
						>
							<Edit />
						</Action>
					)}
					<Action onClick={handleCopy} tooltip="Copy">
						<Copy />
					</Action>
				</div>
			</Actions>
		);
	}

	return (
		<Actions className="-ml-0.5">
			<Action onClick={handleCopy} tooltip="Copy">
				<Copy />
			</Action>

			<Action
				data-testid="message-upvote"
				disabled={vote?.isUpvoted}
				onClick={() => handleVote(true)}
				tooltip="Upvote Response"
			>
				<ThumbsUp />
			</Action>

			<Action
				data-testid="message-downvote"
				disabled={vote && !vote.isUpvoted}
				onClick={() => handleVote(false)}
				tooltip="Downvote Response"
			>
				<ThumbsDown />
			</Action>
		</Actions>
	);
}

export const MessageActions = memo(
	PureMessageActions,
	(prevProps, nextProps) => {
		if (!equal(prevProps.vote, nextProps.vote)) {
			return false;
		}
		if (prevProps.isLoading !== nextProps.isLoading) {
			return false;
		}

		return true;
	},
);
