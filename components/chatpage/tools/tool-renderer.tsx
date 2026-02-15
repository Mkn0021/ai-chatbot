import { UIMessagePart } from "ai";
import { ChatTools, CustomUIDataTypes } from "@/types";
import {
	Tool,
	ToolContent,
	ToolHeader,
	ToolInput,
	ToolOutput,
} from "@/components/ai-element/tool";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/types";

export type ToolPart = Extract<
	UIMessagePart<CustomUIDataTypes, ChatTools>,
	{ type: `tool-${string}` }
>;

type ToolRendererProps = {
	part: ToolPart;
	addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
	renderOutput?: React.ReactNode;
	widthClass?: string;
	toolName: keyof ChatTools;
};

export const ToolRenderer = ({
	part,
	addToolApprovalResponse,
	renderOutput,
	widthClass = "w-[min(100%,450px)]",
	toolName,
}: ToolRendererProps) => {
	const { toolCallId, state, type: toolType } = part;
	const approvalId = part.approval?.id;
	const isDenied =
		state === "output-denied" ||
		(state === "approval-responded" && part.approval?.approved === false);

	if (state === "output-available" && renderOutput) {
		return (
			<div className={widthClass} key={toolCallId}>
				{renderOutput}
			</div>
		);
	}

	if (state === "output-available" && !renderOutput) {
		return (
			<div className={widthClass} key={toolCallId}>
				<Tool className="w-full" defaultOpen={true}>
					<ToolHeader state={state} type={toolType} />
					<ToolContent>
						<ToolOutput
							output={JSON.stringify(part.output, null, 2)}
							errorText={part.errorText}
						/>
					</ToolContent>
				</Tool>
			</div>
		);
	}

	if (isDenied) {
		return (
			<div className={widthClass} key={toolCallId}>
				<Tool className="w-full" defaultOpen={true}>
					<ToolHeader state="output-denied" type={toolType} />
					<ToolContent>
						<div className="text-muted-foreground px-4 py-3 text-sm">
							{toolName} lookup was denied.
						</div>
					</ToolContent>
				</Tool>
			</div>
		);
	}

	if (state === "approval-responded") {
		return (
			<div className={widthClass} key={toolCallId}>
				<Tool className="w-full" defaultOpen={true}>
					<ToolHeader state={state} type={toolType} />
					<ToolContent>
						<ToolInput input={part.input} />
					</ToolContent>
				</Tool>
			</div>
		);
	}

	if (state === "output-error") {
		return (
			<div className={widthClass} key={toolCallId}>
				<Tool className="w-full" defaultOpen={true}>
					<ToolHeader state={state} type={toolType} />
					<ToolContent>
						<ToolContent>
							<div className="text-muted-foreground px-4 py-3 text-sm">
								{part.errorText ?? "Tool execution failed."}
							</div>
						</ToolContent>
					</ToolContent>
				</Tool>
			</div>
		);
	}

	return (
		<div className={widthClass} key={toolCallId}>
			<Tool className="w-full" defaultOpen={true}>
				<ToolHeader state={state} type={toolType} />
				<ToolContent>
					{(state === "input-available" || state === "approval-requested") && (
						<ToolInput input={part.input} />
					)}
					{state === "approval-requested" && approvalId && (
						<div className="flex items-center justify-end gap-2 border-t px-4 py-3">
							<button
								className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
								onClick={() => {
									addToolApprovalResponse({
										id: approvalId,
										approved: false,
										reason: `User denied ${toolName} lookup`,
									});
								}}
								type="button"
							>
								Deny
							</button>
							<button
								className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm transition-colors"
								onClick={() => {
									addToolApprovalResponse({
										id: approvalId,
										approved: true,
									});
								}}
								type="button"
							>
								Allow
							</button>
						</div>
					)}
				</ToolContent>
			</Tool>
		</div>
	);
};
