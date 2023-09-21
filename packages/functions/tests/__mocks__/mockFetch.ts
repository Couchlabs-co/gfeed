import fetch from "node-fetch";

export interface FetchMockOptions {
    url: string;
    response: any;
  }
  
  export function mockFetch(options: FetchMockOptions): void {
    const originalFetch = globalThis.fetch;
    
    globalThis.fetch = (url: string): Promise<any> => {
        return {
            ok: true,
            text: () => {
                return new Promise((resolve, _) => {
                    resolve(options.response);
                });
            }
        }

    //   if (url === options.url) {
    //     if (options.alternateResponse) {
    //       return Promise.resolve(options.alternateResponse);
    //     }
    //     return Promise.resolve(options.response);
    //   }
    //   return originalFetch(url);
    };
  }