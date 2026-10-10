import Loader from '@/components/common/Loader';
import Magnifier from '@/components/common/Magnifyer';
import Collections from '@/components/homepage/Collections';
import ScrollToTop from '@/components/ui/ToTop';
import {
  useGetProductsQuery,
  useGetSingleProductQuery,
} from '@/redux/api/productApi';
import { useGetProductReviewsQuery, useCreateReviewMutation } from '@/redux/api/reviewApi';
import { useCurrentUser } from '@/redux/features/authSlice';
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
import { TProduct, TProductWithVendorDetails } from '@/types/commonTypes';
import { useState } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { CiHeart } from 'react-icons/ci';
import {
  FaClipboardCheck,
  FaFacebook,
  FaStar,
  FaRegStar,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa';
import { IoHeart } from 'react-icons/io5';
import { PiWarningDiamondThin } from 'react-icons/pi';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import paymentmethods from '../assets/images/Payment Method.png';
import NotFound from './NotFound';

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState('description');
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetSingleProductQuery(id);
  const product: TProductWithVendorDetails = data?.data;
  
  const currentUser = useAppSelector(useCurrentUser) as any;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const { data: reviewData } = useGetProductReviewsQuery(id as string, { skip: !id });
  const reviews = reviewData?.data || [];
  const [createReview, { isLoading: isReviewSubmitting }] = useCreateReviewMutation();

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return toast.error('Please login to leave a review.');
    if (rating === 0) return toast.error('Please select a rating.');
    try {
      await createReview({ userId: currentUser._id, productId: id, rating, comment }).unwrap();
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to submit review');
    }
  };

  const averageRating = reviews.length ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0';
  
  const cleanMarkdown = (text: string) => {
    if (!text) return '';
    return text.replace(/[\*#_~`>]/g, '').trim();
  };

  const { data: allData, isLoading: isAllProductLoading } =
    useGetProductsQuery(undefined);
  const products = allData?.data?.data;

  const dispatch = useAppDispatch();
  const wishList = useAppSelector(useWishedProducts);
  const isProductInWishList = wishList.find(
    (item) => item?._id === product?._id
  );

  const wishListHandler = (product: TProduct) => {
    // check if product is already in wishlist
    const isProductInWishList = wishList.find(
      (item) => item?._id === product?._id
    );

    if (isProductInWishList) {
      dispatch(RemoveWishedProductFromLocalState(product));
      toast.success('Product removed from wishlist', {
        position: 'top-right',
        duration: 1500,
        icon: '🤔',
      });
    }
    if (!isProductInWishList) {
      dispatch(setWishedProductsInLocalState(product));
      toast.success('Product added in the wishlist!', {
        position: 'top-right',
        duration: 1500,
        icon: '😍',
      });
    }
  };

  const shoppingCart = useAppSelector(useShoppingCartProducts);
  const isProductInCart = shoppingCart.find(
    (item) => item?._id === product?._id
  );

  const addProducttoShoppingCart = (product: TProduct) => {
    dispatch(setCartProductsInLocalState(product));
    toast.success('Product added to the shopping cart', {
      position: 'top-right',
      duration: 1500,
      icon: '😍',
    });
  };

  const removeProductFromCart = (product: TProduct) => {
    dispatch(RemoveCartProductFromLocalState(product));
    toast.success('Product removed from cart', {
      position: 'top-right',
      duration: 1500,
      icon: '🤔',
    });
  };

  if (isLoading)
    return (
      <div>
        <ScrollToTop />
        <Loader />
      </div>
    );

  if (isError) {
    return <NotFound />;
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <ScrollToTop />
      {/* product details */}
      <div className="main-container pt-8 pb-4 grid grid-cols-1 md:grid-cols-12 md:gap-x-8 lg:gap-x-12 gap-y-6 md:gap-y-0 px-5">

        {/* LEFT — Image Column */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 lg:p-8">
            {/* Desktop magnifier */}
            <div className="hidden lg:block">
              <Magnifier
                imageUrl={product?.displayImage}
                largeImageUrl={product?.displayImage}
                zoomFactor={2}
                imgAlt={product?.title}
                glassDimension={400}
                glassBorderColor="#f97316"
                glassBorderWidth={2}
              />
            </div>
            {/* Tablet/Mobile magnifier */}
            <div className="lg:hidden">
              <Magnifier
                imageUrl={product?.displayImage}
                largeImageUrl={product?.displayImage}
                zoomFactor={2}
                imgAlt={product?.title}
                glassDimension={window.innerWidth >= 768 ? 350 : Math.min(window.innerWidth - 80, 250)}
                glassBorderColor="#f97316"
                glassBorderWidth={2}
              />
            </div>
          </div>

          {/* Wishlist + Share row */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-1 gap-y-4 sm:gap-y-0">
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-orange-400 hover:text-orange-500 transition-all shadow-sm"
              onClick={() => wishListHandler(product as any)}
            >
              {isProductInWishList ? (
                <><IoHeart className="text-orange-500" /><span>Wishlisted</span></>
              ) : (
                <><CiHeart /><span>Add to Wishlist</span></>
              )}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share:</span>
              <div className="flex gap-2.5">
                <Link to="https://facebook.com/#" target="_blank">
                  <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <FaFacebook className="text-blue-600 text-sm" />
                  </div>
                </Link>
                <Link to="https://twitter.com/#" target="_blank">
                  <div className="size-8 rounded-full bg-sky-50 flex items-center justify-center hover:bg-sky-100 transition-colors">
                    <FaTwitter className="text-sky-500 text-sm" />
                  </div>
                </Link>
                <Link to="https://api.whatsapp.com" target="_blank">
                  <div className="size-8 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors">
                    <FaWhatsapp className="text-green-500 text-sm" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT — Product Info Column */}
        <div className="col-span-12 md:col-span-6" data-aos="fade-down" data-aos-duration="1000">

          {/* Rating Row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(Number(averageRating)) ? "text-orange-400 text-sm" : "text-gray-200 text-sm"} />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-800">{averageRating}</span>
            <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
            {product?.title}
          </h1>

          {/* Meta Chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-gray-400"></span>
              {product?.brand?.name}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-blue-400"></span>
              {product?.category?.name}
            </span>
            {product?.subCategory?.name && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {product.subCategory.name}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              product?.stock > 0
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-500'
            }`}>
              <span className={`size-1.5 rounded-full animate-pulse ${product?.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Price Block */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Selling Price</p>
                <p className="text-3xl sm:text-4xl font-black text-gray-900">
                  ${(product?.price - (product?.price * (product?.runningDiscount || 0)) / 100).toFixed(2)}
                </p>
              </div>
              {product?.runningDiscount > 0 && (
                <div className="flex flex-col items-start gap-1 mb-1">
                  <span className="text-sm text-gray-400 line-through">${product?.price}</span>
                  <span className="text-xs font-black bg-orange-500 text-white px-2 py-0.5 rounded-full">{product?.runningDiscount}% OFF</span>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex gap-4 text-xs text-gray-500">
              <span>Released: <strong className="text-gray-700">{product?.releaseDate}</strong></span>
              <span>Sold by: <strong className="text-gray-700">{product?.vendor?.email}</strong></span>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
              Key Features
            </h4>
            {product?.features ? (
              <div
                className="product-rich-text text-sm leading-relaxed text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.features }}
              />
            ) : (
              <p className="text-gray-400 text-sm italic">Standard features apply for this product.</p>
            )}
            <button
              onClick={() => {
                const element = document.getElementById('product-tabs');
                element?.scrollIntoView({ behavior: 'smooth' });
                setActiveTab('description');
              }}
              className="text-orange-500 hover:text-orange-600 text-xs font-black uppercase tracking-widest mt-3 flex items-center gap-1 hover:underline"
            >
              View Full Description →
            </button>
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${Math.min((product?.stock / 100) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs font-black text-gray-500 whitespace-nowrap">
              <span className="text-orange-400">{product?.stock}</span> units left
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            {isProductInCart ? (
              <button
                className="flex-1 bg-orange-400 text-white font-black py-4 rounded-lg shadow-lg shadow-gray-900/20 hover:bg-orange-500 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                onClick={() => removeProductFromCart(product as any)}
              >
                <FaClipboardCheck className="text-green-400" />
                Added to Cart
              </button>
            ) : (
              <button
                className="flex-1 bg-orange-400 text-white font-black py-4 rounded-lg shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                onClick={() => addProducttoShoppingCart(product as any)}
              >
                <BsCart2 className="text-lg" />
                Add to Cart
              </button>
            )}
          </div>

          {/* Safe Checkout */}
          <div className="border border-dashed border-gray-200 rounded-2xl py-4 px-5 flex items-center justify-between bg-white">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">🔒 100% Secure Checkout</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Encrypted & protected payment</p>
            </div>
            <img src={paymentmethods} alt="payment methods" className="h-4 object-contain" />
          </div>
        </div>
      </div>
      {/* product description and reviews */}
      <div
        id="product-tabs"
        className="main-container mt-10 md:mt-16 pb-10"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        {/* Tab Pills */}
        <div className="flex items-center flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
          {[
            { key: 'description', label: 'Description' },
            { key: 'shipping', label: 'Shipping Info' },
            { key: 'reviews', label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-orange-400 text-white shadow-lg'
                  : 'bg-white text-gray-500 border border-orange-500 hover:border-orange-500 hover:text-orange-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 md:p-10 min-h-[300px]">
          {activeTab === 'description' && (
            <div className="animate-fadeIn">
              <h4 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1 h-5 bg-orange-500 rounded-full inline-block"></span>
                Product Description
              </h4>
              <div
                className="text-gray-600 text-sm md:text-base leading-relaxed product-rich-text"
                dangerouslySetInnerHTML={{ __html: product?.description || '' }}
              />
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="animate-fadeIn">
              <h4 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1 h-5 bg-orange-500 rounded-full inline-block"></span>
                Shipping Information
              </h4>
              {product?.shippingInfo ? (
                <div
                  className="product-rich-text text-gray-600 leading-relaxed text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: product.shippingInfo }}
                />
              ) : (
                <div className="max-w-md space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Standard Delivery</span>
                    <span className="font-black uppercase text-xs text-gray-800">2–4 Days</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Express Delivery</span>
                    <span className="font-black uppercase text-xs text-gray-800">Next Day</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fadeIn py-6">
              <h4 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1 h-5 bg-orange-500 rounded-full inline-block"></span>
                Customer Reviews
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Reviews List */}
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.length > 0 ? (
                    reviews.map((r: any) => (
                      <div key={r.id} className="border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-3 mb-2">
                          {r.user?.profileImage ? (
                            <img src={r.user.profileImage} alt={r.user.name} className="size-10 rounded-full object-cover" />
                          ) : (
                            <div className="size-10 rounded-full bg-orange-100 text-orange-600 font-black flex items-center justify-center text-lg">
                              {r.user?.name?.charAt(0) || 'A'}
                            </div>
                          )}
                          <div>
                            <h5 className="text-sm font-black text-gray-800">{r.user?.name || 'Anonymous'}</h5>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={i < r.rating ? "text-orange-400 text-[10px]" : "text-gray-200 text-[10px]"} />
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {r.comment && <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>}
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
                      <FaStar className="text-gray-300 text-3xl mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-bold">No reviews yet.</p>
                      <p className="text-xs text-gray-400">Be the first to review this product!</p>
                    </div>
                  )}
                </div>

                {/* Write Review Form */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
                  <h5 className="font-black text-gray-900 text-base uppercase tracking-widest mb-4">Write a Review</h5>
                  {!currentUser ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500 mb-3">You must be logged in to leave a review.</p>
                      <Link to="/login">
                        <button className="bg-orange-500 text-white font-black text-xs uppercase px-6 py-2 rounded-lg">Login Now</button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rating</label>
                        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              className="text-2xl transition-transform hover:scale-110"
                            >
                              {(hoverRating || rating) >= star ? (
                                <FaStar className="text-orange-400" />
                              ) : (
                                <FaRegStar className="text-gray-300" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comment (Optional)</label>
                        <textarea
                          rows={4}
                          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
                          placeholder="What did you like or dislike?"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isReviewSubmitting}
                        className="w-full bg-gray-900 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all disabled:opacity-50"
                      >
                        {isReviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isAllProductLoading && (
        <div className="my-8 md:my-20 main-container">
          <Collections products={products} />
        </div>
      )}
    </div>
  );
};


const styles = `
  .product-rich-text p {
    margin-bottom: 0.75rem;
  }
  .product-rich-text ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  .product-rich-text ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  .product-rich-text li {
    margin-bottom: 0.25rem;
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}

export default ProductDetails;
