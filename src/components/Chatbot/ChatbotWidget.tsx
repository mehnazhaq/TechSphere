import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { getGeminiResponse, ChatMessage } from '../../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your TechSphere Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Map local messages to Groq/OpenAI format
      const history: ChatMessage[] = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const botResponse = await getGeminiResponse(input, history);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: error.message || 'I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const createSupportTicket = async () => {
    setIsTyping(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to create a ticket.');

      const response = await axios.post(
        'http://localhost:5000/api/tickets',
        {
          title: 'Automated Ticket from Chat Assistant',
          description: `User requested help via AI Chat. Conversation snippet: ${messages.slice(-3).map(m => m.text).join(' | ')}`,
          priority: 'Medium',
          category: 'Technical',
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const successMsg: Message = {
        id: Date.now().toString(),
        text: `Got it! Your support request has been created (ID: ${response.data.data._id || 'pending'}). Our team will get back to you shortly.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        text: `Failed to create ticket: ${error.response?.data?.error || error.message}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-100 transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm">TechSphere Assistant</h3>
                <p className="text-[10px] text-blue-100">Always online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {/* Ticket Suggestion Action */}
            {messages.length > 1 && messages[messages.length-1].sender === 'bot' && 
             (messages[messages.length-1].text.includes('support ticket') || messages[messages.length-1].text.includes('open a ticket')) && (
              <div className="flex justify-start pl-4 translate-y-[-8px]">
                <button 
                  onClick={createSupportTicket}
                  className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-blue-200 transition-colors border border-blue-200"
                >
                  🎫 Create Support Ticket
                </button>
              </div>
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                !input.trim() || isTyping 
                  ? 'bg-gray-200 text-gray-400 grayscale' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              🚀
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-100 text-gray-500' : 'bg-blue-600 text-white animate-pulse hover:animate-none'
        }`}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatbotWidget;
