import { setupServer } from 'msw/node'
import { http } from 'msw'
 
export const handlers = [
  http.get('https://www.washingtonpost.com/feed/rss', () => {
    return new Response('<rss></rss>');
  }),
]
 
export const server = setupServer();