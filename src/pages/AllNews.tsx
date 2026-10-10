import { FaArrowRightLong, FaRegClock, FaMagnifyingGlass } from 'react-icons/fa6';
import { useGetAllNewsQuery } from '@/redux/api/newsApi';
import { Link } from 'react-router-dom';
import ScrollToTop from '@/components/ui/ToTop';
import { useState, useMemo } from 'react';
import Newsletter from '@/components/homepage/Newsletter';

const ALL_TAGS = ['All', 'News', 'Tech', 'Guide', 'Review', 'Deals', 'Updates'];

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

const AllNews = () => {
  const { data: newsData, isLoading } = useGetAllNewsQuery(true);
  const blogs = newsData?.data || [];
  const [activeTag, setActiveTag] = useState('All');
  const [search, setSearch] = useState('');

  const dynamicTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach((blog: any) => {
      if (blog.tag) tags.add(blog.tag);
    });
    return ['All', ...Array.from(tags)];
  }, [blogs]);

  const filtered = useMemo(() => {
    return blogs.filter((blog: any) => {
      const matchTag = activeTag === 'All' || (blog.tag && blog.tag.toLowerCase().trim() === activeTag.toLowerCase().trim());
      const matchSearch =
        !search ||
        blog.headline?.toLowerCase().includes(search.toLowerCase()) ||
        blog.content?.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [blogs, activeTag, search]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <ScrollToTop />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gray-900 pt-20 pb-32">
        {/* Background texture */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="main-container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <div className="size-1.5 rounded-full bg-orange-400 animate-pulse" />
              Shopora Journal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05] mb-6">
              News, Guides & <span className="text-orange-400">Stories</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Expert insights, tech reviews, and shopping guides from the Shopora editorial team.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, guides, news..."
                className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder:text-gray-500 rounded-xl text-sm focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tag Filter Bar (floating over hero) ── */}
      <div className="main-container -mt-6 relative z-20 mb-12">
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50 px-4 py-3 flex items-center gap-2 overflow-x-auto">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mr-2 shrink-0">Filter:</span>
          {dynamicTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-orange-400 text-white border-orange-400 shadow-md shadow-orange-400/25'
                  : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="ml-auto shrink-0 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear Search ✕
            </button>
          )}
        </div>
      </div>

      <div className="main-container pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="size-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading articles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-black text-gray-700 mb-2">No articles found</p>
            <p className="text-gray-400 text-sm mb-6">Try a different tag or clear your search.</p>
            <button
              onClick={() => { setActiveTag('All'); setSearch(''); }}
              className="bg-orange-400 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">

            {/* ── Featured Hero Card ── */}
            {featured && (
              <Link
                to={`/blog/${featured.id}`}
                className="group block relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500"
                data-aos="fade-up"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-900 min-h-[280px] lg:min-h-0">
                    {featured.image ? (
                      <img
                        src={featured.image}
                        alt={featured.headline}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-gray-900 text-8xl">
                        📰
                      </div>
                    )}
                    {/* Tag */}
                    <div className="absolute top-5 left-5 z-10">
                      <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${getTagColor(featured.tag)}`}>
                        {featured.tag || 'Featured'}
                      </span>
                    </div>
                    {/* Featured badge */}
                    <div className="absolute top-5 right-5 z-10">
                      <span className="bg-orange-400 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        ⭐ Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="size-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-orange-400/30">
                        S
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Shopora Editor</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          {new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="ml-auto flex items-center gap-1.5 text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <FaRegClock className="text-[9px]" />
                        {estimateReadTime(featured.content)}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-4 group-hover:text-orange-500 transition-colors">
                      {featured.headline}
                    </h2>
                    <p className="text-gray-500 leading-relaxed line-clamp-3 text-sm mb-8">
                      {featured.content?.replace(/<[^>]*>/g, '') || 'Read the full story for all the details from our experts.'}
                    </p>

                    <div className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-orange-500 transition-colors">
                      Read Full Article
                      <span className="size-8 rounded-full bg-gray-100 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all duration-300">
                        <FaArrowRightLong className="text-[10px]" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* ── Article Grid ── */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {activeTag === 'All' ? 'More Articles' : activeTag}
                    <span className="ml-2 text-orange-400">({rest.length})</span>
                  </h2>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((blog: any, idx: number) => (
                    <Link
                      key={blog.id}
                      to={`/blog/${blog.id}`}
                      className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1.5 transition-all duration-400"
                      data-aos="fade-up"
                      data-aos-delay={idx * 60}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden h-52 bg-gray-100">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.headline}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-5xl">
                            📰
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getTagColor(blog.tag)}`}>
                            {blog.tag || 'News'}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="size-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[8px] font-black">S</div>
                          <span className="text-[9px] font-bold text-gray-400">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-gray-400">
                            <FaRegClock className="text-[8px]" />
                            {estimateReadTime(blog.content)}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-gray-900 leading-snug tracking-tight mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 flex-1">
                          {blog.headline}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                          {blog.content?.replace(/<[^>]*>/g, '') || 'Read the full story for details.'}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                            Read More <FaArrowRightLong className="text-[9px]" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Newsletter />
    </div>
  );
};

export default AllNews;
