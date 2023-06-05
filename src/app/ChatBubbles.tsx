/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
'use client';
import React, { useEffect } from 'react';
import { useRef } from 'react';


type Message = {
  role: string;
  message: string;
};

type ChatBubblesProps = {
  messages: Message[];
  finished: boolean;
  incoming: Message;
};

export default function ChatBubbles({
  messages,
  finished,
  incoming
}: ChatBubblesProps) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [incoming, messages]);

  return (
    <div className="flex flex-col">
      {messages
      .filter((message) => message.role !== "system")
      .map((message, index) => {
        const isAI = message.role === 'ai';
        const bubbleStyle = isAI
          ? 'bg-gray-200 text-sm p-2 m-2 rounded-md w-fit md:text-md'
          : 'bg-blue-500 text-white text-sm p-2 m-2 rounded-md w-fit md:text-md';

        return (
          <div
            key={index}
            className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div className={bubbleStyle}>{message.message}</div>
          </div>
        );
      })}

      {!finished && (
        <div className="md:text-md m-2 min-h-[2rem] w-fit rounded-md bg-gray-200 p-2 text-sm">
          {incoming.message && incoming.message}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
