import { json } from '@sveltejs/kit'

export async function POST(event) {
    const { VITE_API_URL } = import.meta.env;
    if(!VITE_API_URL){
        return json({error: 'VITE_API_URL is not set'})
    }
    const body = await event.request.json()

    const { contentType , reaction } = body;

    if(reaction === 'save' && contentType === 'post'){
        const apiUrl = `${VITE_API_URL}/bookmarks`;
        return await makeRequest(apiUrl, body);
    } 

}

async function makeRequest(apiUrl: string, body: Record<string, any>) {
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const response = await res.json();
    return json(response);
}
