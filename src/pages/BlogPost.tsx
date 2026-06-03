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
      <div className="bg-[#000b1d] min-h-screen text-slate-300 pb-24">
        
        {/* Hero Section */}
        <div className={`w-full pt-32 pb-24 px-4 bg-gradient-to-br ${post.coverColor} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="max-w-4xl mx-auto relative z-10 space-y-6">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 mb-4 px-0" onClick={() => navigate('/blog')}>
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Blog
            </Button>
            
            <div className="inline-block bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-sm font-bold text-white uppercase tracking-widest">
              {post.category}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/70 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {post.readTime}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="prose prose-invert prose-lg prose-teal max-w-none">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed text-slate-300 text-lg mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" /> Share Article
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="max-w-5xl mx-auto px-6 pt-16 border-t border-white/10">
          <h3 className="text-2xl font-bold text-white mb-8">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {relatedPosts.map((related, i) => (
              <motion.div
                key={related.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/blog/${related.slug}`)}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-3">
                  {related.category}
                </div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                  {related.title}
                </h4>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {related.excerpt}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="max-w-4xl mx-auto px-6 mt-24">
          <div className="bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-500/30 rounded-[3rem] p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.15),transparent_70%)]" />
            <h2 className="text-3xl md:text-4xl font-black text-white relative z-10">Ready to make a difference?</h2>
            <p className="text-lg text-teal-100/80 relative z-10 max-w-xl mx-auto">
              Join HearWise and help us ensure that no child loses their future to undetected hearing loss.
            </p>
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-[#000b1d] font-bold text-lg px-8 h-14 rounded-full shadow-lg shadow-teal-500/20 relative z-10" onClick={() => navigate('/onboarding')}>
              Screen your school with HearWise <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
