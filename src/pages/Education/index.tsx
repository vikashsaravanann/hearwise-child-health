import React from "react";
import PageWrapper from "../../components/shared/PageWrapper";
import { t } from "../../lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ShieldCheck, 
  Activity, 
  Volume2, 
  Headphones, 
  Ear,
  Brain,
  Lightbulb,
  Sparkles,
  Star
} from "lucide-react";
import OceanBackground from "@/components/OceanBackground";

const EducationPage: React.FC = () => {
  const sections = [
    {
      title: "How We Hear",
      icon: <Ear className="w-8 h-8 text-blue-400" />,
      content: "Hearing starts when sound waves reach the outer ear. They travel through the ear canal to the eardrum, making it vibrate. These vibrations pass through three tiny bones in the middle ear to the cochlea, which sends signals to the brain.",
      color: "from-blue-500/20 to-cyan-500/10",
      delay: 0.1
    },
    {
      title: "Noise Awareness",
      icon: <Volume2 className="w-8 h-8 text-red-400" />,
      content: "Sounds above 85 decibels (like a lawnmower or loud music) can damage your hearing over time. We teach children to 'Turn it down' and 'Walk away' from loud noises to protect their ears for life.",
      color: "from-red-500/20 to-orange-500/10",
      delay: 0.2
    },
    {
      title: "Why Screening Matters",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      content: "Many children don't realize they have a hearing problem because they've always heard that way. Early screening helps identify issues early, ensuring they don't fall behind in school or social activities.",
      color: "from-emerald-500/20 to-teal-500/10",
      delay: 0.3
    },
    {
      title: "Smart Headphone Use",
      icon: <Headphones className="w-8 h-8 text-purple-400" />,
      content: "When using headphones, follow the 60/60 rule: keep the volume below 60% and listen for no more than 60 minutes at a time. This simple habit can prevent noise-induced hearing loss.",
      color: "from-purple-500/20 to-pink-500/10",
      delay: 0.4
    },
    {
      title: "Brain Connection",
      icon: <Brain className="w-8 h-8 text-indigo-400" />,
      content: "Hearing isn't just about the ears—it's about the brain. Clear hearing allows the brain to process speech, enjoy music, and stay alert to the environment around us.",
      color: "from-indigo-500/20 to-blue-500/10",
      delay: 0.5
    },
    {
      title: "Fun Facts",
      icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
      content: "Did you know that the smallest bone in your body is in your ear? Or that your ears never stop hearing, even when you're asleep? Your brain just learns to ignore the sounds!",
      color: "from-yellow-500/20 to-orange-500/10",
      delay: 0.6
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-sm">
        <OceanBackground />
      </div>
      
      <PageWrapper 
        title={t("pages.education.title", "Educational Resources")}
        subtitle="Learning to protect your world of sound"
      >
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-400/20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              >
                {i % 2 === 0 ? <Sparkles size={20 + Math.random() * 30} /> : <Star size={15 + Math.random() * 20} />}
              </motion.div>
            ))}
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/10 border-2 border-blue-500/30 text-blue-300 text-sm font-black mb-6 shadow-lg shadow-blue-500/10"
            >
              <BookOpen className="w-5 h-5" />
              Learning Hub
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-blue-900 mb-6 leading-tight tracking-tight"
            >
              Discover the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Magic of Sound
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-800/60 text-xl max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Join us on an underwater adventure to learn how your ears work and how to keep them safe while having fun!
            </motion.p>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-8 mb-20">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: section.delay, duration: 0.5 }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.2)"
                }}
                className={`p-10 rounded-[3rem] bg-gradient-to-br ${section.color} border-4 border-white/60 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center group transition-all`}
              >
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className="p-5 sm:p-6 rounded-3xl bg-white/50 mb-8 border-2 border-white group-hover:bg-white transition-colors"
                >
                  {section.icon}
                </motion.div>
                <h3 className="text-2xl font-black text-blue-900 mb-4 tracking-tight">{section.title}</h3>
                <p className="text-blue-800/70 leading-relaxed font-bold">
                  {section.content}
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-1.5 rounded-full bg-blue-500/30" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-gradient-to-br from-blue-600 to-cyan-600 border-4 border-white/40 shadow-3xl text-center relative overflow-hidden"
          >
            {/* CTA Background Anim */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
               {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                      width: Math.random() * 100,
                      height: Math.random() * 100,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 4,
                      repeat: Infinity,
                    }}
                  />
               ))}
            </div>

            <div className="relative z-10">
              <Activity className="w-20 h-20 text-white mx-auto mb-8 animate-pulse" />
              <h3 className="text-3xl sm:text-4xl md:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Test Your Ears?</h3>
              <p className="text-white/80 text-xl max-w-2xl mx-auto mb-12 font-bold leading-relaxed">
                Take the Hearing Hero challenge today and discover your underwater superpowers!
              </p>
              <div className="flex flex-wrap justify-center gap-5 sm:p-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-[2rem] bg-white text-blue-600 text-xl font-black shadow-2xl hover:bg-blue-50 transition-all"
                >
                  Start Game
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-[2rem] bg-blue-700/30 text-white text-xl font-black border-2 border-white/40 backdrop-blur-md transition-all"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default EducationPage;

