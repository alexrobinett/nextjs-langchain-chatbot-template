import React from 'react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
}

export default function ChatInput({ input, setInput }: ChatInputProps) {
  return (
    <>
      <label className="sr-only">Chatbot Label Name</label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="focus:shadow-outline h-10 w-full rounded-lg border pl-3 pr-8 text-base placeholder-gray-500"
        placeholder="Send a message about EVs."
      />
    </>
  );
}
