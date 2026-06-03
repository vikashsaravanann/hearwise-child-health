import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import PageWrapper from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Baby, TrendingUp, School, Target, Telescope, Heart,
  Code, Shield, GraduationCap 
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();
  const { lang } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageWrapper title={t('about', lang)} backPath="/">
      <div className="bg-[#000b1d] min-h-screen text-slate-300 py-12 px-4 md:px-8">
        <motion.div 
          className="max-w-6xl mx-auto space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* SECTION 1 — HERO BANNER */}
          <motion.section variants={itemVariants} className="text-center space-y-6 bg-gradient-to-b from-teal-900/40 to-transparent rounded-3xl p-8 md:p-12 border border-teal-500/20">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {t('aboutHeroTitle', lang)}
            </h1>
            <p className="text-xl text-teal-400 font-medium">
              {t('aboutHeroSub', lang)}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <span className="border border-teal-500/30 bg-teal-500/10 text-teal-300 rounded-full px-4 py-1 text-sm font-medium">
                {t('statMadeInIndia', lang)}
              </span>
              <span className="border border-teal-500/30 bg-teal-500/10 text-teal-300 rounded-full px-4 py-1 text-sm font-medium">
                {t('statGovSchools', lang)}
              </span>
              <span className="border border-teal-500/30 bg-teal-500/10 text-teal-300 rounded-full px-4 py-1 text-sm font-medium">
                {t('statHearingHealth', lang)}
              </span>
            </div>
          </motion.section>

          {/* SECTION 2 — THE PROBLEM WE ARE SOLVING */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">{t('silentCrisisTitle', lang)}</h2>
              <p className="leading-relaxed">{t('silentCrisisPara1', lang)}</p>
              <p className="leading-relaxed">{t('silentCrisisPara2', lang)}</p>
              <p className="leading-relaxed font-semibold text-teal-400">{t('silentCrisisPara3', lang)}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <BarChart className="w-8 h-8 text-teal-400" />
                <div className="text-2xl font-bold text-white">{t('stat63M', lang)}</div>
                <div className="text-sm text-slate-400">{t('stat63MDesc', lang)}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <Baby className="w-8 h-8 text-pink-400" />
                <div className="text-2xl font-bold text-white">{t('stat1in8', lang)}</div>
                <div className="text-sm text-slate-400">{t('stat1in8Desc', lang)}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <div className="text-2xl font-bold text-white">{t('stat90Pct', lang)}</div>
                <div className="text-sm text-slate-400">{t('stat90PctDesc', lang)}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <School className="w-8 h-8 text-amber-400" />
                <div className="text-2xl font-bold text-white">{t('stat0Prog', lang)}</div>
                <div className="text-sm text-slate-400">{t('stat0ProgDesc', lang)}</div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 3 — OUR STORY */}
          <motion.section variants={itemVariants} className="space-y-10">
            <h2 className="text-3xl font-bold text-white text-center">{t('howHearWiseBegan', lang)}</h2>
            <div className="relative border-l border-teal-500/30 ml-4 md:ml-12 space-y-12 pb-4">
              <div className="relative pl-8 md:pl-12">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-bold px-2 py-1 rounded mb-2">2025</span>
                <h3 className="text-xl font-bold text-white mb-3">{t('timelineIdea', lang)}</h3>
                <p className="leading-relaxed">{t('timelineIdeaDesc', lang)}</p>
              </div>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-bold px-2 py-1 rounded mb-2">2025</span>
                <h3 className="text-xl font-bold text-white mb-3">{t('timelinePhase1', lang)}</h3>
                <p className="leading-relaxed">{t('timelinePhase1Desc', lang)}</p>
              </div>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-bold px-2 py-1 rounded mb-2">2026</span>
                <h3 className="text-xl font-bold text-white mb-3">{t('timelinePhase2', lang)}</h3>
                <p className="leading-relaxed">{t('timelinePhase2Desc', lang)}</p>
              </div>
              <div className="relative pl-8 md:pl-12">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-slate-600" />
                <span className="inline-block bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded mb-2">2026–2027</span>
                <h3 className="text-xl font-bold text-white mb-3">{t('timelineWhatsNext', lang)}</h3>
                <p className="leading-relaxed">{t('timelineWhatsNextDesc', lang)}</p>
              </div>
            </div>
          </motion.section>

          {/* SECTION 4 — OUR MISSION, VISION & VALUES */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-900/30 to-slate-800/30 border border-teal-500/20 rounded-3xl p-8 text-center space-y-4">
              <Target className="w-12 h-12 text-teal-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">{t('missionTitle', lang)}</h3>
              <p className="text-sm leading-relaxed">{t('missionText', lang)}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-900/30 to-slate-800/30 border border-teal-500/20 rounded-3xl p-8 text-center space-y-4">
              <Telescope className="w-12 h-12 text-blue-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">{t('visionTitle', lang)}</h3>
              <p className="text-sm leading-relaxed">{t('visionText', lang)}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-900/30 to-slate-800/30 border border-teal-500/20 rounded-3xl p-8 text-center space-y-4">
              <Heart className="w-12 h-12 text-pink-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">{t('valuesTitle', lang)}</h3>
              <p className="text-sm leading-relaxed">{t('valuesText', lang)}</p>
            </div>
          </motion.section>

          {/* SECTION 5 — THE TEAM SPIRIT */}
          <motion.section variants={itemVariants} className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold text-white">{t('builtWithPurpose', lang)}</h2>
              <p className="text-lg">{t('builtWithPurposeSub', lang)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 bg-white/5 p-6 rounded-2xl">
                <Code className="w-8 h-8 text-cyan-400" />
                <h4 className="text-lg font-bold text-white">{t('techCol', lang)}</h4>
                <p className="text-sm">{t('techColDesc', lang)}</p>
              </div>
              <div className="space-y-3 bg-white/5 p-6 rounded-2xl">
                <Shield className="w-8 h-8 text-emerald-400" />
                <h4 className="text-lg font-bold text-white">{t('clinicalCol', lang)}</h4>
                <p className="text-sm">{t('clinicalColDesc', lang)}</p>
              </div>
              <div className="space-y-3 bg-white/5 p-6 rounded-2xl">
                <GraduationCap className="w-8 h-8 text-amber-400" />
                <h4 className="text-lg font-bold text-white">{t('eduCol', lang)}</h4>
                <p className="text-sm">{t('eduColDesc', lang)}</p>
              </div>
            </div>
          </motion.section>

          {/* SECTION 6 — CALL TO ACTION */}
          <motion.section variants={itemVariants} className="text-center space-y-8 pb-12">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold text-white">{t('joinMovement', lang)}</h2>
              <p className="text-lg">{t('joinMovementSub', lang)}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-8" onClick={() => navigate('/onboarding')}>
                {t('registerSchoolBtn', lang)}
              </Button>
              <Button size="lg" variant="outline" className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 rounded-full px-8" onClick={() => navigate('/waitlist')}>
                {t('joinWaitlistBtn', lang)}
              </Button>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
