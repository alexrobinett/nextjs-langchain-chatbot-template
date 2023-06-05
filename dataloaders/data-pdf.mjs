import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new PineconeClient();
await client.init({
 apiKey: process.env.PINECONE_API_KEY,
 environment: process.env.PINECONE_ENVIRONMENT
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);



export const  runData = async () =>{
    const loader = new PDFLoader("DOCUMENT_PATH_GOES_HERE", {
        splitPages: false,
      });
    const rawDocs = await loader.load();
    console.log("loader Created");

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const docs = await textSplitter.splitDocuments(rawDocs)

    console.log("docs splitted")

    console.log("creating vector database...")

    PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  pineconeIndex,
 });
}

void (async () => {
    await runData();
    console.log('done');
 })();
 