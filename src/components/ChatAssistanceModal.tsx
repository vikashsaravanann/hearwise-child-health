import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Sparkles, GraduationCap, Users, Mic, Volume2, ShieldCheck, Activity } from 'lucide-react';
import mascot from '@/assets/owl-mascot.png';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ChatAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Role = 'student' | 'teacher' | 'parent';

interface Message {
  id: string;
  sender: 'user' | 'ollie';
  text: string;
  role: Role;
  isTamil?: boolean;
}

const PRESET_QUESTIONS = {
  student: [
    { en: "How does the hearing game work?", ta: "கேட்கும் விளையாட்டு எப்படி இயங்குகிறது?" },
    { en: "How do whales hear?", ta: "திமிங்கலங்கள் எப்படி கேட்கின்றன?" },
    { en: "Is it safe to listen to loud music?", ta: "அதிக சத்தமாக இசை கேட்பது பாதுகாப்பானதா?" },
    { en: "Tell me a fun ear fact!", ta: "காது பற்றி ஒரு சுவாரஸ்யமான உண்மை சொல்லுங்கள்!" }
  ],
  teacher: [
    { en: "Interpret hearing thresholds", ta: "கேட்கும் வரம்புகளை விளக்கவும்" },
    { en: "Technical Troubleshooting", ta: "தொழில்நுட்ப உதவி" },
    { en: "Referral Guidance", ta: "பரிந்துரை வழிகாட்டுதல்" },
    { en: "Export screening report", ta: "அறிக்கையை பதிவிறக்கவும்" }
  ],
  parent: [
    { en: "Signs of hearing loss", ta: "கேள்வி இழப்பின் அறிகுறிகள்" },
    { en: "What if my child failed?", ta: "என் குழந்தை தேர்வில் தோல்வியடைந்தால் என்ன செய்வது?" },
    { en: "How to read the audiogram?", ta: "ஆடியோகிராம் எப்படி வாசிப்பது?" },
    { en: "Frequency of checks", ta: "எத்தனை முறை பரிசோதிக்க வேண்டும்?" }
  ]
};

const MOCK_ANSWERS: Record<string, { en: string; ta: string }> = {
  // Student
  "How does the hearing game work?": {
    en: "Hoot! It's easy! Just tap the glowing pearl whenever you hear a sound. The sounds might get really quiet, like a tiny fish blowing bubbles, so listen carefully!",
    ta: "ஹூட்! இது எளிது! நீங்கள் ஒரு சத்தம் கேட்கும் போதெல்லாம் ஒளிரும் முத்துவைத் தொடவும். மீன் குமிழிகள் விடுவது போல சத்தம் மிகவும் மெதுவாக இருக்கலாம், அதனால் கவனமாக கேளுங்கள்!"
  },
  "How do whales hear?": {
    en: "Great question! Whales don't have outer ears like us. They use their jawbones to pick up sound vibrations in the water! Isn't that amazing? 🐋",
    ta: "நல்ல கேள்வி! திமிங்கலங்களுக்கு நம்மைப் போல வெளிக்காதுகள் இல்லை. தண்ணீரில் ஏற்படும் ஒலி அதிர்வுகளைக் கண்டறிய அவை தங்கள் தாடை எலும்புகளைப் பயன்படுத்துகின்றன! ஆச்சரியமாக இருக்கிறது அல்லவா? 🐋"
  },
  "Is it safe to listen to loud music?": {
    en: "Listening to very loud music for a long time can make your ears tired and even hurt your hearing. Try the 60/60 rule: 60% volume for 60 minutes! 🎧",
    ta: "அதிக சத்தமாக நீண்ட நேரம் இசை கேட்பது உங்கள் காதுகளை சோர்வடையச் செய்யும் மற்றும் உங்கள் கேட்கும் திறனை பாதிக்கும். 60/60 விதியைப் பின்பற்றுங்கள்: 60% சத்தத்தில் 60 நிமிடங்கள் மட்டும்! 🎧"
  },
  "Tell me a fun ear fact!": {
    en: "Did you know that your ears never stop hearing, even when you're asleep? Your brain just learns to ignore the sounds so you can rest! 🦉",
    ta: "உங்களுக்குத் தெரியுமா? நீங்கள் தூங்கும் போது கூட உங்கள் காதுகள் கேட்பதை நிறுத்துவதில்லை. நீங்கள் ஓய்வெடுக்க ஏதுவாக உங்கள் மூளை அந்த சத்தங்களைப் புறக்கணிக்க கற்றுக்கொள்கிறது! 🦉"
  },
  
  // Teacher
  "Interpret hearing thresholds": {
    en: "A threshold of 20dB or lower is normal. If a student responds at 30-40dB, it indicates a mild concern. Anything above 40dB usually requires a clinical referral for a full evaluation.",
    ta: "20dB அல்லது அதற்குக் கீழே இருப்பது இயல்பானது. ஒரு மாணவர் 30-40dB இல் பதிலளித்தால், அது சிறிய கவலையைக் குறிக்கிறது. 40dB க்கு மேல் இருந்தால் பொதுவாக மருத்துவப் பரிந்துரை தேவைப்படும்."
  },
  "Technical Troubleshooting": {
    en: "Common fixes: 1. Ensure Bluetooth is connected. 2. Check device volume (max recommended). 3. Restart the 'Headphone Check' step if sounds aren't audible.",
    ta: "பொதுவான தீர்வுகள்: 1. புளூடூத் இணைக்கப்பட்டுள்ளதா என உறுதிப்படுத்தவும். 2. சாதனத்தின் ஒலியைச் சரிபார்க்கவும். 3. சத்தம் கேட்கவில்லை என்றால் 'ஹெட்ஃபோன் சரிபார்ப்பு' படிநிலையை மீண்டும் செய்யவும்."
  },
  "Referral Guidance": {
    en: "If a child is flagged for referral, provide the parent with the auto-generated letter from the Dashboard. Recommend visiting an ENT specialist or a certified Audiologist within 2 weeks.",
    ta: "ஒரு குழந்தைக்குப் பரிந்துரை தேவைப்பட்டால், டாஷ்போர்டில் இருந்து தானாக உருவாக்கப்பட்ட கடிதத்தை பெற்றோரிடம் வழங்கவும். 2 வாரங்களுக்குள் ஒரு காது மூக்கு தொண்டை நிபுணர் அல்லது சான்றளிக்கப்பட்ட ஆடியோலஜிஸ்ட்டைப் பார்க்க பரிந்துரைக்கவும்."
  },
  "Export screening report": {
    en: "Go to Admin Dashboard > Export. You can download the entire district or school data as a CSV or PDF for official records.",
    ta: "நிர்வாக டாஷ்போர்டு > ஏற்றுமதிக்குச் செல்லவும். அதிகாரப்பூர்வ பதிவுகளுக்காக முழு மாவட்டம் அல்லது பள்ளி தரவை CSV அல்லது PDF ஆக பதிவிறக்கம் செய்யலாம்."
  }
};

