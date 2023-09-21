import { describe, beforeEach ,afterEach, expect, vi, it } from "vitest";
import { main } from "../src/feedHandler";
import { SQSEvent } from "aws-lambda";
import sqsEvent from './__mocks__/sqsEvent.json';
import mockDynamoDBClient from './__mocks__/mockDynamoDBClient'
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import fs from 'fs';
import { mockFetch } from "./__mocks__/mockFetch";
import path from "path";

describe("feedHandler", () => {

    // vi.mock('fetch', ()=>{
    //     return {
    //         ok: true,
    //         text: () => {
    //             const xmlFile = fs.readFileSync('./__mocks__/overreacted.xml', 'utf8');
    //             return new Promise((resolve, reject) => {
    //                 resolve(xmlFile);
    //             });
    //         }
    //     };
    // });

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
        sqsEvent.Records[0].body = JSON.stringify({ publisher: 'Wired', feedUrl: 'https://www.wired.com/feed/rss' });
        mockDynamoDBClient.on(UpdateItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(response).toBeTruthy();
    });

    it("parse overreacted xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/overreacted.xml'), 'utf8');
        const options = {
            url: 'https://overreacted.io/rss.xml',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ publisher: 'Overreacted', feedUrl: 'https://overreacted.io/rss.xml' });
        mockDynamoDBClient.on(UpdateItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(response).toBeTruthy();
    });

    it("parse martinfowler atom feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/martinfowler.atom'), 'utf8');
        const options = {
            url: 'https://martinfowler.com/feed.atom',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ publisher: 'Martin Fowler', feedUrl: 'https://martinfowler.com/feed.atom' });
        mockDynamoDBClient.on(UpdateItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(response).toBeTruthy();
    });

    it("parse techcrunch xml feed", async () => {
        const xmlFile = fs.readFileSync(path.resolve(__dirname + '/__mocks__/techcrunch.xml'), 'utf8');
        const options = {
            url: 'https://techcrunch.com/feed',
            response: xmlFile
        }
        mockFetch(options)
        sqsEvent.Records[0].body = JSON.stringify({ publisher: 'TechCrunch', feedUrl: 'https://techcrunch.com/feed' });
        mockDynamoDBClient.on(UpdateItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(response).toBeTruthy();
    });
});