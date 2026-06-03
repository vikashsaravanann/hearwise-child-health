import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import PageWrapper from '@/components/shared/PageWrapper';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Brain, Volume2, RefreshCw, AlertTriangle, MessageSquare, 
  BookOpen, Users, Briefcase, Smartphone, FileCheck, CheckCircle2,
  Stethoscope
} from 'lucide-react';

export default function HearingHealthPage() {
  const { lang } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageWrapper title={t('hearing_health', lang)} showBack={true} backTo="/">
      <div className="bg-[#000b1d] min-h-screen text-slate-300 py-12 px-4 md:px-8">
        <motion.div 
          className="max-w-5xl mx-auto space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* SECTION 1 — HERO */}
          <motion.section variants={itemVariants} className="text-center space-y-6 bg-gradient-to-b from-teal-900/40 to-[#000b1d] rounded-3xl p-8 md:p-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {t('hearingHealthHeroTitle', lang)}
            </h1>
            <p className="text-xl text-teal-400 font-medium">
              {t('hearingHealthHeroSub', lang)}
            </p>
          </motion.section>

          {/* SECTION 2 — WHAT IS HEARING LOSS? */}
          <motion.section variants={itemVariants} className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white">{t('understandingHearingLoss', lang)}</h2>
              <p className="leading-relaxed">{t('understandingPara1', lang)}</p>
              <p className="leading-relaxed">{t('understandingPara2', lang)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Conductive */}
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 border border-blue-500/20 rounded-2xl p-6 space-y-4">
                <Volume2 className="w-10 h-10 text-blue-400" />
                <h3 className="text-xl font-bold text-white">{t('conductiveLoss', lang)}</h3>
                <p className="text-sm leading-relaxed">{t('conductiveDef', lang)}</p>
                <div className="pt-4 border-t border-blue-500/20 text-blue-300 text-sm font-medium">
                  {t('conductiveFact', lang)}
                </div>
              </div>
              
              {/* Sensorineural */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 border border-purple-500/20 rounded-2xl p-6 space-y-4">
                <Brain className="w-10 h-10 text-purple-400" />
                <h3 className="text-xl font-bold text-white">{t('sensorineuralLoss', lang)}</h3>
                <p className="text-sm leading-relaxed">{t('sensorineuralDef', lang)}</p>
                <div className="pt-4 border-t border-purple-500/20 text-purple-300 text-sm font-medium">
                  {t('sensorineuralFact', lang)}
                </div>
              </div>
              
              {/* Mixed */}
              <div className="bg-gradient-to-br from-teal-900/30 to-slate-800/30 border border-teal-500/20 rounded-2xl p-6 space-y-4">
                <RefreshCw className="w-10 h-10 text-teal-400" />
                <h3 className="text-xl font-bold text-white">{t('mixedLoss', lang)}</h3>
                <p className="text-sm leading-relaxed">{t('mixedDef', lang)}</p>
                <div className="pt-4 border-t border-teal-500/20 text-teal-300 text-sm font-medium">
                  {t('mixedFact', lang)}
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 3 — WARNING SIGNS */}
          <motion.section variants={itemVariants} className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold text-white">{t('warningSignsTitle', lang)}</h2>
              <p className="text-lg text-amber-400">{t('warningSignsSub', lang)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{t('signsBabiesTitle', lang)}</h3>
                <div className="space-y-3">
                  {t('signsBabiesList', lang).split('|').map((sign, i) => (
                    <div key={i} className="flex gap-3 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{t('signsSchoolTitle', lang)}</h3>
                <div className="space-y-3">
                  {t('signsSchoolList', lang).split('|').map((sign, i) => (
                    <div key={i} className="flex gap-3 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 items-start">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 4 — WHY EARLY DETECTION CHANGES EVERYTHING */}
          <motion.section variants={itemVariants} className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">{t('criticalWindowTitle', lang)}</h2>
            </div>
            
            <div className="relative border-l-2 border-teal-500/30 ml-4 md:ml-8 space-y-8 pb-4">
              {[
                { age: t('age0to2', lang), desc: t('age0to2Desc', lang), status: t('age0to2Status', lang), icon: '✅' },
                { age: t('age3to5', lang), desc: t('age3to5Desc', lang), status: t('age3to5Status', lang), icon: '✅' },
                { age: t('age6to10', lang), desc: t('age6to10Desc', lang), status: t('age6to10Status', lang), icon: '✅' },
                { age: t('age11to14', lang), desc: t('age11to14Desc', lang), status: t('age11to14Status', lang), icon: '⚠️' },
                { age: t('age15plus', lang), desc: t('age15plusDesc', lang), status: t('age15plusStatus', lang), icon: '🔴' }
              ].map((item, i) => (
                <div key={i} className="relative pl-8 md:pl-12">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-teal-400" />
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-teal-400">{item.age}</h4>
                      <span className="text-xs bg-black/30 px-2 py-1 rounded border border-white/5">{item.icon} {item.status}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-5 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-teal-400 mx-auto" />
                <h4 className="font-bold text-white">{t('outcomeSpeech', lang)}</h4>
                <p className="text-xs text-slate-400">{t('outcomeSpeechDesc', lang)}</p>
              </div>
              <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-5 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-teal-400 mx-auto" />
                <h4 className="font-bold text-white">{t('outcomeAcademic', lang)}</h4>
                <p className="text-xs text-slate-400">{t('outcomeAcademicDesc', lang)}</p>
              </div>
              <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-5 text-center space-y-2">
                <Users className="w-8 h-8 text-teal-400 mx-auto" />
                <h4 className="font-bold text-white">{t('outcomeSocial', lang)}</h4>
                <p className="text-xs text-slate-400">{t('outcomeSocialDesc', lang)}</p>
              </div>
              <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-5 text-center space-y-2">
                <Briefcase className="w-8 h-8 text-teal-400 mx-auto" />
                <h4 className="font-bold text-white">{t('outcomeFuture', lang)}</h4>
                <p className="text-xs text-slate-400">{t('outcomeFutureDesc', lang)}</p>
              </div>
            </div>
          </motion.section>

          {/* SECTION 5 — THE HEARWISE APPROACH */}
          <motion.section variants={itemVariants} className="space-y-10">
            <h2 className="text-3xl font-bold text-white text-center">{t('approachTitle', lang)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl text-white/5 font-bold">1</div>
                <Smartphone className="w-8 h-8 text-cyan-400 relative z-10" />
                <h4 className="text-lg font-bold text-white relative z-10">{t('step1Title', lang)}</h4>
                <p className="text-sm relative z-10">{t('step1Desc', lang)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl text-white/5 font-bold">2</div>
                <Users className="w-8 h-8 text-emerald-400 relative z-10" />
                <h4 className="text-lg font-bold text-white relative z-10">{t('step2Title', lang)}</h4>
                <p className="text-sm relative z-10">{t('step2Desc', lang)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl text-white/5 font-bold">3</div>
                <Volume2 className="w-8 h-8 text-pink-400 relative z-10" />
                <h4 className="text-lg font-bold text-white relative z-10">{t('step3Title', lang)}</h4>
                <p className="text-sm relative z-10">{t('step3Desc', lang)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden lg:col-start-1 lg:col-span-1 lg:ml-[16.666%]">
                <div className="absolute -right-4 -top-4 text-8xl text-white/5 font-bold">4</div>
                <FileCheck className="w-8 h-8 text-blue-400 relative z-10" />
                <h4 className="text-lg font-bold text-white relative z-10">{t('step4Title', lang)}</h4>
                <p className="text-sm relative z-10">{t('step4Desc', lang)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden lg:col-start-2 lg:col-span-1 lg:ml-[16.666%]">
                <div className="absolute -right-4 -top-4 text-8xl text-white/5 font-bold">5</div>
                <Stethoscope className="w-8 h-8 text-amber-400 relative z-10" />
                <h4 className="text-lg font-bold text-white relative z-10">{t('step5Title', lang)}</h4>
                <p className="text-sm relative z-10">{t('step5Desc', lang)}</p>
              </div>
            </div>
          </motion.section>

          {/* SECTION 6 — FREQUENTLY ASKED QUESTIONS */}
          <motion.section variants={itemVariants} className="space-y-8 pb-12">
            <h2 className="text-3xl font-bold text-white text-center">{t('faqTitle', lang)}</h2>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1" className="border-b-white/10">
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 font-medium">{t('faqQ1', lang)}</AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-base leading-relaxed">
                    {t('faqA1', lang)}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2" className="border-b-white/10">
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 font-medium">{t('faqQ2', lang)}</AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-base leading-relaxed">
                    {t('faqA2', lang)}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3" className="border-b-white/10">
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 font-medium">{t('faqQ3', lang)}</AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-base leading-relaxed">
                    {t('faqA3', lang)}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4" className="border-b-white/10">
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 font-medium">{t('faqQ4', lang)}</AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-base leading-relaxed">
                    {t('faqA4', lang)}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5" className="border-b-white/10">
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 font-medium">{t('faqQ5', lang)}</AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-base leading-relaxed">
                    {t('faqA5', lang)}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-6" className="border-white/10 border-b-0">
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 font-medium">{t('faqQ6', lang)}</AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-base leading-relaxed">
                    {t('faqA6', lang)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.section>

        </motion.div>
      </div>
    </PageWrapper>
  );
}
