import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";

function getStreamContext() {
    try {
        return createResumableStreamContext({ waitUntil: after });
    } catch (_) {
        return null;
    }
}

export { getStreamContext };