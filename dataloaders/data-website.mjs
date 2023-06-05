// import { JSONLoader } from "langchain/document_loaders/fs/json"
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

// Extracts header elements and paragraph text from webpage

export const runInternetData = async () => {
  const loader = new PuppeteerWebBaseLoader('URL_HERE', {
    launchOptions: {
      headless: false
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
      timeout: 60000 // Set timeout to 60 seconds
    },
    /** Pass custom evaluate, in this case you get page and browser instances */
    async evaluate(page) {
      const result = await page.evaluate(() => {
        let data = {}; // create an object to store our results
        // list of headings and paragraphs
        let tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
        for (let tag of tags) {
          // For each tag, get all elements and their text content
          data[tag] = [...document.querySelectorAll(tag)].map((el) =>
            el.textContent.trim()
          );
        }
        return data;
      });
      // Convert the result object to a string before returning
      return JSON.stringify(result);
    }
  });

  const rawDocs = await loader.load();
  console.log(rawDocs); // Should now print a string

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
  // await runData();
  await runInternetData();
  console.log('done');
})();
