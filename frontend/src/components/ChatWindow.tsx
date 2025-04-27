import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Set initial bot message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: 'Reporting on scene. Please describe the situation. Do you need any procedural suggestions?',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now(), // Use timestamp for unique ID
        text: input,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        // Send message to the backend API endpoint
        const response = await fetch('http://localhost:8000/generate-suggestion', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const botResponse: Message = {
          id: Date.now() + 1, // Ensure unique ID
          text: data.reply || 'Sorry, I could not process that.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Error communicating with backend:', error);
        const errorResponse: Message = {
          id: Date.now() + 1,
          text: 'Error connecting to the assistant. Please check the backend.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col border border-stroke">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">AI First Response Assistant</h2>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-md p-3 border border-stroke min-h-0"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <span
                className={`inline-block px-3 py-2 rounded-lg max-w-xs text-sm shadow-sm ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {message.text}
              </span>
              <div className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start mb-3">
                <div className="flex flex-col items-start">
                    <span className="inline-block px-3 py-2 rounded-lg max-w-xs text-sm shadow-sm bg-gray-200 text-gray-800 italic">
                        Thinking...
                    </span>
                </div>
            </div>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
