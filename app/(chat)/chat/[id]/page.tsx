import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { DEFAULT_MODELS } from "@/lib/ai/models";
import { Chat } from "@/components/chatpage/chat";
import { convertToUIMessages } from "@/lib/utils";
import { getChatById, getMessagesByChatId } from "@/app/(chat)/actions";
import { DataStreamHandler } from "@/components/chatpage/data-stream-handler";

export default function Page(props: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div className="flex h-dvh" />}>
            <ChatPage params={props.params} />
        </Suspense>
    );
}

async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const chat = await getChatById({ id });

    if (!chat) {
        redirect("/");
    }

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (chat.visibility === "private") {
        if (!session || !session.user) {
            return notFound();
        }

        if (session.user.id !== chat.userId) {
            return notFound();
        }
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    
    const uiMessages = convertToUIMessages(messagesFromDb);

    const cookieStore = await cookies();

    // Get model from cookie or default
    const modelCookie = cookieStore.get("chat-model");
    const initialModel = modelCookie?.value ?? DEFAULT_MODELS[0].id

    return (
        <>
            <Chat
                autoResume={true}
                id={chat.id}
                initialChatModel={initialModel}
                initialMessages={uiMessages}
                initialVisibilityType={chat.visibility}
                isReadonly={session?.user?.id !== chat.userId}
            />
            <DataStreamHandler />
        </>
    );
}