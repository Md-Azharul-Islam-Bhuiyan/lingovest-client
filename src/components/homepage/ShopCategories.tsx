import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi';
import { categoriesData } from '@/utils/demoDataForHome';
import { FaFire } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const ShopCategories = () => {
  const { data, isLoading } = useGetAllCategoriesQuery(undefined);
  const categories = data?.data || categoriesData;

  if (isLoading) {
    return (
      <div className="mt-14 lg:mt-20">
        <div className="text-center mb-10">
          <div className="shimmer h-4 w-32 rounded mx-auto mb-3" />
          <div className="shimmer h-8 w-56 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="shimmer rounded-2xl h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 lg:mt-20" data-aos="fade-up" data-aos-duration="700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
         <div>
            <div className="section-label mb-2">
              <FaFire className="text-orange-500 text-xs" />
              Browse Range
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-custom-black">
              Shop by <span className="gradient-text">Category</span>
            </h2>
          </div>
          <div>
            <Link to="/category">
              <button className="text-sm font-semibold text-bluish flex items-center gap-1.5 hover:gap-2.5 transition-all duration-300">
                View All <FaArrowRightLong className="text-xs" />
              </button>
            </Link>
          </div>
        </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-5">
        {categories?.slice(0, 6)?.map((category: any, i: number) => (
          <Link
            to={`/products?category=${category._id || category.id}`}
            key={category._id || category.id}
            data-aos="zoom-in"
            data-aos-delay={i * 60}
          >
            <div className="category-card flex flex-col items-center gap-3 py-5 px-3">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="cat-img w-11 h-11 object-cover"
                />
              </div>
              <p className="text-xs font-semibold text-custom-black text-center leading-tight">
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopCategories;
