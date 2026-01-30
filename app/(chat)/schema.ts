import "server-only"

import { z } from "zod";
import { chat, vote } from "@/lib/db/schemas"
import { createSelectSchema } from "drizzle-zod";

const ChatSelectSchema = createSelectSchema(chat);
const VoteSelectSchema = createSelectSchema(vote);

export const GetChatsHistorySchema = {
    query: z.object({
        limit: z.coerce.number().int().min(1).max(100).default(10),
        startingAfter: z.string().optional(),
        endingBefore: z.string().optional()
    }).refine(data => !(data.startingAfter && data.endingBefore), {
        message: "Only one of startingAfter or endingBefore can be provided."
    })
};

export const ChatIdQuerySchema = {
    query: z.object({
        chatId: z.string().min(1)
    })
};

export const VoteMessageSchema = {
    body: VoteSelectSchema
}


export type Chat = z.infer<typeof ChatSelectSchema>;
export type GetChatsByUserId = z.infer<typeof GetChatsHistorySchema.query> & { id: string };
export type VoteMessageInput = z.infer<typeof VoteMessageSchema.body>;
export type VisibilityType = z.infer<typeof ChatSelectSchema.shape.visibility>;