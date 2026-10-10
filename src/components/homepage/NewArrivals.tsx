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
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TProduct } from '@/types/commonTypes';
import { useState } from 'react';
import { CiHeart, CiShoppingCart } from 'react-icons/ci';
import { FaClipboardCheck } from 'react-icons/fa';
import { IoHeart } from 'react-icons/io5';
import { PiEyeLight, PiShoppingCartSimpleFill } from 'react-icons/pi';
import { HiSparkles } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import headphoneImage from '../../assets/images/headphone.png';
import { FaArrowRightLong } from 'react-icons/fa6';
import ProductCard from '../common/ProductCard';

interface NewArrivalProps {
  products: TProduct[];
}

const NewArrivals: React.FC<NewArrivalProps> = ({ products }) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const newArrivalProducts: TProduct[] = products?.slice(0, 9) || [];

  const dispatch = useAppDispatch();
  const wishList = useAppSelector(useWishedProducts);
  const shoppingCart = useAppSelector(useShoppingCartProducts);

  const featuredProduct = newArrivalProducts[0];
  const isHighlightedInWishList = wishList.find((item) => item?._id === featuredProduct?._id);
  const isHighlightedInCart = shoppingCart.find((item) => item?._id === featuredProduct?._id);

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

  if (!newArrivalProducts.length) return null;

  return (
    <div className="mt-14 lg:mt-20" data-aos="fade-up" data-aos-duration="700">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="section-label mb-2">
            <HiSparkles className="text-yellow-500 text-xs" />
            Just Dropped
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-custom-black">
            New <span className="gradient-text">Arrivals</span>
          </h2>
        </div>
        <Link to="/products">
          <button className="text-sm font-semibold text-bluish flex items-center gap-1.5 hover:gap-2.5 transition-all duration-300">
            Browse All <FaArrowRightLong className="text-xs" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Product Grid */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 order-2 lg:order-1">
          {newArrivalProducts.slice(1, 9).map((product: TProduct) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>

        {/* Featured New Arrival */}
        {featuredProduct && (
          <div
            className="lg:col-span-3 rounded-xl overflow-hidden flex flex-col order-1 lg:order-2 cursor-pointer group relative border border-white/40 shadow-xl shadow-green-500/5 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-700 h-full"
            style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}
            data-aos="fade-left"
            data-aos-delay="150"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none" />

            <div className="relative p-8 pb-0 flex flex-col items-center text-center flex-1 z-10">
              {/* Modern Badge */}
              <div className="absolute top-6 right-6">
                <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/30 animate-pulse-slow">
                  New
                </span>
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 bg-green-50 px-4 py-1.5 rounded-full">
                  Today's Pick
                </span>
              </div>

              <div className="relative mb-8 group-hover:mb-10 transition-all duration-500">
                <div className="absolute inset-0 bg-green-400/20 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-700" />
                <img
                  src={featuredProduct?.displayImage || headphoneImage}
                  alt={featuredProduct?.title}
                  className="relative w-48 h-48 lg:w-56 lg:h-56 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 ease-out"
                />
              </div>

              <h3 className="text-gray-900 font-black text-xl lg:text-2xl leading-tight mb-3 line-clamp-2 px-2">
                {featuredProduct?.title}
              </h3>
              
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 line-clamp-2 px-4 opacity-80">
                {stripHtml(featuredProduct?.description).slice(0, 80)}...
              </p>

              <div className="flex flex-col items-center mb-8">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Price</span>
                <p className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                  ${featuredProduct?.price?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Premium Action Bar */}
            <div className="px-8 pb-8 flex items-center gap-3 relative z-10">
              <button
                className="w-14 h-14 bg-white hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-lg shadow-sm border border-gray-100 transition-all flex items-center justify-center active:scale-90"
                onClick={() => wishListHandler(featuredProduct)}
              >
                {isHighlightedInWishList ? (
                  <IoHeart className="text-red-500 text-xl" />
                ) : (
                  <CiHeart className="text-xl stroke-2" />
                )}
              </button>
              
              <button
                className="flex-1 btn-premium py-2 text-sm rounded-lg justify-center h-14"
                onClick={() => cartHandler(featuredProduct)}
              >
                {isHighlightedInCart ? (
                  <><FaClipboardCheck className="mr-2" /> Added</>
                ) : (
                  'Add to Cart'
                )}
              </button>

              <Link to={`/product/${featuredProduct?._id}`} className="block">
                <button className="w-14 h-14 bg-white hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-lg shadow-sm border border-gray-100 transition-all flex items-center justify-center active:scale-90">
                  <PiEyeLight className="text-xl" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
