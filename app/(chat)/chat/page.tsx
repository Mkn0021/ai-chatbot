import { Suspense } from "react";
import { cookies } from "next/headers";
import { generateUUID } from "@/lib/utils";
import { DEFAULT_MODELS } from "@/lib/ai/models";
import { Chat } from "@/components/chatpage/chat";
import { DataStreamHandler } from "@/components/chatpage/data-stream-handler";

export default function Page() {
    return (
        <Suspense fallback={<div className="flex h-dvh" />}>
            <NewChatPage />
        </Suspense>
    );
}

async function NewChatPage() {
    const id = generateUUID();
    const cookieStore = await cookies();

    // Get model from cookie or default
    const modelCookie = cookieStore.get("chat-model");
    const initialModel = modelCookie?.value ?? DEFAULT_MODELS[0].id

    return (
        <>
            <Chat
                autoResume={false}
                id={id}
                initialChatModel={initialModel}
                initialMessages={[]}
                initialVisibilityType="private"
                isReadonly={false}
                key={id}
            />
            <DataStreamHandler />
        </>
    );
}