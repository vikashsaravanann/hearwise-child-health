import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Mrs. Kavitha Ramalingam",
    role: "School Teacher, Govt. Higher Secondary School, Coimbatore",
    avatar: "👩‍🏫",
    quote: "I was nervous at first — I am not a doctor. But the app guided me through every step. I screened 28 children in one afternoon. Three were referred to an audiologist. I am so glad we caught it early."
  },
  {
    id: 2,
    name: "Dr. S. Anandakumar",
    role: "Audiologist, Coimbatore ENT Centre",
    avatar: "👨‍⚕️",
    quote: "HearWise is doing what the public health system has not been able to do at scale — getting hearing screening into schools. The referrals we receive from HearWise are well-documented and clinically useful. Excellent initiative."
  },
  {
    id: 3,
    name: "Mr. Rajan Krishnaswamy",
    role: "School Principal, Aided Middle School, Tiruppur",
    avatar: "👨‍💼",
    quote: "We never had a hearing screening programme in 40 years. HearWise set us up in one day. The children actually enjoyed the test — they thought the bird sounds were funny. Simple, professional, and life-changing."
  },
  {
    id: 4,
    name: "Priya M.",
    role: "Parent, Chennai",
    avatar: "👩",
    quote: "My daughter was referred after the HearWise screening at her school. We visited an audiologist and discovered she had mild hearing loss in her left ear. She now has a hearing aid. Her grades have improved dramatically. Thank you HearWise."
  },
  {
    id: 5,
    name: "Mrs. Suganthi Velmurugan",
    role: "Health Education Officer, Tamil Nadu",
    avatar: "👩‍💼",
    quote: "This is exactly the kind of low-cost, high-impact solution Tamil Nadu's schools need. The bilingual Tamil support is outstanding — teachers in rural areas feel confident using it in their own language."
  },
  {
    id: 6,
    name: "Mr. Deepak Nair",
    role: "Special Educator, Madurai",
    avatar: "👨‍🏫",
    quote: "I have worked with children with learning difficulties for 12 years. So many of them had undetected hearing issues. HearWise is the tool I always wished existed. Every school in India needs this."
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl font-black text-white mb-4">Trusted by Educators & Experts</h2>
        <p className="text-white/60 max-w-2xl mx-auto">See how HearWise is making a difference in communities across Tamil Nadu.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Mobile: Horizontal scroll, Desktop: 3-column grid */}
        <div className="flex overflow-x-auto pb-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible gap-6 snap-x snap-mandatory">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 min-w-[85vw] md:min-w-0 snap-center flex flex-col justify-between"
            >
              <div>
                <div className="flex text-yellow-400 mb-4 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="text-slate-300 leading-relaxed text-sm mb-6">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-900/50 flex items-center justify-center text-2xl border border-teal-500/30">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-teal-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-white/10 text-center">
          <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest font-bold">Designed with guidance from</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <span className="px-4 py-2 bg-slate-800/50 text-slate-400 rounded-full border border-slate-700 text-sm font-medium">🏥 Indian Audiology Standards</span>
            <span className="px-4 py-2 bg-slate-800/50 text-slate-400 rounded-full border border-slate-700 text-sm font-medium">📚 Tamil Nadu Education Dept.</span>
            <span className="px-4 py-2 bg-slate-800/50 text-slate-400 rounded-full border border-slate-700 text-sm font-medium">🔬 WHO Hearing Loss Guidelines</span>
            <span className="px-4 py-2 bg-slate-800/50 text-slate-400 rounded-full border border-slate-700 text-sm font-medium">💻 React + Supabase Platform</span>
          </div>
        </div>
      </div>
    </section>
  );
}
