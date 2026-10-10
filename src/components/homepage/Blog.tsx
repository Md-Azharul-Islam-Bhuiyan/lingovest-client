import { FaArrowRightLong } from 'react-icons/fa6';
import { BsCalendar3, BsChatDots, BsPerson } from 'react-icons/bs';
import { toast } from 'sonner';
import { useGetAllNewsQuery } from '@/redux/api/newsApi';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Blog = () => {
  const { data: newsData, isLoading } = useGetAllNewsQuery(true);
  const blogs = newsData?.data || [];

  const handleBlogClick = (_id: string) => {
    toast.error('This feature is not available yet.', {
      position: 'top-right',
      duration: 1500,
      icon: '🚫',
    });
  };

  if (isLoading) {
    return (
      <div className="mt-14 lg:mt-20 py-16" style={{ background: '#f8faff' }}>
        <div className="main-container">
          <div className="text-center mb-10">
            <div className="shimmer h-4 w-24 rounded mx-auto mb-3" />
            <div className="shimmer h-8 w-64 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="shimmer h-48 w-full" />
                <div className="p-5 bg-white">
                  <div className="shimmer h-3 w-1/2 rounded mb-3" />
                  <div className="shimmer h-5 w-full rounded mb-2" />
                  <div className="shimmer h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blogs.length) return null;

  const tagColors = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700'];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#f8faff] to-white overflow-hidden">
      <div className="main-container relative">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Our Journal
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">News & Insights</span>
          </h2>
          <div className="w-20 h-1.5 bg-orange-500 rounded-full mx-auto mt-6" />
          <p className="text-gray-500 text-sm md:text-base mt-6 max-w-xl mx-auto leading-relaxed">
            Discover the latest trends, tech updates, and expert shopping guides curated just for you.
          </p>
        </div>

        <div className="relative z-10">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14 blog-swiper"
          >
            {blogs.slice(0, 6).map((blog: any, i: number) => (
              <SwiperSlide key={blog.id || blog._id} className="h-auto">
                <article
                  className="group h-full bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                  onClick={() => handleBlogClick(blog.id || blog._id)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.headline}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-50 to-gray-100">
                        {['💻', '📱', '🎧'][i % 3]}
                      </div>
                    )}
                    
                    {/* Glass Tag */}
                    {blog.tag && (
                      <div className="absolute top-5 left-5">
                        <span className="backdrop-blur-md bg-white/80 text-gray-900 text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-sm">
                          {blog.tag}
                        </span>
                      </div>
                    )}

                    {/* Date Overlay */}
                    <div className="absolute bottom-5 right-5">
                      <div className="bg-white rounded-lg p-2.5 shadow-lg text-center min-w-[55px]">
                          <span className="block text-lg font-black text-gray-900 leading-none">
                            {new Date(blog.createdAt).getDate()}
                          </span>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-5">
                      <span className="flex items-center gap-2 group-hover:text-orange-500 transition-colors">
                        <BsPerson className="text-sm" /> Admin
                      </span>
                      <span className="w-1 h-1 rounded-lg bg-gray-200" />
                      <span className="flex items-center gap-2">
                        <BsChatDots className="text-sm" /> 0 Comments
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-4 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                      {blog.headline}
                    </h3>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                      {blog.content?.replace(/<[^>]*>/g, '') || 'Dive into the details of our latest update and discover what\'s new in the world of technology.'}
                    </p>

                    <div className="mt-auto">
                      <Link to={`/blog/${blog.id || blog._id}`} className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] text-gray-900 group-hover:text-orange-500 transition-all">
                        <span>Read Article</span>
                        <div className="w-8 h-px bg-gray-200 group-hover:w-12 group-hover:bg-orange-500 transition-all duration-300" />
                        <FaArrowRightLong className="text-[10px] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link to="/blogs">
            <button className="bg-orange-400 hover:bg-orange-500 text-white font-black py-4 px-10 rounded-lg text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-orange-500/20 active:scale-95">
              Explore All News
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
