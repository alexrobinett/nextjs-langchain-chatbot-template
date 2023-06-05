// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { JSONLoader } from "langchain/document_loaders/fs/json"
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';

dotenv.config();

const client = new PineconeClient();
await client.init({
 apiKey: process.env.PINECONE_API_KEY,
 environment: process.env.PINECONE_ENVIRONMENT
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);



// Checks for links in in tables and then loads the links and extracts data. it checks if it's been to a page before

const runInternetData = async () => {
  const loader = new PuppeteerWebBaseLoader('URL_HERE', {
    launchOptions: {
      headless: false
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
      timeout: 60000 // Set timeout to 60 seconds
    },
    /** Pass custom evaluate, in this case you get page and browser instances */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async evaluate(page, browser) {
      // Get all the links to the model pages
      const modelLinks = await page.evaluate(() => {
        const modelRows = Array.from(document.querySelectorAll('tbody tr'));
        const links = modelRows.map((row) => {
          const modelLink = row.querySelector('td:first-child a');
          return modelLink ? modelLink.href : null;
        });
        return links.filter((link) => link !== null);
      });

      // Array to hold the results
      let results = [];

      for (let link of modelLinks) {
        const newPage = await browser.newPage();
        await newPage.goto(link, {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });

        const result = await newPage.evaluate(() => {
          // Find the table element containing the data you want to scrape
          const table = document.querySelector('table');

          // Extract the table data
          const data = {};
          const rows = Array.from(table.querySelectorAll('tr'));
          rows.forEach((row) => {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length > 1) {
              const key = cells[0].textContent.trim();
              const value = cells[1].textContent.trim();
              data[key] = value;
            }
          });

          return JSON.stringify(data);
        });

        results.push(result);
        await newPage.close();

        // Wait for 5 seconds before opening the next page
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      return results;
    }
  });

  const rawDocs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });

  const docs = await textSplitter.splitDocuments(rawDocs);

  console.log(docs);
  console.log('docs splitted');

  console.log('creating vector database...');

  PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex
  });
};

void (async () => {
    await runInternetData();
    console.log('done');
 })();
 