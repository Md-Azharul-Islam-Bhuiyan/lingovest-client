import ScrollToTop from '@/components/ui/ToTop';
import { useCurrentUser } from '@/redux/features/authSlice';
import {
  ClearPaymentInfoAfterMakingOrder,
  usePaymentCalculation,
} from '@/redux/features/paymentSlice';
import {
  MakeShoppingCartEmpty,
  useShoppingCartProducts,
} from '@/redux/features/shoppingCartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TCurrentUser, TPaymentProduct } from '@/types/commonTypes';

import { useCreateOrderMutation } from '@/redux/api/orderApi';
import { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import NotFound from './NotFound';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [mobile, setMobile] = useState('');
  const [ainfo, setAinfo] = useState('');
  const [loading, setLoading] = useState(false);

  const formData = {
    address,
    city,
    state,
    postalCode,
    country,
    mobile,
  };

  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector(useCurrentUser) as TCurrentUser;
  const shoppingCartProducts = useAppSelector(useShoppingCartProducts);
  const payments = useAppSelector(usePaymentCalculation);
  const dispatch = useAppDispatch();
  const [createOrder] = useCreateOrderMutation();

  const generatedOrderId = `${Math.floor(
    Math.random() * 999
  )}${currentUser?.email.slice(0, 7)}${Date.now().toString().slice(7, 11)}`;

  if (
    id !== currentUser._id ||
    shoppingCartProducts.length === 0 ||
    payments?.cartProducts.length === 0
  ) {
    return <NotFound />;
  }

  const handlePayment = async (data: any) => {
    if (currentUser?.role.toLowerCase() !== 'customer') {
      toast.error(
        'You are not authorized to place order. Please login with customer account.',
        {
          position: 'top-right',
          icon: '🚫',
          duration: 3000,
        }
      );
      return;
    }

    let orderData = {};

    if (
      address.trim().length < 2 ||
      city.trim().length < 2 ||
      state.trim().length < 2 ||
      postalCode.trim().length < 3 ||
      country.trim().length < 3 ||
      mobile.trim().length < 6
    ) {
      toast.error('Please fill all the shipping information forms properly.', {
        position: 'top-right',
        icon: '😢',
        duration: 1500,
      });
      return;
    } else {
      setLoading(true);
      orderData = {
        orderId: generatedOrderId,
        customerName: currentUser.name,
        orderBy: currentUser._id,
        products: payments.cartProducts.map((product: TPaymentProduct) => {
          return {
            id: product.productId,
            title: product.productTitle,
            price: product.productPrice,
            quantity: product.quantity,
            billForThisProduct: product.productPrice * product.quantity,
          };
        }),
        shippingInfo: data,
        paymentInfo: {
          method: 'sslcommerz',
          amount: payments.totalToBePaid,
        },
        isPaid: false,
        orderStatus: 'processing',
        billForThisOrder: payments.subtotal,
        appliedCoupon: payments.appliedCoupon,
        discountGiven: payments.discount,
        totalBill: payments.totalToBePaid,
      };
    }

    const response = await createOrder(orderData).unwrap();

    if (response?.data) {
      if (response.data.paymentUrl) {
        window.location.replace(response.data.paymentUrl);
      } else {
        window.location.replace(response.data);
      }
      setAinfo('');
      setAddress('');
      setCity('');
      setCountry('');
      setMobile('');
      setPostalCode('');
      setState('');
      setMobile('');
      setLoading(false);
      dispatch(ClearPaymentInfoAfterMakingOrder());
      dispatch(MakeShoppingCartEmpty());
    } else {
      toast.error('Failed to place order. Please try again!', {
        position: 'top-right',
        duration: 3000,
        icon: '🚫',
      });
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12 lg:pb-20">
      <ScrollToTop />
      <div className="main-container mt-12 md:mt-16 px-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          <div
            className="col-span-12 md:col-span-7 lg:col-span-8 space-y-10"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            {/* billing information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs font-black">1</span>
                <h4 className="text-gray-900 font-black uppercase tracking-widest text-sm">
                  Billing Information
                </h4>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm rounded-lg p-3 focus:outline-none cursor-not-allowed font-medium"
                    placeholder={currentUser?.name}
                    disabled={true}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm rounded-lg p-3 focus:outline-none cursor-not-allowed font-medium"
                    placeholder={currentUser?.email}
                    disabled={true}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="ainfo" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Additional Information</label>
                  <textarea
                    id="ainfo"
                    rows={3}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    placeholder="Gift message, special delivery instructions, etc."
                    value={ainfo}
                    onChange={(e) => setAinfo(e.target.value)}
                  />
                </div>
              </form>
            </section>

            {/* shipping information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs font-black">2</span>
                <h4 className="text-gray-900 font-black uppercase tracking-widest text-sm">
                  Shipping Information
                </h4>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm">
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="address" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Main St"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    id="city"
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">State / Province</label>
                  <input
                    type="text"
                    id="state"
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. NY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="postalCode" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 10001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Country</label>
                  <input
                    type="text"
                    id="country"
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="mobile" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="text"
                    id="mobile"
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. +1 123 456 7890"
                    required
                  />
                </div>
              </form>
            </section>

            {/* payment information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="size-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs font-black">3</span>
                <h4 className="text-gray-900 font-black uppercase tracking-widest text-sm">
                  Payment Method
                </h4>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-100 shadow-sm">
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
                  <p className="text-[11px] text-orange-700 leading-relaxed">
                    <strong className="font-black uppercase tracking-wider block mb-1">💡 Payment Notice:</strong>
                    I am using the free tier of SSLCommerz for this project. To complete payment, please click the "Success" button on the payment gateway page. Full automated flow will be available in the production version.
                  </p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="size-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    <div className="size-2.5 rounded-full bg-orange-400"></div>
                  </div>
                  <span className="font-bold text-gray-900">Secure Payment via SSLCommerz</span>
                </label>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-5 lg:col-span-4">
            <div 
              className="bg-white rounded-lg border border-gray-100 shadow-sm sticky top-24 overflow-hidden"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h4 className="font-black text-gray-900 text-base uppercase tracking-tight">Order Summary</h4>
              </div>
              
              <div className="p-6">
                {/* Products List */}
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {payments?.cartProducts.map((product: TPaymentProduct) => (
                    <div key={product?.productId} className="flex gap-4">
                      <div className="size-16 rounded-lg bg-gray-50 flex-shrink-0 border border-gray-100 p-2">
                        <img src={product?.productImage} alt={product?.productTitle} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 leading-relaxed">
                          {product?.productTitle}
                        </h5>
                        <p className="text-[11px] font-black text-gray-400">
                          {product.quantity} × <span className="text-orange-500">${product?.productPrice.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Details */}
                <div className="space-y-3 border-t border-gray-50 pt-6">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest">Sub-total</span>
                    <span className="text-gray-900">${payments?.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest">Shipping</span>
                    <span className="text-green-500 uppercase tracking-widest">Free</span>
                  </div>
                  {payments?.discount > 0 && (
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-400 uppercase tracking-widest">Discount</span>
                      <span className="text-green-500">-${payments?.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest">Tax</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <h5 className="font-black text-gray-900 uppercase tracking-[0.2em] text-xs">Grand Total</h5>
                    <h5 className="font-black text-gray-900 text-xl">${payments?.totalToBePaid.toFixed(2)}</h5>
                  </div>

                  <button
                    className="w-full bg-orange-400 hover:bg-orange-600 disabled:bg-gray-300 text-white font-black py-4 rounded-lg flex items-center justify-center gap-3 text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 mt-6"
                    onClick={() => handlePayment(formData)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : <><span className="flex items-center gap-2">Place Order <FaArrowRightLong /></span></>}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
