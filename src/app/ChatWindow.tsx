'use client';
import React, { useState, useEffect, useRef } from 'react';



import ChatBubbles from './ChatBubbles';
import ChatHeader from './ChatHeader';
import ChatForm from './ChatForm';

export default function ChatWindow() {
  const [incoming, setIncoming] = useState({ role: 'ai', message: '' });
  const [newMessage, setNewMessage] = useState({ role: 'ai', message: '' });
  const [input, setInput] = useState('');
  const [finished, setFinished] = useState(true);
  const [fullResponse, setFullResponse] = useState('');
  const [history, setHistory] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      message: `Your're a friendly chatbot that answers questions about data. Don't make up answers if you don't have the answer. if asked about other topics politely decline.`
    },
    {
      role: 'ai',
      message: "Hello, I'm a Chatbot! Ask me anything about data from your vector store."
    }
  ]);

  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setNewMessage(incoming);
  }, [incoming]);

  useEffect(() => {
    if (newMessage.message) {
      setMessages((prevMsgs) => [...prevMsgs, newMessage]);
      setHistory((prevHistory) => prevHistory + ' ' + newMessage.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input == '') {
      return;
    }
    setTimeout(() => {
      setFinished(false);
    }, 2700);
   
    setMessages((prev) => [...prev, { role: 'human', message: input }]);

    setHistory((prevHistory) => prevHistory + ' ' + input);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: input,
        history: history
      })
    });

    setInput('');
    setIncoming({ role: 'ai', message: '' });
    setFullResponse('');

    const stream = res.body;
    console.log(stream);
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setHistory((prevHistory) => prevHistory + ' ' + fullResponse);
          break;
        }

        const decodedValue = new TextDecoder().decode(value);
        setIncoming(({ role, message }) => ({
          role,
          message: message + decodedValue
        }));
        setFullResponse((prevResponse) => prevResponse + decodedValue);
      }
    } catch (error) {
      console.error(error);
    } finally {
      reader.releaseLock();
      setIncoming({ role: 'ai', message: '' });
      setFinished(true);
    }
  };

  return (
    <div className="md:max-w-3xl: relative flex w-full flex-auto flex-col border-0 border-slate-900 bg-gray-50 shadow drop-shadow-lg sm:my-6 sm:max-w-xl sm:rounded-lg sm:px-4">
      <div
        className=" flex flex-grow flex-col px-4 py-2 sm:p-2 h-20 "
        ref={chatWindowRef}
      >
        <ChatHeader />
        <section className="flex-1 rounded-md border border-gray-200 bg-white overflow-auto overscroll-contain p-2 no-scrollbar">
          <ChatBubbles
            messages={messages}
            finished={finished}
            incoming={incoming}
          />
        </section>
      </div>
      <div className="sticky inset-x-0 bottom-0 mx-2 mb-2 p-2 drop-shadow-sm sm:max-w-4xl sm:px-0">
        <ChatForm
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          finished={finished}
        />
      </div>
    </div>
  );
}
