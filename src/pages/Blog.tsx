import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/shared/PageWrapper';
import { blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <PageWrapper title="Blog" backPath="/">
      <div className="bg-[#000b1d] min-h-screen text-slate-300 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">HearWise Blog</h1>
            <p className="text-lg text-teal-400 font-medium">Hearing Health for Every Child</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-6 ${
                  activeCategory === cat 
                    ? 'bg-teal-600 text-white hover:bg-teal-500 border-transparent' 
                    : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/30 transition-all duration-300 flex flex-col h-full"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className={`h-48 w-full bg-gradient-to-br ${post.coverColor} flex items-center justify-center p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <BookOpen className="w-16 h-16 text-white/20 relative z-10" />
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
                    <ArrowRight className="w-5 h-5 text-teal-500 group-hover:text-teal-400 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
