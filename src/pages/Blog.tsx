import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/shared/PageWrapper';
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
    <PageWrapper title="Blog" backPath="/">
      <div className="bg-[#020817] min-h-screen text-slate-300 relative overflow-hidden pb-24">
        
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
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300"
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            >
              <div className="grid md:grid-cols-2 group">
                <div className={`h-64 md:h-full min-h-[300px] w-full bg-gradient-to-br ${featuredPost.coverColor} flex items-center justify-center p-8 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <Sparkles className="w-24 h-24 text-white/20 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white uppercase tracking-wider z-10">
                    Featured • {featuredPost.category}
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:text-teal-400 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                      <BookOpen className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold">{featuredPost.author || 'HearWise Editorial'}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {featuredPost.date} • {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
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
                    : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-teal-500/30'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/30 transition-all duration-300 flex flex-col h-full"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className={`h-48 w-full bg-gradient-to-br ${post.coverColor} flex items-center justify-center p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <BookOpen className="w-16 h-16 text-white/20 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white uppercase tracking-wider z-10">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {post.date} • {post.readTime}
                    </div>
                    <ArrowRight className="w-5 h-5 text-teal-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* New Informational Widgets */}
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-900/40 to-blue-900/40 border border-teal-500/30 p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-teal-500/20">
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
              className="bg-white/5 border border-white/10 p-8 rounded-3xl"
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
    </PageWrapper>
  );
}
