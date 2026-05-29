import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Sparkles, GraduationCap, Users } from 'lucide-react';
import mascot from '@/assets/owl-mascot.png';

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
}

const PRESET_QUESTIONS = {
  student: [
    "How does the hearing game work?",
    "Why are my ears ringing?",
    "Can you show me a cool ear fact?",
    "Is it safe to listen to loud music?"
  ],
  teacher: [
    "How do I view my class results?",
    "What do the different hearing thresholds mean?",
    "How do I add a new student?",
    "Can I export the screening report?"
  ],
  parent: [
    "What should I do if my child failed the test?",
    "How often should my child's hearing be checked?",
    "What are signs of hearing loss in children?",
    "How do I interpret the audiogram?"
  ]
};

const MOCK_ANSWERS: Record<string, string> = {
  // Student
  "How does the hearing game work?": "Hoot! It's easy! Just tap the glowing pearl whenever you hear a sound. The sounds might get really quiet, like a tiny fish blowing bubbles, so listen carefully!",
  "Why are my ears ringing?": "Ringing in your ears is sometimes called 'tinnitus'. It can happen if you've been around really loud noises, like a loud concert. If it doesn't go away, it's a good idea to tell a grown-up! Hoot!",
  "Can you show me a cool ear fact?": "Did you know that your ear contains the smallest bones in your entire body? They are called the malleus, incus, and stapes, and they help you hear! Amazing, right? 🦉",
  "Is it safe to listen to loud music?": "Listening to very loud music for a long time can make your ears tired and even hurt your hearing. It's best to keep the volume at a safe level—like a gentle stream instead of a roaring waterfall!",
  
  // Teacher
  "How do I view my class results?": "To view class results, head over to the 'Dashboard' and select the 'My Report' or 'Session Summary' section. You'll see a list of all recent screenings.",
  "What do the different hearing thresholds mean?": "A threshold of 20dB or lower is generally considered normal hearing in children. Higher thresholds (e.g., 30dB, 40dB) indicate mild to moderate hearing loss and may require a referral to an audiologist.",
  "How do I add a new student?": "You can add a new student by going to the 'Student Entry' page under the Hearing Test section. Just fill in their details and you're ready to start a screening!",
  "Can I export the screening report?": "Currently, you can view the detailed report cards in the 'My Report' section. Future updates will include direct PDF export functionality. Let me know if you need help taking a screenshot for now!",

  // Parent
  "What should I do if my child failed the test?": "Don't panic! A 'refer' on a screening just means we need a closer look. We highly recommend booking an appointment with a pediatric audiologist for a comprehensive evaluation.",
  "How often should my child's hearing be checked?": "It's generally recommended to have school-aged children screened every 1-2 years, or anytime you notice they are asking 'what?' frequently, turning up the TV volume, or having trouble at school.",
  "What are signs of hearing loss in children?": "Common signs include delayed speech, lack of response to their name, sitting very close to the TV, speaking loudly, or difficulty following directions in noisy environments.",
  "How do I interpret the audiogram?": "An audiogram plots pitch (low to high) across the top, and volume (soft to loud) down the side. Marks near the top mean your child can hear very soft sounds. Marks further down indicate they need sounds to be louder to hear them."
};

export default function ChatAssistanceModal({ isOpen, onClose }: ChatAssistanceModalProps) {
  const [role, setRole] = useState<Role>('student');
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset messages when opening if needed, but keeping history is fine
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = (text: string) => {
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

    // Simulate AI response delay
    setTimeout(() => {
      let responseText = MOCK_ANSWERS[text];
      
      if (!responseText) {
        if (role === 'student') {
          responseText = "Hoot! That's an interesting question. I'm still learning about that. Try asking me about the hearing game or ear facts!";
        } else if (role === 'teacher') {
          responseText = "I don't have that specific information in my clinical database right now. Please check the documentation in the dashboard or contact support.";
        } else {
          responseText = "That's a great question. While I'm an AI and not a doctor, I recommend consulting with a certified audiologist for specific medical advice.";
        }
      }

      const ollieMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ollie',
        text: responseText,
        role
      };

      setMessages(prev => [...prev, ollieMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setMessages([{
      id: Date.now().toString(),
      sender: 'ollie',
      text: newRole === 'student' 
        ? "Hoot hoot! I'm Ollie! Ready to learn about ears and sounds?"
        : newRole === 'teacher'
        ? "Hello! I'm your clinical and educational assistant. How can I assist with your screening workflow today?"
        : "Welcome! I'm here to help empower you with information about your child's hearing health. What would you like to know?",
      role: newRole
    }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        style={{ height: '85vh', maxHeight: '800px' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-teal-100">
              <img src={mascot} alt="Ollie" className="w-10 h-10 object-contain mt-1" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Ask Ollie <Sparkles className="w-4 h-4 text-teal-500" />
              </h2>
              <p className="text-xs font-medium text-slate-500">AI Support Assistant</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="flex p-2 bg-slate-50 border-b border-slate-100 gap-2">
          {(['student', 'parent', 'teacher'] as Role[]).map((r) => {
            const icons = {
              student: <GraduationCap size={16} />,
              parent: <Users size={16} />,
              teacher: <User size={16} />
            };
            return (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                  role === r 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {icons[r]}
                <span className="capitalize">{r}</span>
              </button>
            )
          })}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ollie' && (
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                  <img src={mascot} alt="Ollie" className="w-6 h-6 object-contain" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-2xl p-4 text-sm font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                <img src={mascot} alt="Ollie" className="w-6 h-6 object-contain" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          {/* Suggested Questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_QUESTIONS[role].map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs font-bold px-3 py-1.5 rounded-full border border-teal-100 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:border-teal-200 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Ollie anything..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl p-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
