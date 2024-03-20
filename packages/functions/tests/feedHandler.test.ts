import { describe, beforeEach ,afterEach, expect, vi, it } from "vitest";
import { main } from "../src/feedHandler";
import { SQSEvent } from "aws-lambda";
import sqsEvent from './__mocks__/sqsEvent.json';
import mockDynamoDBClient from './__mocks__/mockDynamoDBClient'
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import fs from 'fs';
import { mockFetch } from "./__mocks__/mockFetch";
import path from "path";

describe("feedHandler", () => {

    beforeEach(() => {
        mockDynamoDBClient.reset();
    })
    
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("parse wired xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/wiredRSS.xml'), 'utf8');
        const options = {
            url: 'https://www.wired.com/feed/rss',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Wired', feedUrl: 'https://www.wired.com/feed/rss' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse overreacted xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/overreacted.xml'), 'utf8');
        const options = {
            url: 'https://overreacted.io/rss.xml',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Overreacted', feedUrl: 'https://overreacted.io/rss.xml' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse martinfowler atom feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/martinfowler.atom'), 'utf8');
        const options = {
            url: 'https://martinfowler.com/feed.atom',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'atom', publisher: 'Martin Fowler', feedUrl: 'https://martinfowler.com/feed.atom' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse techcrunch xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/techcrunch.xml'), 'utf8');
        const options = {
            url: 'https://techcrunch.com/feed',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'TechCrunch', feedUrl: 'https://techcrunch.com/feed' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse mozilla hacks xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/mozillaHacks.xml'), 'utf8');
        const options = {
            url: 'https://hacks.mozilla.org/feed/',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Mozilla Hacks', feedUrl: 'https://hacks.mozilla.org/feed/' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse a list part xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/alistapart.xml'), 'utf8');
        const options = {
            url: 'https://alistapart.com/main/feed/',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'A List Apart', feedUrl: 'https://alistapart.com/main/feed/' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse alicegg xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/alicegg.xml'), 'utf8');
        const options = {
            url: 'https://alicegg.tech/feed.xml',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Alice GG', feedUrl: 'https://alicegg.tech/feed.xml' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse samnewman xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/samnewman.xml'), 'utf8');
        const options = {
            url: 'https://samnewman.io/blog/feed.xml',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Sam Newman', feedUrl: 'https://samnewman.io/blog/feed.xml' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse hackernoon xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/hackernoon.xml'), 'utf8');
        const options = {
            url: 'https://hackernoon.com/feed',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'HACKERNOON', feedUrl: 'https://hackernoon.com/feed' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse jacob singh xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/jacobsingh.xml'), 'utf8');
        const options = {
            url: 'https://jacobsingh.name/rss/',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'Jacob Singh', feedUrl: 'https://jacobsingh.name/rss/' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });

    it("parse dev intruppted xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/devinteruppted.xml'), 'utf8');
        const options = {
            url: 'https://devinterrupted.substack.com/feed',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ id: 'pubId', tag: 'Tech', feedType: 'xml', publisher: 'devintruppted', feedUrl: 'https://devinterrupted.substack.com/feed' });
        mockDynamoDBClient.on(PutItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        expect(response).toEqual({ statusCode: 200, body: '{"status":"successful"}' });
    });
});