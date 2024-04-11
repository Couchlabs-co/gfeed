import { describe, beforeEach ,afterEach, expect, vi, beforeAll, afterAll, test } from "vitest";
import { main } from "../src/rssParser";
import { SQSEvent } from "aws-lambda";
import sqsEvent from './__mocks__/sqsEvent.json';
import mockDynamoDBClient from './__mocks__/mockDynamoDBClient'
import mockSQSClient from "./__mocks__/mockSQSClient";
import fs from 'fs';
import path from "path";
import {server} from './__mocks__/mswServer';
import { HttpResponse, http } from "msw";

describe("rssParser", () => {

    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        mockDynamoDBClient.reset();
        mockSQSClient.reset();
    })
    
    afterEach(() => {
        server.resetHandlers();
        vi.resetAllMocks();
    })

    afterAll(() => {
        server.close();
    });

    test("parse washingtonPost rss feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/washingtonPost.xml'), 'utf8');
        server.use(http.get('https://www.washingtonpost.com/feed/rss', () => {
            return HttpResponse.text(xmlFile);
        }));
        
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Politics', feedType: 'xml', publisher: 'Washington Post', feedUrl: 'https://www.washingtonpost.com/feed/rss' });
        mockDynamoDBClient.onAnyCommand().resolves({});
        mockSQSClient.onAnyCommand().resolves({});
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls()).toHaveLength(2);
        expect(mockSQSClient.calls()).toHaveLength(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse wired xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/wiredRSS.xml'), 'utf8');
        
        server.use(http.get('https://www.wired.com/feed/rss', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Wired', feedUrl: 'https://www.wired.com/feed/rss' });
        mockDynamoDBClient.onAnyCommand().resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls()).toHaveLength(3);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse tokyodev atom feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/tokyodev.atom'), 'utf8');
        
        server.use(http.get('https://www.tokyodev.com/atom.xml', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'atom', publisher: 'TokyoDev', feedUrl: 'https://www.tokyodev.com/atom.xml' });

        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse overreacted xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/overreacted.xml'), 'utf8');
        
        server.use(http.get('https://overreacted.io/rss.xml', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Overreacted', feedUrl: 'https://overreacted.io/rss.xml' });
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse martinfowler atom feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/martinfowler.atom'), 'utf8');
        
        server.use(http.get('https://martinfowler.com/feed.atom', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'atom', publisher: 'Martin Fowler', feedUrl: 'https://martinfowler.com/feed.atom' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse techcrunch xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/techcrunch.xml'), 'utf8');
        
        server.use(http.get('https://techcrunch.com/feed', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'TechCrunch', feedUrl: 'https://techcrunch.com/feed' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse mozilla hacks xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/mozillaHacks.xml'), 'utf8');
        
        server.use(http.get('https://hacks.mozilla.org/feed/', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Mozilla Hacks', feedUrl: 'https://hacks.mozilla.org/feed/' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse a list part xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/alistapart.xml'), 'utf8');
        
        server.use(http.get('https://alistapart.com/main/feed/', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'A List Apart', feedUrl: 'https://alistapart.com/main/feed/' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse alicegg xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/alicegg.xml'), 'utf8');
        
        server.use(http.get('https://alicegg.tech/feed.xml', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Alice GG', feedUrl: 'https://alicegg.tech/feed.xml' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse samnewman xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/samnewman.xml'), 'utf8');
        
        server.use(http.get('https://samnewman.io/blog/feed.xml', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Sam Newman', feedUrl: 'https://samnewman.io/blog/feed.xml' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse hackernoon xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/hackernoon.xml'), 'utf8');
        
        server.use(http.get('https://hackernoon.com/feed', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'HACKERNOON', feedUrl: 'https://hackernoon.com/feed' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse jacob singh xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/jacobsingh.xml'), 'utf8');
        
        server.use(http.get('https://jacobsingh.name/rss/', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Jacob Singh', feedUrl: 'https://jacobsingh.name/rss/' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse dev intruppted xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/devinteruppted.xml'), 'utf8');
        
        server.use(http.get('https://devinterrupted.substack.com/feed', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'devintruppted', feedUrl: 'https://devinterrupted.substack.com/feed' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse thecyberwire xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/thecyberwire.xml'), 'utf8');
        
        server.use(http.get('https://thecyberwire.com/feeds/rss.xml', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'thecyberwire', feedUrl: 'https://thecyberwire.com/feeds/rss.xml' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });
    test("parse darkreading xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/darkreading.xml'), 'utf8');
        
        server.use(http.get('https://www.darkreading.com/rss.xml', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'darkreading', feedUrl: 'https://www.darkreading.com/rss.xml' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });
    test("parse zero day initiative xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/zerodayinitiative.xml'), 'utf8');
        
        server.use(http.get('https://www.zerodayinitiative.com/blog', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Zero Day Initiative', feedUrl: 'https://www.zerodayinitiative.com/blog' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });
    test("parse uber blog xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/uberblog.xml'), 'utf8');
        
        server.use(http.get('https://www.uber.com/en-AU/blog/rss/', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Uber Blog', feedUrl: 'https://www.uber.com/en-AU/blog/rss/' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse fastcompany xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/fastCompanyTech.xml'), 'utf8');
        
        server.use(http.get('https://www.fastcompany.com/technology/rss', () => {
            return HttpResponse.text(xmlFile);
        }));
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'FAST COMPANY', feedUrl: 'https://www.fastcompany.com/technology/rss' });
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls().length).toBeGreaterThan(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse Economist rss feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/economist.xml'), 'utf8');
        server.use(http.get('https://www.economist.com/feed/rss', () => {
            return HttpResponse.text(xmlFile);
        }));
        
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Culture', feedType: 'xml', publisher: 'The Economist', feedUrl: 'https://www.economist.com/feed/rss', payWall: true });
        mockDynamoDBClient.onAnyCommand().resolves({});
        mockSQSClient.onAnyCommand().resolves({});
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls()).toHaveLength(5);
        expect(mockSQSClient.calls()).toHaveLength(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    test("parse TowardsDataScience rss feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/towardsdatascience.xml'), 'utf8');
        server.use(http.get('https://towardsdatascience.com/feed', () => {
            return HttpResponse.text(xmlFile);
        }));
        
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Towards Data Science', feedUrl: 'https://towardsdatascience.com/feed', payWall: false });
        mockDynamoDBClient.onAnyCommand().resolves({});
        mockSQSClient.onAnyCommand().resolves({});
        
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(mockDynamoDBClient.calls()).toHaveLength(2);
        expect(mockSQSClient.calls()).toHaveLength(0);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

});