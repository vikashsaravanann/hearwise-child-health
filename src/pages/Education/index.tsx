import React from "react";
import PageWrapper from "../../components/shared/PageWrapper";
import { t } from "../../lib/i18n";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  ShieldCheck, 
  Activity, 
  Volume2, 
  Headphones, 
  Ear,
  Brain,
  Lightbulb
} from "lucide-react";

const EducationPage: React.FC = () => {
  const sections = [
    {
      title: "How We Hear",
      icon: <Ear className="w-8 h-8 text-blue-400" />,
      content: "Hearing starts when sound waves reach the outer ear. They travel through the ear canal to the eardrum, making it vibrate. These vibrations pass through three tiny bones in the middle ear to the cochlea, which sends signals to the brain.",
      color: "from-blue-500/20 to-cyan-500/10"
    },
    {
      title: "Noise Awareness",
      icon: <Volume2 className="w-8 h-8 text-red-400" />,
      content: "Sounds above 85 decibels (like a lawnmower or loud music) can damage your hearing over time. We teach children to 'Turn it down' and 'Walk away' from loud noises to protect their ears for life.",
      color: "from-red-500/20 to-orange-500/10"
    },
    {
      title: "Why Screening Matters",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      content: "Many children don't realize they have a hearing problem because they've always heard that way. Early screening helps identify issues early, ensuring they don't fall behind in school or social activities.",
      color: "from-emerald-500/20 to-teal-500/10"
    },
    {
      title: "Smart Headphone Use",
      icon: <Headphones className="w-8 h-8 text-purple-400" />,
      content: "When using headphones, follow the 60/60 rule: keep the volume below 60% and listen for no more than 60 minutes at a time. This simple habit can prevent noise-induced hearing loss.",
      color: "from-purple-500/20 to-pink-500/10"
    },
    {
      title: "Brain Connection",
      icon: <Brain className="w-8 h-8 text-indigo-400" />,
      content: "Hearing isn't just about the ears—it's about the brain. Clear hearing allows the brain to process speech, enjoy music, and stay alert to the environment around us.",
      color: "from-indigo-500/20 to-blue-500/10"
    },
    {
      title: "Fun Facts",
      icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
      content: "Did you know that the smallest bone in your body is in your ear? Or that your ears never stop hearing, even when you're asleep? Your brain just learns to ignore the sounds!",
      color: "from-yellow-500/20 to-orange-500/10"
    }
  ];

  return (
    <PageWrapper 
      title={t("pages.education.title", "Educational Resources")}
      subtitle="Learning to protect your world of sound"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-bold mb-6"
          >
            <BookOpen className="w-4 h-4" />
            Awareness Hub
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Sound Knowledge for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Healthier Hearing
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
            Explore our curated resources designed to help students, teachers, and parents understand the importance of hearing health and early detection.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${section.color} border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-start`}
            >
              <div className="p-4 rounded-2xl bg-white/10 mb-6">
                {section.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-4">{section.title}</h3>
              <p className="text-white/70 leading-relaxed text-sm">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 rounded-[3.5rem] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-white/10 backdrop-blur-xl text-center"
        >
          <Activity className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h3 className="text-3xl font-black text-white mb-4">Start Your Screening Today</h3>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Don't wait for symptoms. Regular screening is the best way to ensure every child has the hearing support they need to succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#000b1d] font-bold transition-all active:scale-95">
              Begin Session
            </button>
            <button className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 transition-all active:scale-95">
              Download Resources
            </button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default EducationPage;
