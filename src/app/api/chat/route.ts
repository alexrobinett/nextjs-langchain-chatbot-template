import { NextResponse } from 'next/server';
import { BaseCallbackHandler } from 'langchain/callbacks';
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'langchain/llms/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

interface Body {
  query: string;
  history: never[];
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  let chatHistory = '';

  class CustomHandler extends BaseCallbackHandler {
    name = 'custom_handler';

    async handleLLMNewToken(token: string) {
      await writer.ready;
      await writer.write(encoder.encode(`${token}`));
      chatHistory = chatHistory + `${token}`;
    }

    async handleLLMEnd() {
      await writer.ready;
      await writer.close();
    }

    async handleLLMError(e) {
      await writer.ready;
      await writer.abort(e);
    }
  }

  const handler1 = new CustomHandler();
  const client = new PineconeClient();
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined.');
    }

    const model = new OpenAI({
      modelName: 'gpt-4',
      temperature: 0.6,
      streaming: true,
      callbacks: [handler1],
      maxTokens: 256
    });

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );

    console.log(body);

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {}
    );

    chain
      .call({ question: `${body.query}`, chat_history: chatHistory })
      .catch((error: any) => console.error(error));

    chatHistory = chatHistory + body.query;

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
