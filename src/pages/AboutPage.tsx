import BackButton from '../components/BackButton';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#020817] relative overflow-hidden">
      <BackButton />
      {/* Animated gradient orbs — same as homepage */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-600/6 rounded-full blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }} />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Glowing badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            INDIA'S FIRST SCHOOL HEARING SCREENING STARTUP
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            ABOUT{' '}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              HEARWISE
            </span>
            <br />TECHNOLOGIES
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            We are on a mission to ensure no child in India misses out on learning
            because of an undetected hearing problem. HearWise makes professional-grade
            hearing screening accessible to every school — with just a smartphone and headphones.
          </p>

          {/* Animated stat strip */}
          <div className="flex flex-wrap justify-center gap-5 sm:p-6 md:gap-12">
            {[
              { value: '300M+', label: 'CHILDREN IN INDIA', color: 'text-teal-400' },
              { value: '6%', label: 'HAVE HEARING ISSUES', color: 'text-cyan-400' },
              { value: '90%', label: 'CASES UNDETECTED', color: 'text-blue-400' },
              { value: '50+', label: 'CHILDREN/HOUR SCREENED', color: 'text-emerald-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className={`text-2xl sm:text-3xl md:text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-slate-500 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-3xl sm:text-4xl font-black text-white uppercase tracking-wider">
            OUR <span className="text-teal-400">FOUNDATION</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm uppercase tracking-widest">WHAT DRIVES US EVERY DAY</p>
        </motion.div>

        <div className="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-6">
          {[
            {
              icon: '🎯',
              title: 'OUR MISSION',
              desc: 'To detect hearing loss in every Indian child before it silently robs them of their education, communication, and confidence. We screen early, we screen fast, we screen everywhere.',
              color: 'border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10',
              glow: 'group-hover:shadow-teal-500/20',
            },
            {
              icon: '🔭',
              title: 'OUR VISION',
              desc: 'A future where every school in India has access to professional-grade hearing screening technology — at zero cost to students and teachers. No child left behind, no hearing issue undetected.',
              color: 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10',
              glow: 'group-hover:shadow-cyan-500/20',
            },
            {
              icon: '⚡',
              title: 'OUR VALUES',
              desc: 'Accessibility over exclusivity. Speed over complexity. Children first, always. We build technology that works in a village school in Tamil Nadu with the same reliability as a city hospital.',
              color: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10',
              glow: 'group-hover:shadow-blue-500/20',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`group relative rounded-2xl border p-6 sm:p-8 transition-all duration-300 cursor-default shadow-lg ${card.color} ${card.glow}`}
            >
              <div className="text-3xl sm:text-4xl mb-4">{card.icon}</div>
              <h3 className="text-white font-black text-lg uppercase tracking-widest mb-3">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 md:p-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-1 sm:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-widest mb-6">
                ⚠ THE CRISIS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-3xl sm:text-4xl font-black text-white uppercase leading-tight mb-6">
                MILLIONS OF CHILDREN ARE
                <span className="text-red-400"> STRUGGLING IN SILENCE</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                In India, over 18 million children suffer from some form of hearing impairment.
                Most are never diagnosed before age 10. Their teachers think they are inattentive.
                Their parents think they are slow learners. The real cause — undetected hearing loss —
                is never found.
              </p>
              <p className="text-slate-400 text-base leading-relaxed">
                Traditional audiological testing costs ₹2,000–₹5,000 per child and requires
                specialist equipment found only in city hospitals. For schools in rural Tamil Nadu,
                Rajasthan, Bihar, or Assam — this is simply not available. HearWise changes that.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { num: '18M+', text: 'children with hearing impairment in India', color: 'text-red-400' },
                { num: '₹0', text: 'cost for schools to screen with HearWise', color: 'text-teal-400' },
                { num: '7 yrs', text: 'average age hearing loss is finally detected', color: 'text-orange-400' },
                { num: '3 min', text: 'time HearWise takes to screen one child', color: 'text-cyan-400' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
                >
                  <div className={`text-2xl font-black mb-2 ${item.color}`}>{item.num}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{item.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto text-center" id="about-video-container">
        <VideoCard
          title="WHY EARLY DETECTION CHANGES A CHILD'S LIFE"
          description="Real stories and science behind why detecting hearing loss before age 5 leads to a 90% better outcome in language development and education."
          duration="4:00 MIN"
          category="IMPACT STORY"
          icon="❤️"
          gradientFrom="#0d4f0d"
          gradientTo="#0d4f6e"
          stats={[{ label: 'BETTER OUTCOME', value: '90%' }, { label: 'IDEAL AGE', value: '<5 YRS' }, { label: 'IMPACT', value: 'LIFELONG' }]}
        />
      </section>

      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mb-4">
            HOW <span className="text-teal-400">HEARWISE</span> WAS BORN
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto mb-8 rounded-full" />
          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6">
            HearWise Technologies was founded in Chennai, Tamil Nadu, by a team who witnessed firsthand
            how hearing problems silently destroyed a child's academic and social life. After speaking
            with over 50 school teachers and 20 audiologists across Tamil Nadu, we discovered the same
            story everywhere — hearing loss was present, but the tools to detect it simply weren't.
          </p>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6">
            We spent months studying how professional audiological tests work and recreated the core
            science — pure tone audiometry — using the Web Audio API, calibrated headphone frequencies,
            and stereo channel isolation. The result is a test that a school teacher with zero medical
            training can administer to 50 children in a single afternoon.
          </p>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Today, HearWise is a startup with one goal: reach every school in India.
            We are building in the open, learning fast, and shipping every week.
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
            OUR <span className="text-teal-400">JOURNEY</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-cyan-500/30 to-transparent" />

          {[
            { date: '2024', title: 'IDEA BORN', desc: 'Problem identified after speaking with 50+ Tamil Nadu school teachers. Zero accessible screening tools existed for rural schools.', side: 'left' },
            { date: 'Q1 2025', title: 'RESEARCH & VALIDATION', desc: 'Studied pure tone audiometry. Validated Web Audio API for hearing frequency testing. Collaborated with 3 audiologists in Chennai for calibration.', side: 'right' },
            { date: 'Q2 2025', title: 'PLATFORM BUILT', desc: 'First version of HearWise launched. Nature-sound hearing test with 5 levels per ear, Tamil/English language toggle, teacher dashboard.', side: 'left' },
            { date: 'Q3 2025', title: 'FEATURES EXPANDED', desc: 'Admin dashboard, HearBot AI, Learning Hub, Features page, PWA offline mode, school onboarding form, parent PDF reports — all added.', side: 'right' },
            { date: '2026+', title: 'NATIONAL EXPANSION', desc: 'Target: 10,000 schools across India. Hindi language. Audiologist referral network. Government school partnerships. Series A fundraising.', side: 'left' },
          ].map((item, i) => (
            <motion.div
              key={item.date}
              initial={{ opacity: 0, x: item.side === 'left' ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-center mb-12 ${item.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="w-1/2 px-8">
                <div className={`rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 sm:p-6 hover:bg-teal-500/10 transition-all ${item.side === 'right' ? 'text-right' : ''}`}>
                  <div className="text-teal-400 text-xs font-black uppercase tracking-widest mb-2">{item.date}</div>
                  <div className="text-white font-black text-sm uppercase mb-2">{item.title}</div>
                  <div className="text-slate-400 text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
              {/* Centre dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-teal-400 border-2 border-teal-200 shadow-lg shadow-teal-400/50" />
              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
            THE <span className="text-teal-400">TEAM</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 p-10 text-center"
        >
          {/* Owl avatar placeholder */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-6 shadow-xl shadow-teal-500/30">
            🦉
          </div>
          <h3 className="text-2xl font-black text-white uppercase">VIKASH SARAVANAN</h3>
          <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mt-1 mb-4">FOUNDER & CEO — HEARWISE TECHNOLOGIES</p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            A young Indian entrepreneur from Tamil Nadu building technology to solve one of India's most
            overlooked health crises — childhood hearing loss. Vikash leads product, engineering, and
            partnerships at HearWise with a vision to reach 10 million children across India by 2030.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <a href="https://github.com/vikashsaravanann" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-widest hover:bg-teal-500/10 transition-all">
              GitHub
            </a>
            <span className="px-4 py-2 rounded-full border border-slate-700 text-slate-400 text-xs font-semibold uppercase tracking-widest">
              Chennai, Tamil Nadu 🇮🇳
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
