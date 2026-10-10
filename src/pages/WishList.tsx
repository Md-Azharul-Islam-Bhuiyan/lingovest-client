import ScrollToTop from '@/components/ui/ToTop';
import { useCurrentUser } from '@/redux/features/authSlice';
import {
  useWishedProducts,
} from '@/redux/features/wishListSlice';
import { useAppSelector } from '@/redux/hook';
import { TCurrentUser, TProduct } from '@/types/commonTypes';
import { Link, useParams } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import NotFound from './NotFound';
import ProductCard from '@/components/common/ProductCard';

const WishList = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser;
  const wishedProducts = useAppSelector(useWishedProducts);

  if (!currentUser || id !== currentUser._id) {
    return <NotFound />;
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <ScrollToTop />
      
      {/* Hero Header */}
      <div className="bg-gray-900 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px]" />
        </div>
        <div className="main-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-red-400 mb-4 animate-pulse">
                <FiHeart className="fill-current" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Saved Items</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter">
                Your <span className="text-orange-500">Wishlist</span>
              </h1>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Items</p>
              <p className="text-3xl font-black text-white leading-none">{wishedProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container mt-12">
        {wishedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishedProducts.map((product: TProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 relative">
              <FiHeart className="text-4xl text-gray-200" />
              <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full animate-spin-slow" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium">Seems like you haven't saved any items yet. Start exploring our collection and save what you love!</p>
            <Link to="/shop">
              <button className="group bg-gray-900 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl transition-all flex items-center gap-3">
                <FiShoppingBag className="text-base" />
                Start Shopping
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
