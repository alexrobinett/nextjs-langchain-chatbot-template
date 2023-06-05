import { type NextPage } from 'next';
import Head from 'next/head';
import ChatWindow from './ChatWindow';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>EV-GPT</title>
        <meta
          name="description"
          content="A AI chat Bot Trained on the Latest EV Data"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full flex-col items-center justify-center bg-gradient-to-r from-sky-400 to-blue-500">
        <ChatWindow />
      </main>
    </>
  );
};

export default Home;
