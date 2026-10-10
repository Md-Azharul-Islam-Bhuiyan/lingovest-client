import { useGetSingleProductQuery } from '@/redux/api/productApi';
import { useGetSiteSettingsQuery } from '@/redux/api/siteSettingsApi';
import { TProduct } from '@/types/commonTypes';
import { FaArrowRightLong } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { MdVerified } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const macbookDemo = {
  title: 'Apple MacBook Pro M3',
  price: 1799,
  stock: 15,
  reviews: [],
  brand: 'Apple',
  category: 'laptop',
  photos: [],
  displayImage:
    'https://res.cloudinary.com/dzqkcbgew/image/upload/v1710929254/20211110_1636549088_550946-removebg-preview_nluykh.png',
  description:
    "Blazing-fast M3 chip, all-day battery life, and a stunning Liquid Retina display — engineered for those who create, build, and innovate. Push the limits of what's possible.",
  vendor: '65def92c87236f3b5c762222',
  runningDiscount: 0,
  releaseDate: '2024-03-10',
};

const Macbook = ({ products }: { products: TProduct[] }) => {
  const navigate = useNavigate();
  const { data: settingsData } = useGetSiteSettingsQuery(undefined);
  const siteSettings = settingsData?.data;

  // Fetch the specific promo product if ID is set
  const { data: promoProductData } = useGetSingleProductQuery(siteSettings?.macbookPromoId, {
    skip: !siteSettings?.macbookPromoId,
  });
  const promoProduct = promoProductData?.data;

  const displayProduct =
    promoProduct ||
    products?.find((p) => p._id === siteSettings?.macbookPromoId) ||
    products?.find((p) => p.title.toLowerCase().includes('mac')) ||
    products?.find((p) => p.category?.name?.toLowerCase() === 'laptop') ||
    macbookDemo;

  const stripHtml = (html: string) => {
    return html
      ?.replace(/<[^>]*>/g, '')
      ?.replace(/&nbsp;/g, ' ')
      ?.replace(/&amp;/g, '&')
      ?.replace(/&quot;/g, '"')
      ?.replace(/&apos;/g, "'") || '';
  };

  const savings = displayProduct?.runningDiscount
    ? Math.round((displayProduct.price * displayProduct.runningDiscount) / 100)
    : 230;

  return (
    <div
      className="mt-14 lg:mt-20 relative overflow-hidden rounded-3xl promo-gradient-dark"
      data-aos="fade-up"
      data-aos-duration="700"
    >
      {/* Decorative glows */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(250,130,50,0.1) 0%, transparent 70%)',
          transform: 'translateY(40%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-6 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-12">
        {/* Text */}
        <div
          className="order-2 md:order-1 text-white"
          data-aos="fade-right"
          data-aos-duration="700"
          data-aos-delay="150"
        >
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-5">
            <HiSparkles className="text-yellow-500 text-sm" />
            <span className="text-xs font-semibold tracking-wide">Premium Choice · Save up to ${savings}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black leading-tight mb-4">
            {displayProduct?.title}
          </h2>
          <p className="text-gray-400 text-sm lg:text-base leading-relaxed mb-6 max-w-md">
            {stripHtml(displayProduct?.description).slice(0, 160) || 'Experience peak performance and innovation.'}
          </p>

          {/* Feature Chips */}
          <div className="flex flex-wrap gap-2 mb-7">
            {['Genuine Product', 'Free Shipping', '1 Year Warranty', 'M3 Chip Power'].map((chip) => (
              <span
                key={chip}
                className="text-xs font-semibold px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              className="btn-premium rounded-lg py-2.5 sm:py-3 px-6 sm:px-8 text-sm"
              onClick={() => navigate('/products')}
            >
              Shop Now <FaArrowRightLong />
            </button>
            <div>
              <p className="text-3xl font-black">${displayProduct?.price?.toLocaleString()}</p>
              {displayProduct?.runningDiscount > 0 && (
                <p className="text-xs text-gray-500 line-through">
                  ${(displayProduct.price * (1 + displayProduct.runningDiscount / 100)).toFixed(0)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <MdVerified className="text-blue-400 text-sm" /> Official Apple
            </span>
            <span className="flex items-center gap-1">
              <HiSparkles className="text-yellow-400 text-sm" /> Premium Support
            </span>
          </div>
        </div>

        {/* Image */}
        <div
          className="order-1 md:order-2 flex items-center justify-center"
          data-aos="fade-left"
          data-aos-duration="700"
          data-aos-delay="250"
        >
          <div className="relative">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-2xl"
              style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }}
            />
            <img
              src={displayProduct?.displayImage}
              alt={displayProduct?.title}
              className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-96 lg:h-96 object-contain drop-shadow-2xl float-anim"
              style={{ filter: 'drop-shadow(0 20px 50px rgba(251,191,36,0.2))' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Macbook;
