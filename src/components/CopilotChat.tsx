import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const CopilotChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'What are requirements for reporting?' },
    { type: 'assistant', text: 'Data breaches must be reported to the supervisory authority within 72 hours of becoming aware of the breach.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: 'user', text: inputValue }]);
      setInputValue('');
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          text: 'I can help you with that compliance question. Let me analyze the relevant regulations...' 
        }]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-lg p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white">Compliance Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'bot' && (
                  <div className="max-w-[80%]">
                    <div className="text-gray-500 text-xs mb-1">USER</div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-200">
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.type === 'assistant' && (
                  <div className="max-w-[80%]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="2"/>
                          <circle cx="4" cy="10" r="1"/>
                          <circle cx="16" cy="10" r="1"/>
                        </svg>
                      </div>
                      <span className="text-gray-400 text-xs">AI ASSISTANT</span>
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-gray-200">
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.type === 'user' && (
                  <div className="max-w-[80%] bg-white text-black rounded-lg p-3">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about compliance..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              <Button onClick={handleSend} className="bg-white text-black hover:bg-gray-200">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <MessageCircle className="w-6 h-6 text-black" />
        )}
      </button>
    </>
  );
};
