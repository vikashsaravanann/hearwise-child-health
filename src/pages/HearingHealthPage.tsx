import BackButton from '../components/BackButton';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';

export default function HearingHealthPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#020817] relative overflow-hidden">
      <BackButton />
      {/* Animated gradient orbs */}
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

      <section className="relative pt-28 pb-16 px-6 text-center z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            COMPLETE HEARING HEALTH RESOURCE
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            HEARWISE{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              HEALTH
            </span>
            <br />OPERATIONS
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Everything you need to understand childhood hearing health — from what hearing loss is,
            to how HearWise's test works, to what to do when a child fails the screening.
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto text-center" id="health-video-container">
        <VideoCard
          title="WHAT IS CHILDHOOD HEARING LOSS? — EXPLAINED SIMPLY"
          description="A clear, parent-friendly explanation of what hearing loss is, why it happens in children, and why early detection changes everything."
          duration="2:45 MIN"
          category="HEALTH EDUCATION"
          icon="🧠"
          gradientFrom="#4a0d20"
          gradientTo="#0d2a5e"
          stats={[{ label: 'TYPES', value: '3' }, { label: 'CHILDREN AFFECTED', value: '18M+' }, { label: 'DETECTION AGE', value: '7 YRS' }]}
        />
      </section>

      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            TYPES OF <span className="text-cyan-400">HEARING LOSS</span>
          </h2>
          <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">KNOW WHAT YOU ARE SCREENING FOR</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              type: 'CONDUCTIVE', icon: '👂',
              color: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10',
              badge: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
              desc: 'Caused by problems in the outer or middle ear — earwax blockage, fluid behind the eardrum, ear infections, or perforated eardrum. Often treatable.',
              signs: ['Muffled speech', 'Ear pain or pressure', 'Asking to repeat often', 'Speaking louder than normal'],
              treatable: 'OFTEN TREATABLE',
            },
            {
              type: 'SENSORINEURAL', icon: '🧠',
              color: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10',
              badge: 'text-red-400 border-red-500/30 bg-red-500/10',
              desc: 'Caused by damage to the inner ear (cochlea) or auditory nerve. This is permanent. Early detection is critical to manage it with hearing aids before school age.',
              signs: ['Cannot hear high-pitched sounds', 'Difficulty hearing in noise', 'Ringing or buzzing', 'Balance issues'],
              treatable: 'PERMANENT — NEEDS AID',
            },
            {
              type: 'MIXED', icon: '🔀',
              color: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10',
              badge: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
              desc: 'A combination of both conductive and sensorineural loss. Requires a full audiological evaluation to determine the extent of each component.',
              signs: ['All conductive signs', 'All sensorineural signs', 'Affects both ears unevenly', 'Severe overall impact'],
              treatable: 'PARTIAL TREATMENT',
            },
          ].map((card, i) => (
            <motion.div
              key={card.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className={`rounded-2xl border p-8 transition-all duration-300 ${card.color}`}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <div className={`inline-block px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest mb-4 ${card.badge}`}>
                {card.treatable}
              </div>
              <h3 className="text-white font-black text-xl uppercase tracking-wider mb-3">{card.type}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{card.desc}</p>
              <div className="space-y-2">
                {card.signs.map(s => (
                  <div key={s} className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
              ⚠ WARNING SIGNS IN <span className="text-orange-400">CHILDREN</span>
            </h2>
            <p className="text-slate-400 text-sm mb-8 uppercase tracking-widest">IF A CHILD SHOWS THESE SIGNS, SCREEN THEM IMMEDIATELY</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Does not respond when called by name from behind',
                'Frequently asks "What?" or "Can you repeat that?"',
                'Turns the TV or phone volume unusually high',
                'Speaks louder than other children of the same age',
                'Misunderstands instructions or appears inattentive',
                'Delayed speech development compared to peers',
                'Complains of ringing, buzzing, or sounds in the ear',
                'Performs better when facing the teacher directly',
                'Struggles to hear in noisy classroom environments',
                'Becomes withdrawn, frustrated, or avoids group activities',
              ].map((sign, i) => (
                <motion.div
                  key={sign}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <span className="text-orange-400 font-black text-sm mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-slate-300 text-sm leading-relaxed">{sign}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            HOW THE <span className="text-teal-400">HEARWISE TEST</span> WORKS
          </h2>
        </motion.div>
        <div className="space-y-4">
          {[
            { step: '01', title: 'REGISTER THE CHILD', desc: 'Teacher enters the child\'s name, age, class, school and ear being tested. Takes 20 seconds.', icon: '📋' },
            { step: '02', title: 'PUT ON THE HEADPHONES', desc: 'The child wears standard 3.5mm stereo headphones. No specialist equipment needed — any school can do this.', icon: '🎧' },
            { step: '03', title: 'LISTEN TO NATURE SOUNDS', desc: 'HearWise plays ocean waves, bird calls, water drops, and wind chimes — child-friendly sounds across 5 frequency levels per ear.', icon: '🌊' },
            { step: '04', title: 'TEACHER RECORDS RESPONSE', desc: 'Teacher taps Pass or Fail for each level as the child responds. Left ear tested first (5 levels), then right ear (5 levels).', icon: '✅' },
            { step: '05', title: 'RESULT + REFERRAL', desc: 'Instant pass/fail result generated. Failed tests trigger automatic referral to a nearby audiologist. PDF report created for parents.', icon: '📊' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 p-6 rounded-2xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition-all"
            >
              <div className="text-3xl w-12 flex-shrink-0 text-center">{item.icon}</div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                {item.step}
              </div>
              <div>
                <div className="text-white font-black text-sm uppercase tracking-wider mb-1">{item.title}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            HEARWISE VS <span className="text-red-400">TRADITIONAL</span> SCREENING
          </h2>
        </motion.div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-5 text-slate-400 text-xs uppercase tracking-widest font-semibold">CRITERIA</th>
                <th className="text-center p-5 text-teal-400 text-xs uppercase tracking-widest font-black">HEARWISE ✓</th>
                <th className="text-center p-5 text-red-400 text-xs uppercase tracking-widest font-semibold">TRADITIONAL ✗</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Cost per child', '₹0 (Free)', '₹2,000 – ₹5,000'],
                ['Equipment needed', 'Any smartphone + headphones', 'Audiometer (₹50,000+)'],
                ['Who can conduct', 'Any school teacher', 'Trained audiologist only'],
                ['Time per child', '3 minutes', '45–60 minutes'],
                ['Location', 'Any school, any village', 'Hospital or clinic only'],
                ['Result availability', 'Instant', '2–7 days'],
                ['Language support', 'English + Tamil + Hindi', 'English only'],
                ['Works offline', 'Yes (PWA)', 'No'],
                ['Report for parents', 'Automatic PDF', 'Manual, extra cost'],
              ].map(([criteria, hearwise, traditional], i) => (
                <tr key={criteria} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''} hover:bg-teal-500/5 transition-colors`}>
                  <td className="p-5 text-slate-300 text-sm font-medium">{criteria}</td>
                  <td className="p-5 text-center text-teal-300 text-sm font-semibold">{hearwise}</td>
                  <td className="p-5 text-center text-slate-500 text-sm">{traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
