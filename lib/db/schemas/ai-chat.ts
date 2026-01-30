import type { InferSelectModel } from "drizzle-orm";
import {
    boolean,
    foreignKey,
    json,
    pgTable,
    primaryKey,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const chat = pgTable("Chat", {
    id: text("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    userId: text("userId")
        .notNull()
        .references(() => user.id),
    visibility: varchar("visibility", { enum: ["public", "private"] })
        .notNull()
        .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
    id: text("id").primaryKey().notNull(),
    chatId: text("chatId")
        .notNull()
        .references(() => chat.id),
    role: varchar("role").notNull(),
    parts: json("parts").notNull(),
    attachments: json("attachments").notNull(),
    createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

export const vote = pgTable(
    "Vote",
    {
        chatId: text("chatId")
            .notNull()
            .references(() => chat.id),
        messageId: text("messageId")
            .notNull()
            .references(() => message.id),
        isUpvoted: boolean("isUpvoted").notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.chatId, table.messageId] }),
        };
    }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
    "Document",
    {
        id: text("id").notNull(),
        createdAt: timestamp("createdAt").notNull(),
        title: text("title").notNull(),
        content: text("content"),
        kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
            .notNull()
            .default("text"),
        userId: text("userId")
            .notNull()
            .references(() => user.id),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.id, table.createdAt] }),
        };
    }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
    "Suggestion",
    {
        id: text("id").notNull(),
        documentId: text("documentId").notNull(),
        documentCreatedAt: timestamp("documentCreatedAt").notNull(),
        originalText: text("originalText").notNull(),
        suggestedText: text("suggestedText").notNull(),
        description: text("description"),
        isResolved: boolean("isResolved").notNull().default(false),
        userId: text("userId")
            .notNull()
            .references(() => user.id),
        createdAt: timestamp("createdAt").notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.id] }),
        documentRef: foreignKey({
            columns: [table.documentId, table.documentCreatedAt],
            foreignColumns: [document.id, document.createdAt],
        }),
    })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
    "Stream",
    {
        id: text("id").notNull(),
        chatId: text("chatId").notNull(),
        createdAt: timestamp("createdAt").notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.id] }),
        chatRef: foreignKey({
            columns: [table.chatId],
            foreignColumns: [chat.id],
        }),
    })
);

export type Stream = InferSelectModel<typeof stream>;