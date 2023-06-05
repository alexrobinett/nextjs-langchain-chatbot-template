import React from 'react';

export default function ChatHeader() {
  return (
    <header className="sticky left-0 right-0 top-0 z-10 mb-2 ">
      <h1 className="my-2 mb-2 flex-none text-2xl font-semibold leading-6 text-gray-900 md:text-4xl">
        Chatbot Name
      </h1>
      <span className="leading-2 mb-4 flex-none text-sm font-medium text-black">
        This is where your chatbot description goes!
      </span>
    </header>
  );
}
