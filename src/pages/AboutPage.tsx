import React from 'react';
import PageWrapper from '@/components/shared/PageWrapper';
import FadeInSection from '@/components/FadeInSection';
import { Target, Lightbulb, Users, Globe2, Heart, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageWrapper title="About HearWise Technologies" showBack={true} backTo="/">
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Section 1: Hero Banner */}
        <FadeInSection delay={0.1}>
          <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 py-24 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-['Syne'] tracking-tight">
                About HearWise Technologies
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Revolutionizing pediatric audiology in India through accessible, mobile-based hearing screening for every child.
              </p>
            </div>
          </div>
        </FadeInSection>

        <div className="max-w-6xl mx-auto px-6 space-y-24 mt-16">
          
          {/* Section 2: Mission & Vision */}
          <FadeInSection delay={0.2}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="hw-card hw-card-accent-blue">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-['Syne']">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  To democratize early hearing screening by transforming standard smartphones into powerful audiological tools, ensuring no child's hearing loss goes undetected due to a lack of resources or accessibility.
                </p>
              </div>
              
              <div className="hw-card hw-card-accent-teal">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                  <Lightbulb size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-['Syne']">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  A world where every school-going child has access to early, accurate, and engaging hearing assessments, empowering them to reach their full potential without the barrier of untreated hearing loss.
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* Section 3: The Problem We Solve */}
          <FadeInSection delay={0.3}>
            <div className="text-center mb-12">
              <h2 className="hw-section-title">The Problem We Solve</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="hw-card text-center p-8">
                <div className="hw-stat-counter mb-2">60%</div>
                <div className="text-slate-700 font-medium text-lg">of childhood hearing loss is preventable</div>
              </div>
              <div className="hw-card text-center p-8">
                <div className="hw-stat-counter mb-2">1 in 1000</div>
                <div className="text-slate-700 font-medium text-lg">infants are born with hearing loss globally</div>
              </div>
              <div className="hw-card text-center p-8">
                <div className="hw-stat-counter mb-2">34M</div>
                <div className="text-slate-700 font-medium text-lg">children worldwide require rehabilitation</div>
              </div>
            </div>
          </FadeInSection>

          {/* Section 4: Timeline */}
          <FadeInSection delay={0.4}>
            <div className="text-center mb-12">
              <h2 className="hw-section-title">Our Journey</h2>
            </div>
            <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-1/2 space-y-12 pb-8">
              <div className="relative pl-8">
                <div className="absolute left-[-7px] top-1 hw-timeline-dot"></div>
                <h4 className="text-lg font-bold text-indigo-900">Project Inception</h4>
                <p className="text-slate-600 mt-2">Identified the critical need for accessible school hearing screening.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-[-7px] top-1 hw-timeline-dot"></div>
                <h4 className="text-lg font-bold text-indigo-900">Gamified Testing Engine</h4>
                <p className="text-slate-600 mt-2">Developed the core interactive ocean-themed audiometry engine.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-[-7px] top-1 hw-timeline-dot"></div>
                <h4 className="text-lg font-bold text-indigo-900">Clinical Validation</h4>
                <p className="text-slate-600 mt-2">Aligned algorithms with WHO pediatric screening standards.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-[-7px] top-1 hw-timeline-dot"></div>
                <h4 className="text-lg font-bold text-indigo-900">Nationwide Rollout</h4>
                <p className="text-slate-600 mt-2">Deploying HearWise to schools across India.</p>
              </div>
            </div>
          </FadeInSection>

          {/* Section 5: Founder / Team */}
          <FadeInSection delay={0.5}>
            <div className="hw-card bg-white p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 shadow-lg border-4 border-white">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Vikash&backgroundColor=e2e8f0" alt="Vikash Saravanan" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2 font-['Syne']">Vikash Saravanan</h3>
                  <p className="text-indigo-600 font-semibold text-lg mb-4">Founder & Lead Developer</p>
                  <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    Driven by a passion for healthcare technology and pediatric well-being, Vikash engineered HearWise to bridge the massive gap in early childhood hearing screening. By combining clinical precision with engaging gameplay, he aims to ensure no child is left behind in the classroom due to undetected hearing issues.
                  </p>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full"><Award size={16} /> Tech for Good</span>
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full"><Heart size={16} /> Healthcare Innovation</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

        </div>
      </div>
    </PageWrapper>
  );
}
