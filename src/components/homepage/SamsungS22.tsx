import { useGetSingleProductQuery } from '@/redux/api/productApi';
import { useGetSiteSettingsQuery } from '@/redux/api/siteSettingsApi';
import { TProduct } from '@/types/commonTypes';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import { RiShieldCheckLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const s22Demo = {
  title: 'Galaxy S22 Ultra',
  price: 1199,
  stock: 20,
  reviews: [],
  brand: 'Samsung',
  category: 'smartphone',
  photos: [],
  displayImage:
    'https://res.cloudinary.com/dzqkcbgew/image/upload/v1710831265/galaxy_irbdnu.png',
  description:
    "Capture every moment in breathtaking detail with the 108MP camera. The powerful Exynos processor and 5000mAh battery keep you connected all day. S Pen included — the ultimate creative companion.",
  vendor: '65def92c87236f3b5c762222',
  runningDiscount: 0,
  releaseDate: '2024-03-10',
};

const SamsungS22 = ({ products }: { products: TProduct[] }) => {
  const navigate = useNavigate();
  const { data: settingsData } = useGetSiteSettingsQuery(undefined);
  const siteSettings = settingsData?.data;

  // Fetch the specific promo product if ID is set
  const { data: promoProductData } = useGetSingleProductQuery(siteSettings?.samsungPromoId, {
    skip: !siteSettings?.samsungPromoId,
  });
  const promoProduct = promoProductData?.data;

  const displayProduct =
    promoProduct ||
    products?.find((p) => p._id === siteSettings?.samsungPromoId) ||
    products?.find((p) => p.title.toLowerCase().includes('samsung')) ||
    products?.find((p) => p.category?.name?.toLowerCase() === 'smartphone') ||
    s22Demo;

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
    : 99;

  return (
    <div
      className="mt-14 lg:mt-20 relative overflow-hidden rounded-3xl promo-gradient-dark"
      data-aos="fade-up"
      data-aos-duration="700"
    >
      {/* Decorative glows */}
      <div
        className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(45,165,243,0.2) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(250,130,50,0.15) 0%, transparent 70%)',
          transform: 'translate(20%, 30%)',
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
        {/* Phone Image */}
        <div
          className="flex items-center justify-center"
          data-aos="fade-right"
          data-aos-duration="700"
          data-aos-delay="150"
        >
          <div className="relative">
            {/* Glow ring around phone */}
            <div
              className="absolute inset-0 rounded-full opacity-30 blur-2xl"
              style={{ background: 'radial-gradient(circle, #2da5f3, transparent)' }}
            />
            <img
              src={displayProduct?.displayImage}
              alt={displayProduct?.title}
             className="relative w-40 h-52 sm:w-52 sm:h-64 lg:w-72 lg:h-96 object-contain drop-shadow-2xl float-anim"
              style={{ filter: 'drop-shadow(0 20px 50px rgba(45,165,243,0.3))' }}
            />
          </div>
        </div>

        {/* Text */}
        <div
          className="text-white"
          data-aos="fade-left"
          data-aos-duration="700"
          data-aos-delay="200"
        >
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">Limited Time Offer · Save ${savings}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black leading-tight mb-4">
            {displayProduct?.title}
          </h2>
          <p className="text-gray-400 text-sm lg:text-base leading-relaxed mb-6 max-w-md">
            {stripHtml(displayProduct?.description).slice(0, 160) || 'Experience the future of mobile technology.'}
          </p>

          {/* Feature Chips */}
          <div className="flex flex-wrap gap-2 mb-7">
            {['5G Ready', 'S Pen Included', '108MP Camera', 'All-day Battery'].map((chip) => (
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
            <span className="flex items-center gap-1"><MdVerified className="text-blue-400 text-sm" /> Official Samsung</span>
            <span className="flex items-center gap-1"><RiShieldCheckLine className="text-green-400 text-sm" /> 2-Year Warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamsungS22;
