import * as jose from 'jose';

export async function validateToken(token: string): Promise<boolean> {

    try {
        // console.log(`${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`);
        const JWKS = jose.createRemoteJWKSet(new URL(`${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`));
      
        const response = await jose.jwtVerify(token, JWKS, {
          issuer: process.env.KINDE_ISSUER_URL ?? '',
          audience: process.env.KINDE_AUDIENCE ?? '',
        })
        if(!response){
          return false
        }
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
  }