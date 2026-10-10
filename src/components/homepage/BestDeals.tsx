import {
  RemoveCartProductFromLocalState,
  setCartProductsInLocalState,
  useShoppingCartProducts,
} from '@/redux/features/shoppingCartSlice';
import {
  RemoveWishedProductFromLocalState,
  setWishedProductsInLocalState,
  useWishedProducts,
} from '@/redux/features/wishListSlice';
import { useGetSiteSettingsQuery } from '@/redux/api/siteSettingsApi';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TProduct } from '@/types/commonTypes';
import { useState } from 'react';
import { CiHeart, CiShoppingCart } from 'react-icons/ci';
import { FaClipboardCheck, FaFire } from 'react-icons/fa';
import { IoHeart } from 'react-icons/io5';
import { PiEyeLight, PiShoppingCartSimpleFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import headphoneImage from '../../assets/images/headphone.png';
import CountDown from './CountDown';
import { FaArrowRightLong } from 'react-icons/fa6';
import ProductCard from '../common/ProductCard';

interface BestDealsProps {
  products: TProduct[];
}

const BestDeals: React.FC<BestDealsProps> = ({ products }) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { data: settingsData } = useGetSiteSettingsQuery(undefined);
  const siteSettings = settingsData?.data;

  const discountedProducts = products?.filter((p) => p.runningDiscount > 0) || [];
  const bestDealProducts: TProduct[] =
    discountedProducts.length > 0 ? discountedProducts.slice(0, 9) : products?.slice(0, 9) || [];
  const targetDate = siteSettings?.dealEndsAt
    ? new Date(siteSettings.dealEndsAt)
    : new Date('2025-12-31T23:59:59');

  const dispatch = useAppDispatch();
  const wishList = useAppSelector(useWishedProducts);
  const shoppingCart = useAppSelector(useShoppingCartProducts);

  const featuredProduct = bestDealProducts[0];
  const gridProducts = bestDealProducts.slice(1, 9);

  const isHighlightedInWishList = wishList.find((item) => item?._id === featuredProduct?._id);
  const isHighlightedInCart = shoppingCart.find((item: TProduct) => item?._id === featuredProduct?._id);

  const wishListHandler = (product: TProduct) => {
    const inWishList = wishList.find((item) => item?._id === product?._id);
    if (inWishList) {
      dispatch(RemoveWishedProductFromLocalState(product));
      toast.success('Removed from wishlist', { position: 'top-right', duration: 1500, icon: '🤔' });
    } else {
      dispatch(setWishedProductsInLocalState(product));
      toast.success('Added to wishlist!', { position: 'top-right', duration: 1500, icon: '😍' });
    }
  };

  const cartHandler = (product: TProduct) => {
    const inCart = shoppingCart.find((item: TProduct) => item?._id === product?._id);
    if (inCart) {
      dispatch(RemoveCartProductFromLocalState(product));
      toast.success('Removed from cart', { position: 'top-right', duration: 1500, icon: '🤔' });
    } else {
      dispatch(setCartProductsInLocalState(product));
      toast.success('Added to cart!', { position: 'top-right', duration: 1500, icon: '😍' });
    }
  };

  const stripHtml = (html: string) => {
    return html
      ?.replace(/<[^>]*>/g, '')
      ?.replace(/&nbsp;/g, ' ')
      ?.replace(/&amp;/g, '&')
      ?.replace(/&quot;/g, '"')
      ?.replace(/&apos;/g, "'") || '';
  };

  if (!bestDealProducts.length) return null;

  return (
    <div className="mt-14 lg:mt-20" data-aos="fade-up" data-aos-duration="700">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="section-label mb-2">
            <FaFire className="text-orange-500 text-xs" />
            Hot Deals
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-custom-black">
            Best <span className="gradient-text">Deals</span> Today
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-graish">
            <span className="font-medium">Deals end in:</span>
            <div className="flex gap-1">
              <CountDown targetDate={targetDate} />
            </div>
          </div>
          <Link to="/products">
            <button className="text-sm font-semibold text-bluish flex items-center gap-1.5 hover:gap-2.5 transition-all duration-300">
              View All <FaArrowRightLong className="text-xs" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Featured Deal Card */}
        {featuredProduct && (
          <div
            className="lg:col-span-3 relative rounded-lg overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f3460 100%)',
            }}
            data-aos="fade-right"
            data-aos-delay="100"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #2da5f3, transparent)', transform: 'translate(30%, -30%)' }} />

            {featuredProduct.runningDiscount > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{featuredProduct.runningDiscount}% OFF
                </span>
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center p-6 pt-10">
              <img
                src={featuredProduct?.displayImage || headphoneImage}
                alt={featuredProduct?.title}
                className="w-56 h-56 lg:w-64 lg:h-64 object-contain drop-shadow-2xl mb-4 float-anim"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(45,165,243,0.4))' }}
              />
              <p className="text-gray-400 text-base uppercase tracking-widest mb-1">
                {featuredProduct?.brand?.name || 'Featured'}
              </p>
              <h3 className="text-white font-bold text-xl lg:text-2xl text-center leading-tight mb-3 line-clamp-2">
                {featuredProduct?.title}
              </h3>
              <p className="text-gray-500 text-[16px] leading-relaxed text-center line-clamp-2 mb-4">
                {stripHtml(featuredProduct?.description).slice(0, 90)}
              </p>
              <p className="text-4xl font-black text-white mb-5">
                {/* <span className="text-lg text-white font-normal">$</span> */}
                $
                {featuredProduct?.price?.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 w-full">
                <button
                  className="w-12 h-12 bg-white/10 hover:bg-orange-50 hover:text-orange-500 border border-white/20 text-white py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
                  onClick={() => wishListHandler(featuredProduct)}
                >
                  {isHighlightedInWishList ? <IoHeart className="text-red-400 text-lg" /> : <CiHeart className="text-lg" />}
                </button>
                <button
                  className="flex-1 btn-premium py-2 text-sm rounded-lg justify-center w-12 h-12"
                  onClick={() => cartHandler(featuredProduct)}
                >
                  {isHighlightedInCart ? (
                    <><FaClipboardCheck /> Added</>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <Link to={`/product/${featuredProduct?._id}`}>
                  <button className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center">
                    <PiEyeLight className="text-lg" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gridProducts.map((product: TProduct) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
