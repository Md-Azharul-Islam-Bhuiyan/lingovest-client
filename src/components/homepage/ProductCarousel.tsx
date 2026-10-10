import { TProduct } from '@/types/commonTypes';
import { samsungWatch4, sonyHeadphone } from '@/utils/demoDataForHome';
import { FaArrowRightLong } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { sliderData } from '../../utils/demoDataForHome';

const Carousel = ({ products }: { products: TProduct[] }) => {
  const navigate = useNavigate();
  const sliderProducts = products?.length > 0 ? products.slice(0, 3) : sliderData;
  const sideProduct1 = products?.length > 3 ? products[3] : sonyHeadphone;
  const sideProduct2 = products?.length > 4 ? products[4] : samsungWatch4;

  const stripHtml = (html: string) => {
    return html
      ?.replace(/<[^>]*>/g, '')
      ?.replace(/&nbsp;/g, ' ')
      ?.replace(/&amp;/g, '&')
      ?.replace(/&quot;/g, '"')
      ?.replace(/&apos;/g, "'") || '';
  };

  return (
    <div className="banner grid grid-cols-1 xl:grid-cols-12 mt-4 md:mt-6 xl:mt-10 gap-4 md:gap-6 xl:gap-8 w-full
    ">
      {/* Main Carousel */}
      <div
        className="swipercontainer col-span-12 xl:col-span-8 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/50"
        data-aos="fade-right"
        data-aos-duration="1000"
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={0}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full min-h-[500px] sm:min-h-[440px] md:min-h-[480px] xl:min-h-[520px]"
        >
          {sliderProducts?.map((product: any, idx: number) => {
            const gradients = [
              'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
              'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
              'linear-gradient(135deg, #fffaf5 0%, #ffedd5 50%, #fed7aa 100%)',
            ];
            const accentColors = ['#0284c7', '#059669', '#ea580c'];
            const bg = gradients[idx % gradients.length];
            const accent = accentColors[idx % accentColors.length];

            return (
              <SwiperSlide key={product?._id}>
                <div
                  className="relative flex flex-col xl:grid xl:grid-cols-12 h-full min-h-[500px] sm:min-h-[440px] md:min-h-[480px] xl:min-h-[520px] overflow-hidden"
                  style={{ background: bg }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full blur-[80px] md:blur-[100px] opacity-20 pointer-events-none"
                    style={{ background: accent }} />
                  <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-full blur-[60px] md:blur-[80px] opacity-10 pointer-events-none"
                    style={{ background: accent }} />
                  
                  {/* Text Content */}
                  <div className="col-span-12 xl:col-span-7 flex flex-col justify-center px-6 py-8 sm:py-8 md:py-12 xl:p-16 z-10 order-2 xl:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 mb-3 sm:mb-4 w-fit shadow-sm">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse" style={{ background: accent }} />
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[2px] text-gray-600">
                        {product?.intro || 'New Discovery'}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-3xl md:text-4xl xl:text-6xl font-black text-gray-900 leading-[1.1] mb-2 sm:mb-4 xl:mb-6 max-w-xl">
                      <span className="line-clamp-2">{product?.title}</span>
                    </h2>

                    <p className="text-gray-600 text-xs sm:text-xs md:text-sm xl:text-base leading-relaxed mb-5 sm:mb-6 xl:mb-8 max-w-md line-clamp-2 md:line-clamp-3 opacity-90">
                      {stripHtml(product?.description) || 'Experience the next level of innovation and design.'}
                    </p>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <button
                        className="group relative flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 md:py-4 bg-orange-400 text-white rounded-lg md:rounded-lg font-bold text-xs md:text-sm overflow-hidden transition-all hover:bg-orange-500 hover:shadow-xl active:scale-95"
                        onClick={() => navigate('/products')}
                      >
                        <span className="relative z-10">Explore Now</span>
                        <FaArrowRightLong className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      </button>

                      <div className="flex flex-col">
                        <span className="text-[9px] md:text-[xs] font-bold text-gray-400 uppercase tracking-widest">Starting at</span>
                        <span className="text-xl md:text-2xl xl:text-3xl font-black text-gray-900">${product?.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Image Section */}
                  <div className="col-span-12 xl:col-span-5 relative flex items-center justify-center p-6 sm:p-8 xl:p-12 z-10 order-1 xl:order-2">
                    <div className="relative group/img w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] xl:max-w-[420px] aspect-square flex items-center justify-center">
                      {/* Image background glow */}
                      <div className="absolute inset-0 blur-[60px] md:blur-[80px] opacity-40 rounded-full pointer-events-none"  
                        style={{ background: accent }} />
                      
                      {/* Image Container */}
                      <div className="relative w-full h-full rounded-2xl md:rounded-lg overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] xl:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-white/10 backdrop-blur-sm transition-all duration-500 group-hover/img:scale-[1.02] group-hover/img:-translate-y-2">
                        <img
                          src={product?.displayImage}
                          alt={product?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/5 pointer-events-none" />
                      </div>

                      {/* Floating Badge on Image - Hidden on mobile */}
                      <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md border border-white px-4 py-2 rounded-2xl shadow-xl z-20 hidden md:block animate-bounce-slow">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 block leading-none mb-1">Authentic</span>
                        <span className="text-xs font-bold text-gray-900 leading-none">100% Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Side Banners */}
      <div className="col-span-12 xl:col-span-4 flex flex-col sm:flex-row xl:flex-col gap-4 md:gap-6">
        {/* Banner 1 */}
        <div
          className="group relative flex-1 rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-orange-500/10 min-h-[200px] sm:min-h-0"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
          onClick={() => navigate('/products')}
          data-aos="fade-left"
          data-aos-delay="100"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] group-hover:bg-orange-500/30 transition-colors pointer-events-none" />
          
          <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4">
                Limited Sale
              </span>
              <h3 className="text-white text-xl md:text-2xl font-black leading-tight max-w-[180px] line-clamp-2">
                {sideProduct1?.title}
              </h3>
            </div>
            
            <div className="flex items-end justify-between gap-4 mt-auto">
              <button className="flex items-center gap-2 text-white text-[11px] md:text-xs font-bold border-b-2 border-orange-500 pb-1 group-hover:gap-3 transition-all whitespace-nowrap">
                Shop Now <FaArrowRightLong />
              </button>
              <div className="relative w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shrink-0 group-hover:rotate-3 transition-transform duration-500">
                <img
                  src={sideProduct1?.displayImage}
                  alt={sideProduct1?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div
          className="group relative flex-1 rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-orange-500/10 border border-gray-100 min-h-[200px] sm:min-h-0"
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
          onClick={() => navigate('/products')}
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 blur-[50px] group-hover:bg-orange-500/20 transition-colors pointer-events-none" />
          
          <div className="relative h-full flex flex-col justify-between p-6 md:p-7 xl:p-8 z-10">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-2 md:mb-3">
                  <HiSparkles className="text-orange-500 text-sm" />
                  <span className="text-[9px] md:text-[10px] font-bold text-orange-500 uppercase tracking-widest">Just In</span>
                </div>
                <h3 className="text-gray-900 text-lg md:text-xl xl:text-2xl font-black leading-tight line-clamp-2">
                  {sideProduct2?.title}
                </h3>
              </div>
              <div className="relative w-20 h-20 md:w-24 md:h-24 xl:w-28 xl:h-28 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-xl shrink-0 group-hover:-rotate-3 transition-transform duration-500">
                <img
                  src={sideProduct2?.displayImage}
                  alt={sideProduct2?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-gray-900 text-[11px] md:text-xs font-bold w-fit group-hover:gap-3 transition-all mt-4">
              <span className="bg-orange-400 text-white p-2 rounded-lg md:rounded-lg">
                <FaArrowRightLong />
              </span>
              View Arrival
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
