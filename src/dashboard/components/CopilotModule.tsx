import React, { useState, useRef } from 'react';
import { Send, Bot, User, Lightbulb, Sparkles, FileText, AlertCircle, CheckCircle, Paperclip, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { copilotApi, CopilotApiError } from '../services/copilotApi';

interface CopilotModuleProps {
  onNavigate: (view: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  fileName?: string;
}

const suggestedPrompts = [
  { icon: FileText, text: 'How do I implement DORA incident response?' },
  { icon: AlertCircle, text: 'What are my top compliance priorities?' },
  { icon: CheckCircle, text: 'Show me ISO27001 requirements' },
  { icon: Lightbulb, text: 'Generate a compliance roadmap' },
];

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your Hyperlynx Compliance Copilot. I can help you understand your compliance requirements, prioritize tasks, and guide you through implementation. What would you like to know?",
    timestamp: new Date(),
    suggestions: [
      'Explain DORA requirements',
      'Create action plan',
      'Show compliance gaps',
      'Generate policy template',
    ],
  },
];

export function CopilotModule({ onNavigate }: CopilotModuleProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      fileName: selectedFile?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const fileToSend = selectedFile;
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const response = await copilotApi.generateContent({
        question: messageText,
        local_llm: false,
        file: fileToSend || undefined,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: error instanceof CopilotApiError 
          ? error.message 
          : 'Failed to connect to the server. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          currentView="copilot" 
          onNavigate={onNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-white px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg lg:text-xl">Compliance Copilot</h2>
                <p className="text-xs lg:text-sm text-gray-600">Your AI-powered compliance assistant</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {messages.length === 1 && (
              <div className="px-4 lg:px-6 pt-4 pb-2 flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xs lg:text-sm mb-3 text-gray-600">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedPrompts.map((prompt, index) => {
                      const Icon = prompt.icon;
                      return (
                        <Card
                          key={index}
                          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleSend(prompt.text)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm">{prompt.text}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-3">
                      <div
                        className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {message.role === 'error' && (
                          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-black text-white'
                              : message.role === 'error'
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-white border'
                          }`}
                        >
                          {message.fileName && message.role === 'user' && (
                            <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                              <Paperclip className="w-3 h-3" />
                              <span>{message.fileName}</span>
                            </div>
                          )}
                          {message.role === 'assistant' ? (
                            <div className="text-sm prose prose-sm max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  a: ({ node, ...props }) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" />
                                  ),
                                  code: ({ node, inline, ...props }: any) => (
                                    inline ? (
                                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
                                    ) : (
                                      <code className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto" {...props} />
                                    )
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className={`text-sm whitespace-pre-line ${
                              message.role === 'error' ? 'text-red-700' : ''
                            }`}>
                              {message.content}
                            </p>
                          )}
                          <p className={`text-xs mt-2 ${
                            message.role === 'user' 
                              ? 'text-gray-300' 
                              : message.role === 'error'
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex gap-2 ml-12">
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSend(suggestion)}
                              className="text-xs gap-1"
                            >
                              <Lightbulb className="w-3 h-3" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white border rounded-lg p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 lg:px-6 pb-4 flex-shrink-0">
              <div className="max-w-4xl mx-auto">
                <Card className="p-4">
                  {selectedFile && (
                    <div className="mb-3 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 flex-1 truncate">{selectedFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                      >
                        <X className="w-4 h-4 text-blue-600" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isTyping}
                      className="flex-shrink-0"
                      title="Upload file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                      placeholder="Ask about compliance requirements, get guidance, or request templates..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={() => handleSend()} 
                      disabled={!input.trim() || isTyping} 
                      className="gap-2 flex-shrink-0"
                    >
                      {isTyping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Copilot can help with DORA, NIS2, and ISO27001 compliance guidance. Upload files for document analysis.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
