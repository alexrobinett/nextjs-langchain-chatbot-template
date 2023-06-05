# Next.js Chatbot Template with Langchain Dataloaders

## Introduction

This template is an open-source, user-focused AI platform template. It's specifically designed for building chatbots that connect language models to your documents, using NEXT.js. By leveraging embeddings. it provides an opportunity to create AI chatbots that reference your data and don't hallucinate false answers. 

**Link to a example project:** [https://ai-ev-finder.vercel.app](https://ai-ev-finder.vercel.app)

![EV-GPT](https://github.com/alexrobinett/ai-ev-Finder/assets/59510577/eda13ec8-c511-4348-b6d5-e95183477c31)

## Features

- User-friendly interface
- Data-awareness, connecting the language model to other data sources
- Scalability with a pinecone database to store documents or data


## Installation and Setup

To install and run this project locally, follow these steps:

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Sign up for a Pinecone DB & OpenAI Account.
4. Copy the `env.example` file and rename it to `.env`. Generate and fill in the necessary environment variables.
5. Use the dataloaders folder to add data and documents to your Pinecone database. Simply input your data path or url and then run `node date-website.mjs`
6. Load as much data into the database as necessary for your chatbot to have a large enough knowledge base on the topic required. 
7. Start the development server with `npm run dev`.

## How it works

This web application was developed using a range of technologies. It implements the ConversationalRetrievalQAChain from LangChain, takes two inputs: a question and the chat history. It combines the chat history and the question into a standalone question, retrieves relevant documents, and then passes those documents and the question to a question-answering chain to return a response.

## Documentation

Additional resources include:

- [LangChain JS Documentation](https://js.langchain.com/docs/)
- [LangChain GitHub Repository](https://github.com/hwchase17/langchainjs)

## Contributions

Feel free to fork this project and train it on any set of documents or data you wish. We warmly welcome contributions from the open-source community.

## License

This chatbot template is licensed under the [MIT License](LICENSE).

## Contact

For any questions or support, please contact [Alex Robinett](mailto:alex@robinettmedia.com).
