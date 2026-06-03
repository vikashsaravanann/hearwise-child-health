import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/shared/PageWrapper';
import { blogPosts, BlogPost as BlogPostType } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Share2, Calendar, ArrowRight } from 'lucide-react';
import NotFound from './NotFound';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.slug === slug);
    if (foundPost) setPost(foundPost);
  }, [slug]);

  if (!post) {
    // A simple loading state before showing not found or actual post
    return <NotFound />;
  }

  const handleShare = () => {
    const url = window.location.href;
    const text = `Read this article on HearWise: ${post.title}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
  };

  const relatedPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <PageWrapper title={post.title} backPath="/blog">
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

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-12 relative z-10 space-y-8">
          <Button variant="ghost" className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 mb-4 px-0" onClick={() => navigate('/blog')}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Blog
          </Button>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              {post.category}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest pt-6 mt-6 border-t border-teal-500/20">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" /> {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> {post.readTime}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 relative z-10">
          <div className="prose prose-invert prose-lg prose-teal max-w-none">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed text-slate-300 text-lg mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-teal-500/20 flex items-center justify-between">
            <Button variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" /> Share Article
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="max-w-5xl mx-auto px-6 pt-16 border-t border-teal-500/20 relative z-10 mt-8">
          <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-8">Related <span className="text-teal-400">Articles</span></h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((related, i) => (
              <motion.div
                key={related.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => navigate(`/blog/${related.slug}`)}
                className="group relative rounded-3xl border border-teal-500/30 bg-teal-500/5 p-8 hover:bg-teal-500/10 hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">
                  {related.category}
                </div>
                <div className="flex-1 space-y-4">
                  <h4 className="text-xl font-black text-white uppercase tracking-wider group-hover:text-teal-400 transition-colors leading-tight">
                    {related.title}
                  </h4>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {related.excerpt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="max-w-4xl mx-auto px-6 mt-24 relative z-10">
          <div className="bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-500/30 rounded-[3rem] p-10 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-teal-500/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.15),transparent_70%)]" />
            <h2 className="text-3xl md:text-4xl font-black text-white relative z-10 uppercase tracking-wider">Ready to make a <span className="text-teal-400">difference?</span></h2>
            <p className="text-lg text-teal-100/80 relative z-10 max-w-xl mx-auto">
              Join HearWise and help us ensure that no child loses their future to undetected hearing loss.
            </p>
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-[#000b1d] font-bold text-lg px-8 h-14 rounded-full shadow-lg shadow-teal-500/20 relative z-10 uppercase tracking-widest" onClick={() => navigate('/onboarding')}>
              Screen your school <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
