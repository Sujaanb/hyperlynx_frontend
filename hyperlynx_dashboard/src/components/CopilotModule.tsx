import React, { useState } from 'react';
import { Send, Bot, User, Lightbulb, Sparkles, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

interface CopilotModuleProps {
  onNavigate: (view: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
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

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(messageText),
        timestamp: new Date(),
        suggestions: getSuggestions(messageText),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('dora')) {
      return "DORA (Digital Operational Resilience Act) requires financial entities to:\n\n1. **ICT Risk Management**: Establish comprehensive frameworks for identifying and managing ICT risks\n2. **Incident Response**: Define procedures with strict timelines (major incidents reported within 4 hours)\n3. **Third-Party Risk**: Implement due diligence for ICT service providers\n4. **Testing**: Conduct regular resilience testing including TLPT\n\nWould you like me to help you create an implementation plan for any of these areas?";
    }
    
    if (lowerQuery.includes('priority') || lowerQuery.includes('priorities')) {
      return "Based on your assessment, here are your top compliance priorities:\n\n**High Priority:**\n1. Define incident response SLAs (DORA)\n2. Implement security incident reporting process (NIS2)\n3. Update ICT risk assessment framework (DORA)\n\n**Medium Priority:**\n4. Review third-party vendor agreements (DORA)\n5. Enhance supply chain security measures (NIS2)\n\n**Low Priority:**\n6. Complete asset inventory documentation (ISO27001)\n\nI can help you create detailed action plans for any of these items.";
    }
    
    if (lowerQuery.includes('iso')) {
      return "ISO27001 is an international standard for Information Security Management Systems (ISMS). Key requirements include:\n\n• **Context of Organization**: Understanding your security landscape\n• **Leadership**: Management commitment and roles\n• **Planning**: Risk assessment and treatment\n• **Support**: Resources, competence, awareness\n• **Operation**: Implementing controls from Annex A\n• **Evaluation**: Monitoring and internal audits\n• **Improvement**: Continuous enhancement\n\nWould you like guidance on implementing any specific control area?";
    }
    
    if (lowerQuery.includes('roadmap') || lowerQuery.includes('plan')) {
      return "I can help you create a comprehensive compliance roadmap. Here's a suggested 6-month timeline:\n\n**Month 1-2: Foundation**\n• Complete gap assessment\n• Define governance structure\n• Establish baseline documentation\n\n**Month 3-4: Implementation**\n• Deploy critical controls\n• Set up incident response procedures\n• Conduct staff training\n\n**Month 5-6: Testing & Refinement**\n• Run tabletop exercises\n• Perform internal audits\n• Refine based on findings\n\nWould you like me to create a detailed project plan with tasks and owners?";
    }
    
    return "I can help you with various compliance topics including DORA, NIS2, and ISO27001 requirements. I can also assist with:\n\n• Creating implementation plans\n• Generating policy templates\n• Explaining specific requirements\n• Prioritizing compliance activities\n• Providing best practice guidance\n\nWhat specific aspect would you like to explore?";
  };

  const getSuggestions = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('dora')) {
      return ['Create DORA implementation plan', 'Show incident response template', 'Third-party risk checklist'];
    }
    if (lowerQuery.includes('priority')) {
      return ['Create action plan', 'Assign tasks to team', 'Set timeline'];
    }
    if (lowerQuery.includes('roadmap')) {
      return ['Generate detailed timeline', 'Export to project management tool', 'Schedule team meeting'];
    }
    
    return ['Tell me more', 'Show examples', 'Create template'];
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

          <div className="flex-1 overflow-hidden p-4 lg:p-6">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {messages.length === 1 && (
                <div className="mb-6">
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
              )}

              <ScrollArea className="flex-1 pr-4">
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
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-black text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
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
              </ScrollArea>

              <div className="mt-6">
                <Card className="p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about compliance requirements, get guidance, or request templates..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="gap-2">
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Copilot can help with DORA, NIS2, and ISO27001 compliance guidance
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
