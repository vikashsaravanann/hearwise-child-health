import BackButton from '../components/BackButton';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Mail, BellRing, Sparkles } from 'lucide-react';

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts[0];

  return (
    <>
      <BackButton />
      <div className="pt-20 bg-[#020817] min-h-screen text-slate-300 relative overflow-hidden pb-24">
        
        {/* Animated background orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-600/6 rounded-full blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-16 space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                LATEST INSIGHTS
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                HEARWISE{' '}
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  BLOG
                </span>
              </h1>
              <p className="text-xl text-slate-400 mt-6 leading-relaxed">
                Expert insights, parent stories, and research on childhood hearing health and early intervention.
              </p>
            </motion.div>
          </div>

          {/* Featured Post */}
          {activeCategory === 'All' && featuredPost && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-3xl border border-teal-500/30 bg-teal-500/5 p-6 sm:p-8 md:p-12 hover:bg-teal-500/10 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-6 sm:p-8 items-center"
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            >
              <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-500/30">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-widest">
                  Featured • {featuredPost.category}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-3xl sm:text-4xl font-black text-white uppercase tracking-wider leading-tight group-hover:text-teal-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-teal-500/20 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="text-teal-400 font-bold text-sm uppercase tracking-widest">{featuredPost.author || 'HearWise Editorial'}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {featuredPost.date} • {featuredPost.readTime}
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-teal-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-6 transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-teal-600 text-white hover:bg-teal-500 border-transparent shadow-lg shadow-teal-500/25' 
                    : 'border-teal-500/30 bg-teal-500/5 text-slate-300 hover:text-white hover:bg-teal-500/20'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-6">
            {filteredPosts.map((post, i) => {
              const styles = [
                { color: 'border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10', glow: 'hover:shadow-teal-500/20', text: 'text-teal-400' },
                { color: 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10', glow: 'hover:shadow-cyan-500/20', text: 'text-cyan-400' },
                { color: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10', glow: 'hover:shadow-blue-500/20', text: 'text-blue-400' },
                { color: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10', glow: 'hover:shadow-emerald-500/20', text: 'text-emerald-400' },
                { color: 'border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10', glow: 'hover:shadow-indigo-500/20', text: 'text-indigo-400' },
              ];
              const style = styles[i % styles.length];

              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`group relative rounded-3xl border p-6 sm:p-8 transition-all duration-300 cursor-pointer shadow-lg flex flex-col h-full ${style.color} ${style.glow}`}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-3xl sm:text-4xl">
                      <BookOpen className={`w-10 h-10 ${style.text}`} />
                    </div>
                    <div className={`px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest ${style.text}`}>
                      {post.category}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-white font-black text-xl uppercase tracking-wider group-hover:text-white transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {post.date} • {post.readTime}
                    </div>
                    <ArrowRight className={`w-5 h-5 ${style.text} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* New Informational Widgets */}
          <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-6 sm:p-8 pt-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-900/40 to-blue-900/40 border border-teal-500/30 p-6 sm:p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 sm:p-8 text-teal-500/20">
                <BellRing className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-4 max-w-md">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center border border-teal-500/30 text-teal-400 mb-6">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white">Never Miss an Update</h3>
                <p className="text-teal-100/70">
                  Join thousands of parents and educators receiving weekly tips on childhood hearing health and early intervention strategies.
                </p>
                <div className="flex gap-2 pt-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-black/30 border border-teal-500/30 rounded-xl px-4 py-3 flex-1 text-white placeholder-teal-100/30 focus:outline-none focus:border-teal-400"
                  />
                  <Button className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl h-auto px-6 font-bold">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl"
            >
              <h3 className="text-2xl font-black text-white mb-6">Quick Health Facts</h3>
              <div className="space-y-4">
                {[
                  { stat: '60%', text: 'of childhood hearing loss is preventable.' },
                  { stat: '34M', text: 'children worldwide have disabling hearing loss.' },
                  { stat: '0-5', text: 'years is the critical window for speech development.' }
                ].map((fact, i) => (
                  <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                    <div className="w-16 font-black text-2xl text-teal-400 shrink-0">{fact.stat}</div>
                    <div className="text-slate-300 text-sm leading-relaxed">{fact.text}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </>
  );
}
