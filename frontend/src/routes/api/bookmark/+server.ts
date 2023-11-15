import { json } from '@sveltejs/kit'

export async function POST(event) {
    const body = await event.request.json()
    const { VITE_API_URL } = import.meta.env;
    if(!VITE_API_URL){
        return json({error: 'VITE_API_URL is not set'})
    }

    const res = await fetch(`${VITE_API_URL}/users/${body.userId}/bookmark`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    
    const response = await res.json();
    return json(response)
}