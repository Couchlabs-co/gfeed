export async function userAction(userId: string, content: string, reaction: string, contentType: string, contentLink: string, contentId: string) {

    const res = await fetch("/api/engage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content,
            reaction,
            contentType,
            userId,
            contentLink,
            contentId
        }),
    });
    const data = await res.json();
    return data;
}
