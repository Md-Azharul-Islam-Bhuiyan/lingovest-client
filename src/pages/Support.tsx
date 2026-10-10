import ScrollToTop from '@/components/ui/ToTop';
import { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { toast } from 'sonner';
import emailus from '../assets/images/ChatCircleDotss.png';
import callus from '../assets/images/PhoneCall.png';
import supportImage from '../assets/images/support.svg';
import creditCard from '../assets/images/support/CreditCard.png';
import lockopen from '../assets/images/support/LockOpen.png';
import notepad from '../assets/images/support/Notepad.png';
import stack from '../assets/images/support/Stack.png';
import storefront from '../assets/images/support/Storefront.png';
import truckImg from '../assets/images/support/Truck.png';
import user from '../assets/images/support/User.png';

const supportOptions = [
  {
    id: 1,
    img: truckImg,
    title: 'Track Order',
  },
  {
    id: 2,
    img: creditCard,
    title: 'Payment Options',
  },
  {
    id: 3,
    img: lockopen,
    title: 'Return Policy',
  },
  {
    id: 4,
    img: notepad,
    title: 'Warranty',
  },
  {
    id: 5,
    img: stack,
    title: 'FAQs',
  },
  {
    id: 6,
    img: storefront,
    title: 'Store Locator',
  },
  {
    id: 7,
    img: user,
    title: 'My Account',
  },
  {
    id: 8,
    img: creditCard,
    title: 'My Account',
  },
];

const Support = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.error('This feature is not avilable yet!', {
      position: 'top-right',
      duration: 1500,
      icon: '🚧',
    });
    setSearch('');
  };

  return (
    <div className="bg-white min-h-screen">
      <ScrollToTop />
      {/* header Section */}
      <div className="bg-gray-900 py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        <div className="main-container relative z-10 px-5 text-center">
          <div
            className="max-w-3xl mx-auto"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Help Center
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
              How can we <span className="text-orange-500 underline decoration-4 decoration-orange-500/30 underline-offset-8">assist</span> you today?
            </h1>
            <form className="relative max-w-2xl mx-auto group" onSubmit={handleSearch}>
              <input
                type="text"
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 lg:py-6 px-6 lg:px-8 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all backdrop-blur-md"
                placeholder="Search for answers, tracking, or support topics..."
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest px-6 lg:px-8 py-3 lg:py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Support Categories Section */}
      <div className="py-16 md:py-24 lg:py-32 bg-[#f8fafc]">
        <div className="main-container px-5">
          <div className="text-center mb-12 lg:mb-20" data-aos="fade-up" data-aos-duration="1000">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4">Common Support Topics</h2>
            <p className="text-gray-500 text-sm md:text-base">Quickly find help by selecting a category below.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {supportOptions.map((option) => (
              <div
                key={option.id}
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer text-center"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <div className="size-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <img src={option.img} alt={option.title} className="size-8 object-contain" />
                </div>
                <h3 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-1">{option.title}</h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Learn More →</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="main-container px-5">
          <div className="text-center mb-12 lg:mb-20" data-aos="fade-up" data-aos-duration="1000">
            <span className="inline-block bg-blue-500/10 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              Contact Us
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              Didn't find your answer? <br /> Our experts are here to help.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Call Support */}
            <div
              className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <img src={callus} alt="call" className="size-10 object-contain" />
              </div>
              <h3 className="text-gray-900 font-black text-xl mb-4">Call Support</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Available online from 9:00 AM to 5:00 PM (GMT +6). Talk with us directly for instant solutions.
              </p>
              <h4 className="text-gray-900 font-black text-lg mb-8 tracking-wider">+880-1740-020464</h4>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3">
                Start Call <FaArrowRightLong />
              </button>
            </div>

            {/* Chat Support */}
            <div
              className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl hover:shadow-green-500/5 transition-all"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              <div className="size-20 rounded-full bg-green-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <img src={emailus} alt="email" className="size-10 object-contain" />
              </div>
              <h3 className="text-gray-900 font-black text-xl mb-4">Chat with Us</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Prefer writing? Drop us a message anytime and we'll get back to you within 2 business hours.
              </p>
              <h4 className="text-gray-900 font-black text-lg mb-8 tracking-wider">support@shopora.com</h4>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-3">
                Send Message <FaArrowRightLong />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
