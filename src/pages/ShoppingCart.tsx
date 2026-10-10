/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import ScrollToTop from '@/components/ui/ToTop';
import { useGetAllCouponsQuery, useApplyCouponMutation } from '@/redux/api/couponApi';
import { useCurrentUser } from '@/redux/features/authSlice';
import { CalculateAmountToBePaid } from '@/redux/features/paymentSlice';
import {
  RemoveCartProductFromLocalState,
  useShoppingCartProducts,
} from '@/redux/features/shoppingCartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TCurrentUser, TProduct } from '@/types/commonTypes';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { FaArrowRightLong, FaTag } from 'react-icons/fa6';
import { PiEyeLight } from 'react-icons/pi';
import { RxCross2 } from 'react-icons/rx';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import NotFound from './NotFound';

const ShoppingCart = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser;
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [couponToBeApplied, setCouponToBeApplied] = useState<string>('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [couponApplying, setCouponApplying] = useState(false);

  const { data: couponsData } = useGetAllCouponsQuery('limit=50');
  const coupons: { code: string; discount: number }[] = couponsData?.data || [];
  const [applyCoupon] = useApplyCouponMutation();

  if (id !== currentUser._id) return <NotFound />;

  const dispatch = useAppDispatch();
  const shoppingCartProducts = useAppSelector(useShoppingCartProducts);

  const removeFromShoppingCart = (product: TProduct) => {
    dispatch(RemoveCartProductFromLocalState(product));
    toast.success('Product removed from shopping cart', { position: 'top-right', duration: 1500, icon: '🤔' });
  };

  const [productQuantities, setProductQuantities] = useState<{ [productId: string]: number }>(
    shoppingCartProducts.reduce<{ [productId: string]: number }>((acc, product) => {
      acc[product._id] = 1;
      return acc;
    }, {})
  );

  const updateProductQuantity = (productId: string, quantity: number) => {
    setProductQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleApplyCoupon = async () => {
    if (!couponToBeApplied.trim()) return;
    if (appliedCouponCode) {
      toast.error('A coupon is already applied. Remove it first.', { position: 'top-right', duration: 2000, icon: '⚠️' });
      return;
    }
    if (subtotal <= 0) {
      toast.error('Cart is empty.', { position: 'top-right', duration: 1500, icon: '⚠️' });
      return;
    }
    setCouponApplying(true);
    try {
      const result = await applyCoupon({ code: couponToBeApplied.trim(), totalAmount: subtotal }).unwrap();
      const { discountAmount, finalAmount, couponCode, discountPercentage } = result.data;
      setDiscount(discountAmount);
      setTotal(finalAmount);
      setAppliedCouponCode(couponCode);
      setCouponToBeApplied('');
      toast.success(`✅ Coupon "${couponCode}" applied — ${discountPercentage}% off!`, { position: 'top-right', duration: 2500 });
    } catch {
      // Error shown by baseApi interceptor
    } finally {
      setCouponApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setTotal(subtotal);
    setAppliedCouponCode('');
    toast.info('Coupon removed', { position: 'top-right', duration: 1000 });
  };

  // Recalculate subtotal & total when quantities/products change
  useEffect(() => {
    let newSubtotal = 0;
    shoppingCartProducts.forEach((product: TProduct) => {
      const discountedPrice = product.price - (product.price * (product.runningDiscount || 0)) / 100;
      newSubtotal += discountedPrice * (productQuantities[product._id] || 1);
    });
    setSubtotal(newSubtotal);
    if (appliedCouponCode) {
      // re-fetch coupon discount from existing discount %
      setTotal(newSubtotal - discount);
    } else {
      setTotal(newSubtotal);
    }
  }, [shoppingCartProducts, productQuantities]);

  // Sync payment state
  useEffect(() => {
    dispatch(
      CalculateAmountToBePaid({
        cartProducts: shoppingCartProducts.map((product: TProduct) => {
          const discountedPrice = product.price - (product.price * (product.runningDiscount || 0)) / 100;
          return {
            productId: product._id,
            productImage: product.displayImage,
            productTitle: product.title,
            quantity: productQuantities[product._id] || 1,
            productPrice: discountedPrice,
            billForThisProduct: discountedPrice * (productQuantities[product._id] || 1),
          };
        }),
        appliedCoupon: appliedCouponCode,
        discount,
        subtotal,
        totalToBePaid: total,
      })
    );
  }, [shoppingCartProducts, productQuantities, discount, total, appliedCouponCode, subtotal]);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <ScrollToTop />

      {/* Coupon Marquee */}
      {shoppingCartProducts.length > 0 && coupons.length > 0 && (
        <div className="bg-white border-b border-gray-100 py-2">
          <div className="main-container flex items-center gap-3">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest whitespace-nowrap border border-orange-200 px-2 py-0.5 rounded-full">
              🏷️ Offers
            </span>
            <Marquee speed={40} pauseOnHover>
              {coupons.map((c) => (
                <span key={c.code} className="text-sm text-gray-600 mx-8">
                  Use code <span className="font-black text-orange-500 tracking-wider">{c.code}</span> to get{' '}
                  <span className="font-black text-orange-500">{c.discount}% OFF</span>
                </span>
              ))}
            </Marquee>
          </div>
        </div>
      )}

      <div className="main-container py-10">
        {shoppingCartProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Cart Items */}
            <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-4">
              {/* Desktop Table Header (hidden on mobile) */}
              <div className="hidden lg:grid grid-cols-12 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Subtotal</div>
                <div className="col-span-1 text-center"></div>
              </div>

              {shoppingCartProducts.map((product: TProduct) => {
                const discountedPrice = product.price - (product.price * (product.runningDiscount || 0)) / 100;
                const qty = productQuantities[product._id] || 1;
                
                return (
                  <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6 transition-all hover:border-orange-200">
                    {/* Mobile View */}
                    <div className="flex lg:hidden flex-col gap-4">
                      <div className="flex gap-4">
                        <img src={product.displayImage} alt={product.title} className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-2" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{product.title}</h5>
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500 font-black">${discountedPrice.toFixed(2)}</span>
                            {product.runningDiscount > 0 && (
                              <span className="text-gray-400 line-through text-[10px]">${product.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button 
                            onClick={() => qty > 1 && updateProductQuantity(product._id, qty - 1)}
                            className="px-3 py-1 text-gray-500 font-black hover:bg-gray-100 transition-colors"
                          >−</button>
                          <span className="w-8 text-center text-xs font-black">{qty}</span>
                          <button 
                            onClick={() => updateProductQuantity(product._id, qty + 1)}
                            className="px-3 py-1 text-gray-500 font-black hover:bg-gray-100 transition-colors"
                          >+</button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-gray-900">${(discountedPrice * qty).toFixed(2)}</span>
                          <button 
                            onClick={() => removeFromShoppingCart(product)}
                            className="size-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          ><RxCross2 /></button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop View (Table-like grid) */}
                    <div className="hidden lg:grid grid-cols-12 items-center gap-4 text-sm">
                      <div className="col-span-5 flex items-center gap-4">
                        <img src={product.displayImage} alt={product.title} className="w-14 h-14 object-contain rounded-xl bg-gray-50 p-2" />
                        <Link to={`/product/${product._id}`} className="font-bold text-gray-800 hover:text-orange-500 transition-colors truncate">
                          {product.title}
                        </Link>
                      </div>
                      <div className="col-span-2 text-center font-bold">
                        <div className="flex flex-col items-center">
                          <span className="text-gray-900">${discountedPrice.toFixed(2)}</span>
                          {product.runningDiscount > 0 && (
                            <span className="text-gray-400 line-through text-[10px]">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => qty > 1 && updateProductQuantity(product._id, qty - 1)}
                            className="px-2 py-1.5 hover:bg-gray-50 font-black text-gray-600 transition-colors"
                          >−</button>
                          <span className="w-8 text-center font-black text-xs">{qty}</span>
                          <button 
                            onClick={() => updateProductQuantity(product._id, qty + 1)}
                            className="px-2 py-1.5 hover:bg-gray-50 font-black text-gray-600 transition-colors"
                          >+</button>
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-black text-gray-900">
                        ${(discountedPrice * qty).toFixed(2)}
                      </div>
                      <div className="col-span-1 flex justify-center gap-2">
                        <button 
                          onClick={() => removeFromShoppingCart(product)}
                          className="size-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        ><RxCross2 /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col gap-4">
              {/* Cart Total */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h4 className="font-black text-gray-900 text-base uppercase tracking-tight">Cart Total</h4>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Sub-total</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="font-bold text-green-600">Free</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1"><FaTag className="text-orange-400 text-xs" /> Coupon discount</span>
                      <span className="font-bold text-green-600">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span className="font-bold">$0.00</span></div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-black text-gray-900 uppercase tracking-wide text-sm">Total</span>
                    <span className="font-black text-gray-900 text-lg">${total.toFixed(2)}</span>
                  </div>
                  <Link to={`/${currentUser?._id}/check-out`}>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 mt-2">
                      Proceed to Checkout <FaArrowRightLong />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Coupon */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h4 className="font-black text-gray-900 text-base uppercase tracking-tight">Coupon Code</h4>
                </div>
                <div className="px-6 py-4 space-y-3">
                  {appliedCouponCode ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-green-500" />
                        <span className="text-sm font-black text-green-700 tracking-wider">{appliedCouponCode}</span>
                        <span className="text-xs text-green-600">applied!</span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors"><RxCross2 /></button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 uppercase tracking-wider font-bold"
                        value={couponToBeApplied}
                        onChange={(e) => setCouponToBeApplied(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponApplying || !couponToBeApplied.trim()}
                        className="w-full bg-gray-900 disabled:bg-gray-300 hover:bg-orange-500 text-white font-black py-2.5 rounded-xl text-sm uppercase tracking-widest transition-all"
                      >
                        {couponApplying ? 'Validating...' : 'Apply Coupon'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96" data-aos="zoom-in">
            <div className="size-24 rounded-full bg-orange-50 flex items-center justify-center mb-6 text-4xl">🛒</div>
            <h4 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h4>
            <p className="text-gray-400 text-sm mb-6">Add some products to get started!</p>
            <Link to="/products">
              <button className="bg-orange-500 text-white font-black py-3 px-8 rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest text-sm">Shop Now</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
