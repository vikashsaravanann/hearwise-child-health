import React from 'react';
import { useImpactStats } from '@/hooks/useImpactStats';
import StatCounter from '@/components/StatCounter';
import { motion } from 'framer-motion';

export default function ImpactSection() {
  const { stats, loading } = useImpactStats();

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Our Impact — Growing Every Day
          </h2>
          <p className="text-lg text-slate-400">
            Real numbers, updated live from every school using HearWise
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <StatCounter
              value={loading ? 0 : stats.childrenScreened}
              label="Children Screened"
              icon="👂"
              suffix="+"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <StatCounter
              value={loading ? 0 : stats.schoolsOnboarded}
              label="Schools Onboarded"
              icon="🏫"
              suffix="+"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <StatCounter
              value={loading ? 0 : stats.hearingIssuesDetected}
              label="Hearing Issues Detected"
              icon="⚠️"
              suffix="+"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <StatCounter
              value={loading ? 0 : stats.statesCovered}
              label="States Covered"
              icon="🇮🇳"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
