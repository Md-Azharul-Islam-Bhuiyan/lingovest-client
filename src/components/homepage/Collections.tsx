import ProductCard from '../common/ProductCard';
import { TProduct } from '@/types/commonTypes';

interface CollectionsProps {
  products: TProduct[];
}

const Collections: React.FC<CollectionsProps> = ({ products }) => {
  const newArrival: TProduct[] = products?.slice(0, 3) || [];
  const bestSellers: TProduct[] = products?.slice(3, 6) || [];
  const topRated: TProduct[] = products?.slice(6, 9) || [];
  const flashSaleToday: TProduct[] = products?.slice(9, 12) || [];

  return (
    <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:px-12 gap-x-6 gap-y-10">
      {/* flash sale today */}
      <div
        className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h4 className="text-custom-black font-bold tracking-wider mb-6 uppercase text-sm border-b-2 border-orange-400 inline-block pb-1">
          Flash Sale Today
        </h4>
        <div className="flex flex-col gap-4">
          {flashSaleToday?.map((product: TProduct) => (
            <ProductCard key={product?._id} product={product} variant="compact" />
          ))}
        </div>
      </div>

      {/* best sellers */}
      <div
        className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
      >
        <h4 className="text-custom-black font-bold tracking-wider mb-6 uppercase text-sm border-b-2 border-orange-400 inline-block pb-1">
          Best Sellers
        </h4>
        <div className="flex flex-col gap-4">
          {bestSellers?.map((product: TProduct) => (
            <ProductCard key={product?._id} product={product} variant="compact" />
          ))}
        </div>
      </div>

      {/* top rated */}
      <div
        className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="200"
      >
        <h4 className="text-custom-black font-bold tracking-wider mb-6 uppercase text-sm border-b-2 border-orange-400 inline-block pb-1">
          Top Rated
        </h4>
        <div className="flex flex-col gap-4">
          {topRated?.map((product: TProduct) => (
            <ProductCard key={product?._id} product={product} variant="compact" />
          ))}
        </div>
      </div>

      {/* new arrival */}
      <div
        className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <h4 className="text-custom-black font-bold tracking-wider mb-6 uppercase text-sm border-b-2 border-orange-400 inline-block pb-1">
          New Arrival
        </h4>
        <div className="flex flex-col gap-4">
          {newArrival?.map((product: TProduct) => (
            <ProductCard key={product?._id} product={product} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
