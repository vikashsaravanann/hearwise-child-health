import re

path = 'src/components/HearBot.tsx'
with open(path, 'r') as f:
    content = f.read()

# 1. System Prompt
new_prompt = """const SYSTEM_PROMPT = `You are HearBot, the friendly and knowledgeable AI assistant for HearWise Technologies. You speak in a warm, helpful, and encouraging tone. You always use relevant emojis naturally in your responses to make conversations feel friendly and engaging. Never use markdown symbols like **, *, #, or backticks in your responses. Write in plain, clear, readable sentences only.

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

Never use asterisks, hashtags, backticks, or any markdown symbols. Write in natural, friendly plain text. Keep responses concise — 2 to 4 sentences for simple questions, up to 8 sentences for complex ones. Always end with an encouraging or helpful closing line when relevant.`;"""

content = re.sub(r'const SYSTEM_PROMPT = `.*?`;', new_prompt, content, flags=re.DOTALL)

# 2. Text Cleaner
cleaner_fn = """
function cleanBotText(text: string): string {
  return text
    // Remove markdown bold (**text**)
    .replace(/\\*\\*(.*?)\\*\\*/g, '$1')
    // Remove markdown italic (*text*)
    .replace(/\\*(.*?)\\*/g, '$1')
    // Remove markdown code blocks
    .replace(/```[\\s\\S]*?```/g, '')
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers (##, ###)
    .replace(/^#{1,6}\\s/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Clean multiple newlines to max 2
    .replace(/\\n{3,}/g, '\\n\\n')
    .trim();
}

function getTime() {"""

content = content.replace('function getTime() {', cleaner_fn)

# Replace usage
content = re.sub(
    r'(const reply =\n\s*data\?\.choices\?\.\[0\]\?\.message\?\.content \|\|\n\s*"I\'m sorry, I couldn\'t process that. Please try again.");',
    r'const rawReply = data?.choices?.[0]?.message?.content || "I\'m sorry, I couldn\'t process that. Please try again.";\n      const reply = cleanBotText(rawReply);',
    content
)

# 3. Chatbot container style
content = content.replace("style={{ height: '540px' }}", "style={{ height: '540px', fontFamily: \"'DM Sans', sans-serif\" }}")
content = content.replace('<div className="text-white font-black text-sm uppercase tracking-widest">HEARBOT</div>', '<div className="text-white font-black text-sm uppercase tracking-widest" style={{ fontFamily: "\'Syne\', sans-serif" }}>HEARBOT</div>')

# 4. Typing indicator header
header_replace = """<div className="flex-1 min-w-0">
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
              </div>"""

content = re.sub(
    r'<div className="flex-1 min-w-0">.*?<div className="text-white/70 text-xs uppercase tracking-wider">ONLINE · HEARWISE AI</div>\s*</div>',
    header_replace,
    content,
    flags=re.DOTALL
)

# 5. Message bubbles
bubble_old = """<div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-black font-semibold rounded-tr-sm'
                          : 'bg-[#111] border border-[#333] text-white rounded-tl-sm'
                      }`}
                      style={{ fontFamily: "'Sika', sans-serif" }}
                    >"""
bubble_new = """<div
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
                    >"""
content = content.replace(bubble_old, bubble_new)

# 6. Floating Chat Bubble Animation
float_old = """<motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="relative w-16 h-16 rounded-full shadow-2xl shadow-teal-500/40 overflow-hidden border-2 border-teal-400/50 bg-[#020817]"
          >"""
float_new = """<motion.button
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
            className="relative w-16 h-16 rounded-full shadow-2xl shadow-teal-500/40 overflow-hidden border-2 border-teal-400/50 bg-[#020817]"
          >"""
content = content.replace(float_old, float_new)

with open(path, 'w') as f:
    f.write(content)
