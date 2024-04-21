import * as jose from 'jose';

export async function getUserFromToken(token: string): Promise<string | null> {

    try {
        const payload = await jose.decodeJwt(token);
        return payload.sub!;
    } catch(e) {
        console.log(e);
        return null;
    }
  }