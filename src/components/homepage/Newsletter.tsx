import { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import amazon from '../../assets/images/Frame.png';
import google from '../../assets/images/google-2015 1.png';
import philips from '../../assets/images/philips 1.png';
import samsung from '../../assets/images/samsung-4 1.png';
import toshiba from '../../assets/images/toshiba-1 1.png';

const partners = [
  { src: amazon, alt: 'Amazon' },
  { src: google, alt: 'Google' },
  { src: philips, alt: 'Philips' },
  { src: samsung, alt: 'Samsung' },
  { src: toshiba, alt: 'Toshiba' },
];

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="newsletter-bg">
      <div className="relative z-10 main-container py-16 lg:py-20 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
          <HiOutlineMail className="text-white text-base" />
          <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">Newsletter</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white text-center leading-tight mb-3">
          Stay Ahead of the Deals
        </h2>
        <p className="text-blue-200 text-sm md:text-base text-center max-w-lg mb-8 leading-relaxed">
          Subscribe for exclusive offers, early access to new arrivals, and curated picks — delivered straight to your inbox.
        </p>

        {/* Form */}
        <div className="w-full max-w-lg mb-10 px-4 sm:px-0">
          {submitted ? (
            <div className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-5 px-8">
              <p className="text-white font-semibold text-lg">🎉 You're subscribed!</p>
              <p className="text-blue-200 text-sm mt-1">Check your inbox for a welcome gift.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0 shadow-2xl rounded-lg overflow-hidden md:overflow-visible">
              <div className="flex-1 flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-r-none md:border-r-0 px-4 gap-3">
                <HiOutlineMail className="text-white/60 text-xl flex-shrink-0" />
                <input
                  type="email"
                  className="flex-1 bg-transparent py-4 text-sm text-white placeholder-white/50 focus:outline-none"
                  placeholder="Enter your email address..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn-premium px-8 py-4 text-sm rounded-lg md:rounded-none md:rounded-r-lg font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Subscribe <FaArrowRightLong className="text-xs" />
              </button>
            </form>
          )}
          <p className="text-blue-300/60 text-xs text-center mt-3">No spam, unsubscribe anytime.</p>
        </div>

        {/* Divider */}
        <div className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Partner Logos */}
        <p className="text-blue-200/60 text-xs uppercase tracking-widest font-semibold mb-5">Trusted by world-class brands</p>
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {partners.map((p) => (
            <img
              key={p.alt}
              src={p.src}
              alt={p.alt}
              className="h-7 md:h-9 w-auto object-contain opacity-50 hover:opacity-90 grayscale hover:grayscale-0 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
