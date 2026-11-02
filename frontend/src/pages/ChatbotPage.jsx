import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Target,
  IndianRupee,
  Compass,
  Layers,
  RotateCcw,
} from 'lucide-react';

export default function ChatbotPage() {
  const { user, studentProfile } = useAuth();

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      role: 'coordinator',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your **AI Admission Coordinator** orchestrating 5 specialized agents for Andhra Pradesh engineering admissions.\n\nHow can our multi-agent team assist you today? You can ask about AP EAPCET cutoffs, college comparisons, tuition fees, or counselling procedures.`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('coordinator');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const agentPersonas = [
    { id: 'coordinator', name: 'Coordinator (All-in-One)', icon: Bot, color: 'text-brand-600 bg-brand-50' },
    { id: 'college_finder', name: 'College Finder', icon: Layers, color: 'text-blue-600 bg-blue-50' },
    { id: 'admission_eligibility', name: 'Eligibility Specialist', icon: Target, color: 'text-purple-600 bg-purple-50' },
    { id: 'fee_analysis', name: 'Fee & JVD Specialist', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'admission_guidance', name: 'Counselling Guide', icon: Compass, color: 'text-amber-600 bg-amber-50' },
  ];

  const suggestedQuestions = [
    'What colleges can I get with rank 8,500 in AP EAPCET?',
    'Explain the Jagananna Vidya Deevena (JVD) fee scheme',
    'Compare Andhra University (AUCE) vs VR Siddhartha (VRSEC)',
    'What documents are needed for AP web counselling?',
    'What is the difference between Reach, Match, and Safer colleges?',
  ];

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMessage = {
      sender: 'user',
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat({
        message: textToSend,
        agentRole: selectedAgent,
        student: studentProfile || {},
        history: messages.map((m) => ({ role: m.sender, content: m.text })),
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            role: res.data.agentRole || selectedAgent,
            text: res.data.reply,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          role: selectedAgent,
          text: 'Apologies, our agent encountered a connection delay. Please retry your query or check our dedicated Eligibility and Fee Analysis tabs.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'assistant',
        role: 'coordinator',
        text: 'Chat history cleared. How may our specialized agents assist your admission search now?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 h-[calc(100vh-5rem)] flex flex-col">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand-600" />
            <span>Interactive AI Admission Chatbot</span>
          </h1>
          <p className="text-xs text-slate-500">
            Powered by LangGraph multi-agent coordination & AP EAPCET criteria
          </p>
        </div>

        <button
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Agent Persona Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1">
          Active Persona:
        </span>
        {agentPersonas.map((persona) => {
          const Icon = persona.icon;
          const isSelected = selectedAgent === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => setSelectedAgent(persona.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{persona.name}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-brand-600 text-white'
                    : 'bg-gradient-to-tr from-brand-700 to-accent-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none space-y-2'
                }`}
              >
                {!isUser && (
                  <div className="text-[10px] font-bold text-brand-700 uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Agent: {msg.role.replace('_', ' ')}</span>
                  </div>
                )}
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 rounded-tl-none flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Multi-agent consultation in progress...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium whitespace-nowrap transition border border-slate-200"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-2 shrink-0">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about AP engineering admissions, cutoffs, or fees..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm focus:outline-none resize-none bg-transparent"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white flex items-center justify-center shadow-xs transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
