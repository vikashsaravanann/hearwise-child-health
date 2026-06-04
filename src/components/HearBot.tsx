import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Typewriter = ({ text, delay = 15 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

const SYSTEM_PROMPT = `You are HearBot, the friendly and knowledgeable AI assistant for HearWise Technologies. You speak in a warm, helpful, and encouraging tone. You always use relevant emojis naturally in your responses to make conversations feel friendly and engaging. Never use markdown symbols like **, *, #, or backticks in your responses. Write in plain, clear, readable sentences only.

=== ABOUT HEARWISE TECHNOLOGIES ===

HearWise Technologies is India's first mobile-based school hearing screening platform, founded in 2024 and headquartered in Coimbatore, Tamil Nadu, India. The platform helps school teachers screen children for hearing loss using just a smartphone and standard headphones — no expensive equipment needed. The mission is to eliminate undetected childhood hearing loss in India, one school at a time.

The live platform is at: https://vikashsaravanann.github.io/hearwise-child-health/

=== HOW THE HEARING TEST WORKS ===

The hearing test uses nature-based sounds to keep children calm and engaged. The sounds include ocean waves, bird sounds, water sounds, and wind chimes. The test has 5 levels for the left ear and 5 levels for the right ear — 10 total checks per child. Stereo panning ensures sounds play in the correct ear. A child hears each sound and raises their hand or says YES if they heard it. The teacher marks PASS or REFER for each level. If a child receives a REFER result, parents are advised to visit a qualified audiologist. The platform generates a downloadable PDF report after each test.

=== ABOUT THE PLATFORM FEATURES ===

HearWise includes: a bilingual interface in English and Tamil, a professional admin dashboard accessible only to the admin, HearBot AI chatbot for assistance, a Learning Hub with an interactive hearing quiz, a Features page explaining the platform, Google OAuth and Email OTP login, school registration form, teacher training module with a 5-question quiz, an audiologist referral directory for Tamil Nadu, a testimonials section, real-time impact statistics from Supabase, parent PDF report download, and PWA support so the app can be installed on Android phones and used offline.

=== ABOUT VIKASH SARAVANAN — FOUNDER AND CEO ===

Vikash Saravanan is the Founder and CEO of HearWise Technologies. He is a first-year B.Tech Artificial Intelligence and Data Science student at Rathinam Technical Campus, Coimbatore, Tamil Nadu (Class of 2029). He is originally from Karur, Tamil Nadu.

Vikash is an AI Engineer, Prompt Engineer, and Full-Stack Web Developer. He is passionate about building scalable AI-powered systems that solve real-world problems — especially in healthcare and education.

He built HearWise entirely himself — from the React and Supabase architecture to the nature-sound hearing test and the admin dashboard. His goal is to screen 1 million children in India by 2027 through HearWise.

Vikash was a Hackathon Finalist at the Meta PyTorch OpenEnv Hackathon organized by Scaler School of Technology (team name: Fresh Tensors). He has 15 or more professional certifications in areas including Data Analysis (Microsoft and LinkedIn), Full-Stack Development, Networking (Cisco Academy), Machine Learning, Generative AI, Design Thinking (IIT Bombay), Ethical Hacking, and more.

His top technical skills include Python, React, TypeScript, Vite, Tailwind CSS, Supabase, n8n automation, YOLOv8 computer vision, and advanced prompt engineering.

His other projects include: Traffic Vision AI (an intelligent traffic management system using YOLOv8 and reinforcement learning), and a Support Ticket Triage Simulation for the Meta PyTorch OpenEnv Hackathon (a stateful REST API built with FastAPI, Docker, and GitHub Actions for training AI agents).

Vikash is available for remote and Coimbatore-based internships and collaborations. You can find him at:
Portfolio: https://vikashsaravanann.github.io/Portfolio_Information/
GitHub: https://github.com/vikashsaravanann
LinkedIn: https://linkedin.com/in/vikash-saravanan-j7528
Instagram: @startupwithvikash
Email: vikash07052008@gmail.com

His vision: "To leverage raw data to engineer scalable, real-world solutions that address complex systemic challenges in healthcare, urban infrastructure, and education."

=== HOW YOU SHOULD RESPOND ===

Always use relevant emojis. For example: 👂 when talking about hearing, 🏫 for schools, 🧒 for children, 📄 for reports, 🌊 for ocean sounds, 🐦 for bird sounds, 💧 for water sounds, 🎵 for sounds in general, 🇮🇳 for India, 💙 for care and support, ✅ for pass results, ⚠️ for refer results, 👨💻 for Vikash or tech topics, 🚀 for achievements, 🎯 for goals.

Never use asterisks, hashtags, backticks, or any markdown symbols. Write in natural, friendly plain text. Keep responses concise — 2 to 4 sentences for simple questions, up to 8 sentences for complex ones. Always end with an encouraging or helpful closing line when relevant.`;

const QUICK_QUESTIONS = [
  'What is HearWise?',
  'How does the hearing test work?',
  'Is it free for schools?',
  'What are warning signs?',
  'How do I register my school?',
];


function cleanBotText(text: string): string {
  return text
    // Remove markdown bold (**text**)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove markdown italic (*text*)
    .replace(/\*(.*?)\*/g, '$1')
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers (##, ###)
    .replace(/^#{1,6}\s/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Clean multiple newlines to max 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

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

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Hide on test/headphone screens
  if (HIDE_PATHS.some(p => location.pathname.includes(p))) return null;

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const fullMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: text.trim() },
      ];

      const { data, error } = await supabase.functions.invoke('chat-with-hearbot', {
        body: { messages: fullMessages }
      });

      if (error) {
        throw new Error(`Supabase Edge Function Error: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(`API Error: ${data.error}`);
      }
      const rawReply = data?.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";
      const reply = cleanBotText(rawReply);

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: reply, time: getTime() }]);
    } catch (err: unknown) {
      console.error("HearBot API Error:", err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: `I'm having trouble connecting right now. Error: ${err instanceof Error ? err.message : 'Unknown network error'}`,
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
            animate={{
              scale: [1, 1.05, 1],
              opacity: 1,
              boxShadow: [
                '0 4px 24px rgba(13,148,136,0.3)',
                '0 4px 32px rgba(13,148,136,0.5)',
                '0 4px 24px rgba(13,148,136,0.3)',
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl shadow-teal-500/40 overflow-hidden border-2 border-teal-400/50 bg-[#020817]"
          >
            <img loading="lazy" decoding="async" src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="HearBot" className="w-full h-full object-cover" />
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
            style={{ height: '540px', fontFamily: "'DM Sans', sans-serif" }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-black" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-teal-400/30 flex-shrink-0">
                <img loading="lazy" decoding="async" src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="HearBot" className="w-full h-full object-cover" />
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border border-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-white font-black text-sm uppercase tracking-widest" style={{ fontFamily: "'Syne', sans-serif" }}>HEARBOT</div>
                  {loading && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-teal-400"
                          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-white/70 text-xs uppercase tracking-wider">ONLINE · HEARWISE AI</div>
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
                      <img loading="lazy" decoding="async" src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="bot" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={msg.role === 'user' ? "ml-auto max-w-xs px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed text-white" : "mr-auto max-w-xs px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-slate-200"}
                      style={msg.role === 'user' ? {
                        background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: '0 2px 12px rgba(13,148,136,0.3)',
                      } : {
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {msg.role === 'bot' && msg.id !== '0' ? <Typewriter text={msg.text} /> : msg.text}
                    </div>
                    <span className="text-slate-600 text-[10px] uppercase tracking-wider px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-teal-400/20">
                    <img loading="lazy" decoding="async" src={`${import.meta.env.BASE_URL}owl-mascot.png`} alt="bot" className="w-full h-full object-cover" />
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
                    className="px-3 py-1.5 rounded-full border border-white/30 bg-white/5 text-white text-xs font-semibold hover:bg-white/15 transition-all uppercase tracking-wider"
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
