import { useParams, Link } from 'react-router-dom';
import { useGetSingleNewsQuery, useGetAllNewsQuery } from '@/redux/api/newsApi';
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaCalendarDays,
  FaUser,
  FaRegClock,
  FaFacebook,
  FaXTwitter,
  FaLinkedinIn,
  FaLink,
} from 'react-icons/fa6';
import ScrollToTop from '@/components/ui/ToTop';
import { toast } from 'sonner';

const tagColors: Record<string, string> = {
  'News': 'bg-blue-50 text-blue-600 border-blue-100',
  'Updates': 'bg-violet-50 text-violet-600 border-violet-100',
  'Guide': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Review': 'bg-rose-50 text-rose-600 border-rose-100',
  'Tech': 'bg-cyan-50 text-cyan-600 border-cyan-100',
  'Deals': 'bg-orange-50 text-orange-600 border-orange-100',
};

const getTagColor = (tag: string) => tagColors[tag] || 'bg-gray-50 text-gray-600 border-gray-100';

const estimateReadTime = (content: string) => {
  const words = content?.split(' ').length || 200;
  return `${Math.max(2, Math.ceil(words / 200))} min read`;
};

const NewsDetails = () => {
  const { id } = useParams();
  const { data: newsData, isLoading } = useGetSingleNewsQuery(id as string);
  const { data: allNewsData } = useGetAllNewsQuery(true);
  const blog = newsData?.data;
  const relatedPosts = (allNewsData?.data || []).filter((b: any) => b.id !== id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', { position: 'top-right', duration: 1500 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="size-14 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <p className="text-6xl mb-6">📭</p>
        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">Article Not Found</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm">
          The article you're looking for doesn't exist or has been removed from our journal.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-3 bg-orange-400 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-lg shadow-orange-400/20"
        >
          <FaArrowLeftLong /> Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <ScrollToTop />

      {/* ── Hero Banner ── */}
      <div className="relative bg-gray-900 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          {blog.image && (
            <img src={blog.image} alt={blog.headline} className="w-full h-full object-cover opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900" />
        </div>
        {/* Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="main-container relative z-10 pt-12 pb-20">
          {/* Back Link */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors mb-10"
          >
            <FaArrowLeftLong /> Back to Journal
          </Link>

          {/* Tag + Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${getTagColor(blog.tag)}`}>
              {blog.tag || 'News'}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <FaCalendarDays className="text-[9px]" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <FaRegClock className="text-[9px]" />
              {estimateReadTime(blog.content)}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05] max-w-4xl mb-8">
            {blog.headline}
          </h1>

          {/* Author strip */}
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-400/30">
              <FaUser className="text-sm" />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest leading-none">Shopora Editorial Team</p>
              <p className="text-[10px] font-medium text-white/40 mt-1">Official Shopora Staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article Layout ── */}
      <div className="main-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── Main Content ── */}
          <article className="lg:col-span-8">
            {/* Featured Image */}
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 mb-12 shadow-2xl shadow-gray-200/60 -mt-10 relative z-10">
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.headline}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-8xl">
                  📰
                </div>
              )}
            </div>

            {/* Article Body */}
            <div className="prose-custom space-y-6">
              {blog.content ? (
                blog.content.includes('<') && blog.content.includes('>') ? (
                  <div
                    className="text-[17px] leading-[1.85] text-gray-600 space-y-6"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                ) : (
                  <div
                    className="text-[17px] leading-[1.85] text-gray-600 space-y-6"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {blog.content.split('\n\n').map((para: string, i: number) =>
                      para.trim() ? (
                        <p key={i}>{para}</p>
                      ) : null
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-100">
                  <p className="text-4xl mb-4">✍️</p>
                  <p className="text-gray-400 font-medium italic text-lg">
                    Full article content coming soon. Check back shortly.
                  </p>
                </div>
              )}
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-10 border-t border-gray-100">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Tags:</span>
                {[blog.tag || 'News', 'Technology', 'Shopora'].map((t) => (
                  <span key={t} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${getTagColor(t)}`}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Share */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Share this article</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                      className="size-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm text-sm"
                    >
                      <FaFacebook />
                    </button>
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.headline}`, '_blank')}
                      className="size-10 rounded-full bg-black/5 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm text-sm"
                    >
                      <FaXTwitter />
                    </button>
                    <button
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`, '_blank')}
                      className="size-10 rounded-full bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-all shadow-sm text-sm"
                    >
                      <FaLinkedinIn />
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="size-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-orange-400 hover:text-white transition-all shadow-sm text-sm"
                    >
                      <FaLink />
                    </button>
                  </div>
                </div>

                <Link
                  to="/blogs"
                  className="group inline-flex items-center gap-3 bg-gray-900 hover:bg-orange-400 text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-all duration-300 shadow-lg shadow-gray-900/10"
                >
                  More Stories
                  <FaArrowRightLong className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </footer>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 space-y-8">

            {/* Author Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-400/30">
                  S
                </div>
                <div>
                  <p className="font-black text-white leading-none">Shopora Editors</p>
                  <p className="text-[10px] text-white/50 font-medium mt-1 uppercase tracking-widest">Official Staff</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Our editorial team of tech experts and shopping enthusiasts curates the best guides, reviews, and news for our community.
              </p>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                  Related Articles
                  <span className="flex-1 h-px bg-gray-100" />
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((post: any) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="group flex gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="size-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {post.image ? (
                          <img src={post.image} alt={post.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-50">📰</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {post.headline}
                        </p>
                        <p className="text-[9px] text-gray-400 font-medium mt-1.5">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Mini CTA */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-6">
              <div className="size-10 rounded-full bg-orange-400 flex items-center justify-center text-white text-base mb-4 shadow-lg shadow-orange-400/25">
                ✉️
              </div>
              <h4 className="font-black text-gray-900 text-sm mb-2">Stay in the Loop</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Get the latest articles, deals, and tech news delivered to your inbox.
              </p>
              <Link
                to="/#newsletter"
                className="block w-full bg-orange-400 hover:bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-lg text-center transition-all shadow-md shadow-orange-400/20"
              >
                Subscribe Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