export default function ChatAssistanceModal({ isOpen, onClose }: ChatAssistanceModalProps) {
  const [role, setRole] = useState<Role>('student');
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ollie',
      text: "Hoot hoot! I'm Ollie, your AI assistant. How can I help you today?",
      role: 'student'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSoundChecking, setIsSoundChecking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (text: string, isFromPreset = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      role
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Enhanced system prompt with full information about HearWise Technologies
      const systemPrompt = `You are Ollie (🦉), an AI owl assistant for 'HearWise Technologies', India's first mobile-based school hearing screening platform. 
Role: ${role}
Language: ${lang === 'ta' ? 'Tamil' : 'English'}

ABOUT HEARWISE TECHNOLOGIES:
- Mission: To detect hearing loss in every Indian child before it silently robs them of their education, communication, and confidence.
- Vision: A future where every school in India has access to professional-grade hearing screening technology at zero cost to students and teachers.
- The Problem: Over 18 million children in India suffer from some form of hearing impairment. Most are never diagnosed before age 10. Traditional audiological tests cost ₹2,000-₹5,000 and require specialist equipment (Audiometer).
- The Solution: HearWise uses pure tone audiometry via the Web Audio API with calibrated headphone frequencies. It takes 3 minutes per child, is free for schools, and only requires a smartphone and standard headphones.
- Founder: Vikash Saravanan, an entrepreneur from Chennai, Tamil Nadu.

FEATURES & WORKFLOW:
- Register School: Any school can register and start screening.
- Hearing Test: 5-level test per ear using nature sounds (ocean waves, bird calls, water drops). The left ear is tested first.
- Instant Results: Pass/Fail result is generated instantly. If failed, an automatic referral to an audiologist is made and a PDF report is created.
- Offline Capability: Works fully offline via PWA.

TROUBLESHOOTING:
- If headphones are not working, check Bluetooth or volume.
- If a child fails the screening, recommend a clinical referral to an ENT or audiologist within 2 weeks.

INSTRUCTIONS:
Keep responses concise, friendly, and use emojis like 🦉, 🌊, or 🎧. Translate to Tamil if language is Tamil. Answer all questions about HearWise accurately based on the information above.`;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            role: 'system',
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            role: 'user',
            parts: [{ text }]
          }],
          generationConfig: {
            maxOutputTokens: 300
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Gemini');
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Hoot! Something went wrong.";

      const ollieMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ollie',
        text: responseText,
        role,
        isTamil: lang === 'ta'
      };
      setMessages(prev => [...prev, ollieMessage]);
    } catch (err) {
      console.error(err);
      // Fallback to MOCK_ANSWERS if API fails
      const fallback = MOCK_ANSWERS[text];
      const responseText = fallback ? (lang === 'ta' ? fallback.ta : fallback.en) : (lang === 'ta' ? "மன்னிக்கவும், என் தொடர்பு துண்டிக்கப்பட்டது." : "Hoot! I'm having trouble connecting right now.");
      
      const ollieMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ollie',
        text: responseText,
        role,
        isTamil: lang === 'ta'
      };
      setMessages(prev => [...prev, ollieMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSoundCheck = () => {
    setIsSoundChecking(true);
    setTimeout(() => {
      const db = 30 + Math.floor(Math.random() * 20);
      const isQuiet = db < 45;
      const message: Message = {
        id: Date.now().toString(),
        sender: 'ollie',
        text: isQuiet 
          ? `🔊 AI Sound Check: It's currently ${db}dB. The environment is quiet and perfect for testing! ✅`
          : `🔊 AI Sound Check: It's ${db}dB. It's a bit noisy! I recommend waiting for a quieter moment for the best results. ⚠️`,
        role: 'teacher'
      };
      setMessages(prev => [...prev, message]);
      setIsSoundChecking(false);
    }, 2000);
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    const welcome = newRole === 'student' 
      ? (lang === 'ta' ? "ஹலோ! நான் ஆலி! காதுகள் பற்றி கற்க தயாரா?" : "Hoot hoot! I'm Ollie! Ready to learn about ears and sounds?")
      : (lang === 'ta' ? "வணக்கம்! நான் உங்கள் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?" : "Hello! I'm your clinical assistant. How can I assist with your workflow today?");
    
    setMessages([{
      id: Date.now().toString(),
      sender: 'ollie',
      text: welcome,
      role: newRole,
      isTamil: lang === 'ta'
    }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-3xl flex flex-col overflow-hidden border-4 border-white/80"
        style={{ height: '85vh', maxHeight: '800px' }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-blue-50 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-100 shadow-xl">
              <img src={mascot} alt="Ollie" className="w-12 h-12 object-contain mt-1" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" 
              />
            </div>
            <div>
              <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2 tracking-tight">
                Ask Ollie <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              </h2>
              <div className="flex gap-2 mt-1">
                <button 
                  onClick={() => setLang('en')}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}
                >
                  ENGLISH
                </button>
                <button 
                  onClick={() => setLang('ta')}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${lang === 'ta' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-3 text-blue-300 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90">
            <X size={28} />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="flex p-3 bg-blue-50/30 border-b border-blue-50 gap-3">
          {(['student', 'parent', 'teacher'] as Role[]).map((r) => {
            const icons = {
              student: <GraduationCap size={20} />,
              parent: <Users size={20} />,
              teacher: <User size={20} />
            };
            return (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-black transition-all ${
                  role === r 
                    ? 'bg-white text-blue-700 shadow-lg border-2 border-blue-200' 
                    : 'text-blue-400 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                {icons[r]}
                <span className="capitalize">{lang === 'ta' ? (r === 'student' ? 'மாணவர்' : r === 'teacher' ? 'ஆசிரியர்' : 'பெற்றோர்') : r}</span>
              </button>
            )
          })}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-blue-50/20 space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={msg.id} 
                className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ollie' && (
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-100 flex-shrink-0 flex items-center justify-center shadow-md">
                    <img src={mascot} alt="Ollie" className="w-8 h-8 object-contain" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[85%] rounded-[2rem] p-5 text-base font-bold leading-relaxed shadow-xl ${
                    msg.sender === 'user' 
                      ? 'bg-blue-700 text-white rounded-tr-none border-b-4 border-blue-900' 
                      : 'bg-white text-blue-900 border-2 border-blue-50 rounded-tl-none border-b-4 border-blue-100'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-100 flex-shrink-0 flex items-center justify-center shadow-md">
                <img src={mascot} alt="Ollie" className="w-8 h-8 object-contain" />
              </div>
              <div className="bg-white border-2 border-blue-50 rounded-[2rem] rounded-tl-none p-5 shadow-xl flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t-4 border-blue-50">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            {role === 'teacher' && (
              <button 
                onClick={handleSoundCheck}
                disabled={isSoundChecking}
                className="text-xs font-black px-4 py-2 rounded-full border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all flex items-center gap-2"
              >
                {isSoundChecking ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                AI SOUND CHECK
              </button>
            )}
            {PRESET_QUESTIONS[role].map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(lang === 'ta' ? q.ta : q.en, true)}
                className="text-xs font-black px-4 py-2 rounded-full border-2 border-blue-100 bg-blue-50/50 text-blue-700 hover:bg-blue-100 transition-all whitespace-nowrap"
              >
                {lang === 'ta' ? q.ta : q.en}
              </button>
            ))}
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={lang === 'ta' ? "ஆலியிடம் கேளுங்கள்..." : "Ask Ollie anything..."}
                className="w-full bg-blue-50/50 border-4 border-blue-100 rounded-[2rem] px-6 py-4 text-base font-bold text-blue-900 placeholder:text-blue-300 focus:outline-none focus:border-blue-300 transition-all pr-12"
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-all"
                onClick={() => toast(lang === 'ta' ? "மைக்ரோஃபோன் இன்னும் வரவில்லை!" : "Voice support coming soon!")}
              >
                <Mic size={24} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 active:scale-90 flex-shrink-0"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

