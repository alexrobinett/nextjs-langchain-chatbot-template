# EV-GPT

EV-GPT is an AI chatbot focused on electric vehicles, powered by OpenAI's GPT-4 language model. It's designed to enhance understanding and processing of user inquiries and provide a user-friendly interface. The chatbot uses advanced techniques such as embeddings and indices for training and data management.

**Link to project:** [https://ai-ev-finder.vercel.app](https://ai-ev-finder.vercel.app)

![EV-GPT](https://github.com/alexrobinett/ai-ev-Finder/assets/59510577/eda13ec8-c511-4348-b6d5-e95183477c31)

## How It's Made:

**Tech used:** TypeScript, NEXT.js, LangChain, OpenAI, Puppeteer, TailwindCSS, and Pinecone DB

EV-GPT is a web application developed with TypeScript and NEXT.js. The chatbot was trained using LangChain and OpenAI's GPT-4, with Puppeteer assisting in scraping the web for electric vehicle information and documents. TailwindCSS was implemented to provide a user-friendly interface, and Pinecone DB was utilized as a vectorsore for embeddings.

LangChain is a framework for developing applications powered by language models. It allows the chatbot to be data-aware, connecting the language model to other sources of data.

In order to interact with the data through the language model, the documents are first stored in a vector store with Pinecone DB. This format allows easy interaction with the data in downstream steps. The process of ingesting documents into a vector store involves loading the documents using a Document Loader, splitting the documents using a Text Splitter, creating embeddings for the documents using a Text Embedding Model, and finally storing the documents and embeddings in Pinecone DB.

EV-GPT further implements the ConversationalRetrievalQAChain from LangChain. This chain builds on the RetrievalQAChain to provide a chat history component, taking two inputs: a question and the chat history. It combines the chat history and the question into a standalone question, retrieves relevant documents, and then passes those documents and the question to a question-answering chain to return a response.

You can fork EV-GPT and train it on any set of documents or data you wish.

## Optimizations

Optimizations include improving chatbot response time by 25% through the optimization of embedding data for the vector database. This enhancement not only improves the user experience but also the interaction speed with EV-GPT.

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Sign up for a Pinecone DB & OpenAI Account.
4. Copy the `env.example` file and rename it to `.env`. Generate and fill in the necessary environment variables.
5. Use the `data.mjs` file to add data and documents to your database with Puppeteer.
6. Start the development server with `npm run dev`.

## License

EV-GPT is licensed under the [MIT License](LICENSE).

## Contact

For any questions or support, please contact [Alex Robinett](mailto:alex@robinettmedia.com).
