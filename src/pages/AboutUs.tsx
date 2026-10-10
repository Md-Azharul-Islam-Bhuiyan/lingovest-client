import CoreTeamMember from '@/components/about/CoreTeamMember';
import Collections from '@/components/homepage/Collections';
import Newsletter from '@/components/homepage/Newsletter';
import ScrollToTop from '@/components/ui/ToTop';
import { useGetProductsQuery } from '@/redux/api/productApi';
import buttonimg from '../assets/images/about/Button.png';
import greenCheck from '../assets/images/about/Checks.svg';
import aboutusImg from '../assets/images/about/about-header.png';
import Styles from '../styles/aboutus.module.css';

const AboutUs = () => {
  const { data, isLoading } = useGetProductsQuery(undefined);
  const products = data?.data?.data;

  return (
    <div className="bg-white min-h-screen pb-16">
      <ScrollToTop />
      {/* About Us Header */}
      <div className="py-12 md:py-20 lg:py-24 overflow-hidden border-b border-gray-100">
        <div className="main-container px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-12 items-center gap-y-12 md:gap-y-0">
            <div
              className="col-span-12 md:col-span-6"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="inline-block bg-orange-500/10 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                Who We Are
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                Shopora - Global <span className="text-orange-500">Marketplace</span> for Premium Electronics.
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                We bridge the gap between quality and affordability, bringing world-class technology to your doorstep. Our mission is to empower every individual with the best tools for their digital life.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  '24/7 Premium Support',
                  '600+ Expert Employees',
                  '50+ Global Branches',
                  '1M+ Verified Products'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <img src={greenCheck} alt="check" className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-gray-700 text-sm font-bold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="col-span-12 md:col-span-6 relative"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              <div className="absolute inset-0 bg-orange-500/5 rounded-full blur-[120px] -z-10" />
              <img
                src={aboutusImg}
                alt="About Us"
                className="w-full h-72 md:h-96 lg:h-[450px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Core Team Member */}
      <CoreTeamMember />

      {/* Trust Banner */}
      <div className="bg-gray-900 py-20 lg:py-24 mt-16 md:mt-24">
        <div className="main-container px-5 text-center md:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h3 className="text-white font-black text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                Your trusted and reliable <br /> <span className="text-orange-500">ecommerce partner.</span>
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
                Join thousands of satisfied customers who trust Shopora for their tech needs. We provide not just products, but peace of mind with every purchase through our secure systems and dedicated team.
              </p>
            </div>
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                  <p className="text-2xl font-black text-white mb-1">99%</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Satisfaction</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                  <p className="text-2xl font-black text-white mb-1">24/7</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container py-20 px-5">
        {!isLoading && <Collections products={products} />}
      </div>
      <Newsletter />
    </div>
  );
};

export default AboutUs;
