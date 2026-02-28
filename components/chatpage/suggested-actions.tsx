"use client";

import { memo } from "react";
import { motion } from "motion/react";
import type { ChatMessage } from "@/types";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "@/app/(chat)/schema";
import { Suggestion } from "@/components/ai-element/suggestion";

type SuggestedActionsProps = {
	chatId: string;
	sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
	selectedVisibilityType: VisibilityType;
};

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
	const suggestedActions = [
		"Show appointment trends for the last 12 months",
		"What is the average success rate for each department?",
		"Show Department-wise average treatment cost",
		"Compare revenue vs cost by department",
	];

	return (
		<div
			className="grid w-full gap-2 lg:grid-cols-2"
			data-testid="suggested-actions"
		>
			{suggestedActions.map((suggestedAction, index) => (
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					initial={{ opacity: 0, y: 20 }}
					key={suggestedAction}
					transition={{ delay: 0.05 * index }}
					className={index >= 2 ? "hidden lg:block" : ""}
				>
					<Suggestion
						className="h-auto w-full p-3 text-left whitespace-normal"
						onClick={(suggestion) => {
							window.history.pushState({}, "", `/chat/${chatId}`);
							sendMessage({
								role: "user",
								parts: [{ type: "text", text: suggestion }],
							});
						}}
						suggestion={suggestedAction}
					>
						{suggestedAction}
					</Suggestion>
				</motion.div>
			))}
		</div>
	);
}

export const SuggestedActions = memo(
	PureSuggestedActions,
	(prevProps, nextProps) => {
		if (prevProps.chatId !== nextProps.chatId) {
			return false;
		}
		if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
			return false;
		}

		return true;
	},
);
