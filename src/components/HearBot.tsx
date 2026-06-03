import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

const SYSTEM_PROMPT = `You are HearBot, the official AI assistant and virtual tour guide of HearWise Technologies — India's first mobile-based school hearing screening platform. You are helpful, highly engaging, and know absolutely everything about how to navigate and use this platform. Your primary job is to guide users through the website, explaining what each section does and how to use it.

ABOUT HEARWISE:
- Founded by Vikash Saravanan in Chennai, Tamil Nadu.
- Mission: "Hear Every Child. Reach Every School."
- Platform: India's first offline-capable (PWA) school hearing screening tool requiring only a smartphone and headphones. Screens 50+ kids per hour for free.

PLATFORM TOUR GUIDE - HOW TO NAVIGATE THE WEBSITE:
If a user asks how to use the website, where to go, or what features exist, actively guide them to these specific pages:

1. THE SCREENING FLOW (For Teachers/Admins):
- "Setup Session" (/setup): Start here to enter school, teacher, and ambient noise details.
- "Student Entry" (/student-entry): Enter the child's name, age, gender, and roll number.
- "Headphone Check" (/headphone-check): A quick stereo test to ensure Left/Right earbuds are worn correctly.
- "Ocean Levels" (/ocean-levels): The core test. 5 frequency levels (Nature sounds: waves, birds, etc.) tested on Left and Right ears.
- "Session Summary" (/session-summary): View all kids tested today and generate/download professional PDF reports for parents.

2. LEARNING & GAMIFICATION (For Kids):
- "Games" (/games): Play 'Sound Match' and 'Rhythm Master' to learn about sounds interactively.
- "Trophies" (/trophies): View achievements and badges earned by taking care of hearing health.

3. EXPLORE & EDUCATION (For Everyone):
- "Ear Care" (/ear-care): Tips on how to clean and protect your ears.
- "Education" (/education): Interactive modules explaining the anatomy of the ear and how hearing works.
- "Sound Explorer" (/sound-explorer): A decibel scale showing safe vs. dangerous noise levels (e.g., leaves rustling vs. rock concerts).
- "My Report" (/my-report): Parents can enter their child's ID to download their screening results PDF.

4. HEARING HEALTH RESOURCES:
- "Headphone Safety" (/headphone-safety): The 60/60 rule (60% volume for 60 mins maximum).
- "Self Check" (/self-check): A quick questionnaire to see if you might have hearing loss symptoms.
- "Book Appointment" (/book-appointment): Connect with our verified network of Audiologists across Tamil Nadu.

5. ADMIN DASHBOARD (/admin):
- A secure, password-protected area for school principals and government officials.
- Features beautiful analytics charts showing screening metrics, referral rates, and student demographics.

YOUR PERSONALITY & RULES:
- Be incredibly enthusiastic, welcoming, and act as a proud guide of HearWise.
- When answering, format your responses clearly, using bullet points if listing features.
- If they ask "what can I do here?" or "guide me", give them a quick tour of the 3 main areas: Screening, Kids Games, and Education.
- Never make up URLs or features that don't exist.
- Keep answers concise but highly informative. Use emojis like 🎧, 🌊, 🏥, 🎮 naturally.`;

const QUICK_QUESTIONS = [
  'What is HearWise?',
  'How does the hearing test work?',
  'Is it free for schools?',
  'What are warning signs?',
  'How do I register my school?',
];

function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Hide chatbot on test screens
const HIDE_PATHS = ['/ocean-test', '/active-test', '/headphone-check'];

export default function HearBot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: "Hi! I'm HearBot 🦉 — your HearWise assistant. Ask me anything about our hearing screening platform, how the test works, or how to get your school onboarded.",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on test/headphone screens
  if (HIDE_PATHS.some(p => location.pathname.includes(p))) return null;

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Using the environment variable for Groq API Key
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      const history = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch(
        `https://api.groq.com/openai/v1/chat/completions`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...history,
              { role: 'user', content: text.trim() },
            ],
            max_tokens: 300, 
            temperature: 0.4,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from Groq');
      }

      const data = await response.json();
      const reply =
        data?.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that. Please try again.";

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: reply, time: getTime() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: "I'm having trouble connecting right now. Please check your internet and try again.",
        time: getTime(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  const hasUserMessages = messages.some(m => m.role === 'user');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating bubble button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="relative w-16 h-16 rounded-full shadow-2xl shadow-teal-500/40 overflow-hidden border-2 border-teal-400/50 bg-[#020817]"
          >
            <img src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="HearBot" className="w-full h-full object-cover" />
            <span className="absolute inset-0 rounded-full animate-ping bg-teal-400/20 pointer-events-none" />
            <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-teal-400 border-2 border-[#020817]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-0 right-0 w-[370px] max-w-[calc(100vw-24px)] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
            style={{ height: '540px' }}
          >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
              <img src={`${import.meta.env.BASE_URL}space-bg.png`} alt="background" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-teal-400/30 flex-shrink-0">
                <img src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="HearBot" className="w-full h-full object-cover" />
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border border-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-black text-sm uppercase tracking-widest">HEARBOT</div>
                <div className="text-teal-400 text-xs uppercase tracking-wider">ONLINE · HEARWISE AI</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5 border border-teal-400/20">
                      <img src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="bot" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-black font-semibold rounded-tr-sm'
                          : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-slate-600 text-[10px] uppercase tracking-wider px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-teal-400/20">
                    <img src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="bot" className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-teal-400"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick questions */}
            {!hasUserMessages && (
              <div className="relative z-10 px-4 pb-2 flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400 text-xs font-semibold hover:bg-teal-500/15 transition-all uppercase tracking-wider"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="relative z-10 px-4 pb-4 pt-2 border-t border-white/5">
              <div className="flex gap-2 items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 focus-within:border-teal-500/50 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="ASK HEARBOT..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none uppercase tracking-wider disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center disabled:opacity-40 shadow-lg shadow-teal-500/30 flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
              <p className="text-slate-700 text-[10px] text-center mt-2 uppercase tracking-widest">
                HEARWISE TECHNOLOGIES · AI ASSISTANT
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
