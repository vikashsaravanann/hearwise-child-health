import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import FadeInSection from '@/components/FadeInSection';
import { Activity, Ear, Headphones, AlertTriangle, CheckCircle2, ShieldCheck, Gamepad2, Hospital, IndianRupee, Clock, Zap } from 'lucide-react';

export default function HearingHealthPage() {
  return (
    <PageWrapper title="HearWise Health Operations" showBack={true} backTo="/">
      <div className="min-h-screen bg-slate-50 pb-20">
        
        {/* Section 1: Hero */}
        <FadeInSection delay={0.1}>
          <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 py-24 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-['Syne'] tracking-tight">
                HearWise Health Operations
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
                Comprehensive Hearing Care and Assessment Protocol for pediatric screening.
              </p>
            </div>
          </div>
        </FadeInSection>

        <div className="max-w-6xl mx-auto px-6 space-y-24 mt-16">
          
          {/* Section 2: Hearing Loss Info Cards */}
          <FadeInSection delay={0.2}>
            <div className="text-center mb-12">
              <h2 className="hw-section-title">Types of Hearing Loss</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="hw-card hw-card-accent-blue">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Ear size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Syne']">Conductive</h3>
                </div>
                <p className="text-slate-600">
                  Occurs when sound waves cannot travel efficiently through the outer ear canal to the eardrum and the tiny bones of the middle ear. Often temporary and medically treatable.
                </p>
              </div>
              <div className="hw-card hw-card-accent-teal">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-teal-100 text-teal-600 rounded-xl"><Activity size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Syne']">Sensorineural</h3>
                </div>
                <p className="text-slate-600">
                  Occurs when there is damage to the inner ear (cochlea) or to the nerve pathways from the inner ear to the brain. Typically permanent and requires hearing aids or cochlear implants.
                </p>
              </div>
              <div className="hw-card hw-card-accent-amber">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Headphones size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Syne']">Mixed</h3>
                </div>
                <p className="text-slate-600">
                  A combination of both conductive and sensorineural hearing loss. There is damage in the outer or middle ear and in the inner ear or auditory nerve.
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* Section 3: Process Flow Stepper */}
          <FadeInSection delay={0.3}>
            <div className="text-center mb-12">
              <h2 className="hw-section-title">Screening Protocol</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="hw-step">
                <div className="hw-step-number">1</div>
                <div>
                  <h4 className="font-bold text-slate-900">Gamified Tone Check</h4>
                  <p className="text-slate-600 text-sm">Initial environment check and basic tone response calibration.</p>
                </div>
              </div>
              <div className="hw-step">
                <div className="hw-step-number">2</div>
                <div>
                  <h4 className="font-bold text-slate-900">Threshold Mapping</h4>
                  <p className="text-slate-600 text-sm">Systematic testing across multiple frequencies (500Hz to 8000Hz) at varying decibels.</p>
                </div>
              </div>
              <div className="hw-step">
                <div className="hw-step-number">3</div>
                <div>
                  <h4 className="font-bold text-slate-900">Ocean Adventure Play</h4>
                  <p className="text-slate-600 text-sm">Interactive interface keeps children engaged, ensuring accurate audiometric responses.</p>
                </div>
              </div>
              <div className="hw-step">
                <div className="hw-step-number">4</div>
                <div>
                  <h4 className="font-bold text-slate-900">Instant Report Generation</h4>
                  <p className="text-slate-600 text-sm">Automated analysis of results against WHO pediatric standards.</p>
                </div>
              </div>
              <div className="hw-step">
                <div className="hw-step-number">5</div>
                <div>
                  <h4 className="font-bold text-slate-900">Expert Referral Pipeline</h4>
                  <p className="text-slate-600 text-sm">Direct connection to specialized audiologists for flagged cases.</p>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Section 4: Warning Signs Checklist */}
          <FadeInSection delay={0.4}>
            <div className="hw-card bg-indigo-50 border-indigo-100">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <AlertTriangle className="text-amber-500" size={32} />
                <h2 className="hw-section-title !mb-0">Warning Signs</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  "Turns TV or device volume too high",
                  "Frequently asks others to repeat ('what?')",
                  "Misunderstands questions or directions",
                  "Delayed speech and language development",
                  "Watches faces intently when listening",
                  "Complains of ear pain, noises, or ringing",
                  "Speaks differently than peers",
                  "Struggles academically despite effort"
                ].map((sign, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <CheckCircle2 className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700 font-medium">{sign}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Section 5: Benefits of Early Detection */}
          <FadeInSection delay={0.5}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6 font-['Syne']">The Power of Early Detection</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Catching hearing loss early isn't just about restoring sound; it's about unlocking a child's full potential. Early intervention directly correlates with significantly improved outcomes in crucial developmental areas.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <ShieldCheck className="text-teal-600" size={24} /> Accelerated Speech & Language Development
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <ShieldCheck className="text-teal-600" size={24} /> Enhanced Academic Performance
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <ShieldCheck className="text-teal-600" size={24} /> Better Social & Emotional Integration
                  </li>
                </ul>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 bg-slate-200">
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop" alt="Happy child" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-indigo-900/20 mix-blend-multiply"></div>
              </div>
            </div>
          </FadeInSection>

          {/* Section 6: Feature Comparison Table */}
          <FadeInSection delay={0.6}>
            <div className="text-center mb-12">
              <h2 className="hw-section-title">Why HearWise?</h2>
            </div>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-6 font-semibold text-slate-500 w-1/3">Feature</th>
                    <th className="p-6 font-bold text-indigo-700 w-1/3 bg-indigo-50/50">HearWise Platform</th>
                    <th className="p-6 font-semibold text-slate-500 w-1/3">Traditional Audiometry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-6 text-slate-600 font-medium">Experience</td>
                    <td className="p-6 bg-indigo-50/30 text-slate-900 font-bold flex items-center gap-2"><Gamepad2 size={18} className="text-indigo-600" /> Gamified & Engaging</td>
                    <td className="p-6 text-slate-500 flex items-center gap-2"><Hospital size={18} /> Clinical & Intimidating</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-600 font-medium">Accessibility</td>
                    <td className="p-6 bg-indigo-50/30 text-slate-900 font-bold flex items-center gap-2"><Zap size={18} className="text-indigo-600" /> Mobile & Anywhere</td>
                    <td className="p-6 text-slate-500 flex items-center gap-2"><Hospital size={18} /> Requires Hospital Visit</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-600 font-medium">Speed</td>
                    <td className="p-6 bg-indigo-50/30 text-slate-900 font-bold flex items-center gap-2"><Clock size={18} className="text-indigo-600" /> Instant Results</td>
                    <td className="p-6 text-slate-500 flex items-center gap-2"><Clock size={18} /> Slow Scheduling</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-600 font-medium">Cost</td>
                    <td className="p-6 bg-indigo-50/30 text-slate-900 font-bold flex items-center gap-2"><IndianRupee size={18} className="text-indigo-600" /> Free for Schools</td>
                    <td className="p-6 text-slate-500 flex items-center gap-2"><IndianRupee size={18} /> Highly Expensive</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeInSection>

        </div>
      </div>
    </PageWrapper>
  );
}
