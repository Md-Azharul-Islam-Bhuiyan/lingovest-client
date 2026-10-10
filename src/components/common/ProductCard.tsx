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
import { BsCart2 } from 'react-icons/bs';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { IoHeart } from 'react-icons/io5';
import { PiEyeLight, PiShoppingCartSimpleFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  product: TProduct;
  /** 
   * grid  — full vertical card (default, for grids) 
   * compact — horizontal mini-card (for Collections section)
   */
  variant?: 'grid' | 'compact';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const dispatch = useAppDispatch();
  const wishList = useAppSelector(useWishedProducts);
  const shoppingCart = useAppSelector(useShoppingCartProducts);

  const isInWishList = !!wishList.find((item) => item?._id === product?._id);
  const isInCart = !!shoppingCart.find((item) => item?._id === product?._id);

  const discountedPrice =
    product?.runningDiscount > 0
      ? product.price - (product.price * product.runningDiscount) / 100
      : product?.price;

  const handleWishList = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishList) {
      dispatch(RemoveWishedProductFromLocalState(product));
      toast.success('Removed from wishlist', { position: 'top-right', duration: 1200, icon: '🤔' });
    } else {
      dispatch(setWishedProductsInLocalState(product));
      toast.success('Added to wishlist!', { position: 'top-right', duration: 1200, icon: '😍' });
    }
  };

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInCart) {
      dispatch(RemoveCartProductFromLocalState(product));
      toast.success('Removed from cart', { position: 'top-right', duration: 1200, icon: '🤔' });
    } else {
      dispatch(setCartProductsInLocalState(product));
      toast.success('Added to cart!', { position: 'top-right', duration: 1200, icon: '🛒' });
    }
  };

  /* ─────────── COMPACT variant (horizontal row) ─────────── */
  if (variant === 'compact') {
    return (
      <Link to={`/product/${product?._id}`} className="block group">
        <div className="flex items-center gap-4 p-3 rounded-lg bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200">
          {/* Image */}
          <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
            <img
              src={product?.displayImage}
              alt={product?.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            {product?.runningDiscount > 0 && (
              <span className="absolute top-0 left-0 bg-orange-400 text-white text-[8px] font-black px-1 py-0.5 rounded-br-lg leading-none">
                -{product.runningDiscount}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
              {product?.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-black text-gray-900">${discountedPrice.toFixed(2)}</span>
              {product?.runningDiscount > 0 && (
                <span className="text-[10px] text-gray-400 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleWishList}
              className="size-7 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            >
              {isInWishList ? <IoHeart className="text-red-500" /> : <CiHeart />}
            </button>
            <button
              onClick={handleCart}
              className="size-7 rounded-lg bg-gray-50 hover:bg-orange-50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors"
            >
              {isInCart ? <PiShoppingCartSimpleFill className="text-orange-500" /> : <BsCart2 />}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  /* ─────────── GRID variant (default full card) ─────────── */
  return (
    <Link to={`/product/${product?._id}`} className="block group">
      <div className="w-full relative bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product?.runningDiscount > 0 && (
            <span className="bg-orange-400 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
              -{product.runningDiscount}% OFF
            </span>
          )}
          {product?.stock !== undefined && (
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${
              product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>

        {/* Wishlist button (always visible top-right) */}
        <button
          onClick={handleWishList}
          className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm hover:border-red-300 hover:text-red-500 transition-all"
        >
          {isInWishList ? <IoHeart className="text-red-500 text-sm" /> : <CiHeart className="text-gray-500 text-sm" />}
        </button>

        {/* Image zone */}
        <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden px-4 pt-4">
          <img
            src={product?.displayImage}
            alt={product?.title}
            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
         
          <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={handleCart}
              className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all -translate-y-2 group-hover:translate-y-0 duration-300"
            >
              {isInCart ? <><PiShoppingCartSimpleFill />Added</> : <><BsCart2 />Add to Cart</>}
            </button>
            <button
              className="bg-white/90 text-gray-800 text-lg rounded-lg w-9 h-9 flex items-center justify-center shadow-lg hover:bg-white transition-all -translate-y-2 group-hover:translate-y-0 duration-[400ms]"
            >
              <PiEyeLight />
            </button>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 flex flex-col">
          {/* Brand & Category */}
          {(product?.brand?.name || product?.category?.name) && (
            <div className="flex items-center gap-2 mb-1.5">
              {product?.brand?.name && (
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {product.brand.name}
                </span>
              )}
              {product?.category?.name && (
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full">
                  {product.category.name}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors mb-2 flex-1">
            {product?.title}
          </h3>

          {/* Rating (static 5 stars for now, dynamic when reviews linked) */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              star <= 4
                ? <FaStar key={star} className="text-orange-400 text-[10px]" />
                : <FaRegStar key={star} className="text-gray-300 text-[10px]" />
            ))}
            <span className="text-[9px] text-gray-400 font-bold ml-0.5">(4.0)</span>
          </div>

          {/* Price block */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-black text-gray-900 leading-none">${discountedPrice.toFixed(2)}</p>
              {product?.runningDiscount > 0 && (
                <p className="text-xs text-gray-400 line-through leading-none mt-0.5">${product.price.toFixed(2)}</p>
              )}
            </div>
            {product?.stock !== undefined && product.stock > 0 && product.stock <= 10 && (
              <span className="text-[9px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
