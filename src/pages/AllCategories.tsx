import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi';
import { TCategory } from '@/types/commonTypes';
import { Link } from 'react-router-dom';
import ScrollToTop from '@/components/ui/ToTop';
import { FaArrowRightLong } from 'react-icons/fa6';

const AllCategories = () => {
  const { data: categoryData, isLoading } = useGetAllCategoriesQuery(undefined);
  const categories: TCategory[] = categoryData?.data || [];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <ScrollToTop />
      
      {/* Header Banner */}
      <div className="bg-gray-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        <div className="main-container relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
            Browse <span className="text-orange-500 underline decoration-4 decoration-orange-500/30 underline-offset-8">Categories</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm lg:text-base font-medium">
            Find exactly what you're looking for by exploring our curated collections.
          </p>
        </div>
      </div>

      <div className="main-container py-12 lg:py-20">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categories.map((category: TCategory) => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.name}`}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="size-20 lg:size-24 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden p-4 group-hover:bg-orange-50 transition-colors">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Explore</span>
                    <FaArrowRightLong className="text-[10px] text-orange-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategories;
