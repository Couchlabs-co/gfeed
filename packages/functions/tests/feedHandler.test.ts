import { describe, beforeEach ,afterEach, expect, vi, it } from "vitest";
import { main } from "../src/feedHandler";
import { SQSEvent } from "aws-lambda";
import sqsEvent from './__mocks__/sqsEvent.json';
import mockDynamoDBClient from './__mocks__/mockDynamoDBClient'
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import fs from 'fs';

describe("feedHandler", () => {

    vi.mock('fetch', ()=>{
        return {
            ok: true,
            text: () => {
                const xmlFile = fs.readFileSync('./mocks/wiredRSS.xml', 'utf8');
                return new Promise((resolve, reject) => {
                    resolve(xmlFile);
                });
            }
        }
    });

    beforeEach(() => {
        mockDynamoDBClient.reset();
    })
    
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("parse wired xml feed", async () => {
        sqsEvent.Records[0].body = JSON.stringify({ publisher: 'Wired', feedUrl: 'https://www.wired.com/feed/rss' });
        mockDynamoDBClient.on(UpdateItemCommand).resolves({});
        const event = sqsEvent as SQSEvent;
        const response = await main(event);
        console.log('response', response);
        expect(response).toBeTruthy();
    });
});