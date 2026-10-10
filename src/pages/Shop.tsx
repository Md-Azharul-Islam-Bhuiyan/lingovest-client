import ScrollToTop from '@/components/ui/ToTop';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi';
import { useGetAllSubCategoriesQuery } from '@/redux/api/subcategoryApi';
import { useGetAllBrandsQuery } from '@/redux/api/brandApi';
import { TProduct } from '@/types/commonTypes';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { IoCloseOutline } from 'react-icons/io5';
import ProductCard from '@/components/common/ProductCard';
import bannerWatch from '../assets/images/watchbanner.png';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [filterPriceFrom, setFilterPriceFrom] = useState<string>('');
  const [filterPriceTo, setFilterPriceTo] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState<string>('1');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const limit = '12';

  // Fetch dynamic data
  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const { data: subCategoriesData } = useGetAllSubCategoriesQuery('limit=100');
  const { data: brandsData } = useGetAllBrandsQuery('limit=100');

  const categories = categoriesData?.data || [];
  const subCategories = subCategoriesData?.data || [];
  const brands = brandsData?.data || [];

  const getCategoryName = (id: string) => categories.find((c: any) => (c._id || c.id) === id)?.name || id;
  const getSubCategoryName = (id: string) => subCategories.find((s: any) => (s._id || s.id) === id)?.name || id;

  const allFilters = {
    page: page,
    limit: limit,
    sortBy: sortBy,
    sortOrder: sortOrder,
    category: selectedCategory === 'all' ? '' : getCategoryName(selectedCategory),
    subCategory: selectedSubCategory ? getSubCategoryName(selectedSubCategory) : '',
    minPrice: filterPriceFrom,
    maxPrice: filterPriceTo,
    brand: selectedBrand,
    search: searchKeyword,
  };

  const createQueryString = (obj: any) => {
    const keyValuePairs = [];
    for (const key in obj) {
      if (obj[key] !== '' && obj[key] !== undefined) {
        keyValuePairs.push(
          encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
        );
      }
    }
    return keyValuePairs.join('&');
  };

  const [queryParams, setQueryParams] = useState(createQueryString(allFilters));

  useEffect(() => {
    setQueryParams(createQueryString(allFilters));
  }, [
    page,
    sortBy,
    sortOrder,
    selectedCategory,
    selectedSubCategory,
    filterPriceFrom,
    filterPriceTo,
    selectedBrand,
    searchKeyword,
  ]);

  const resetAllFilter = () => {
    setPage('1');
    setSelectedCategory('all');
    setSelectedSubCategory('');
    setFilterPriceFrom('');
    setFilterPriceTo('');
    setSelectedBrand('');
    setSortBy('');
    setSortOrder('');
    setSearchKeyword('');
    setExpandedCategory(null);
  };

  const { data, isLoading } = useGetProductsQuery(queryParams);
  const products = data?.data?.data;
  const totalItems = data?.data?.meta?.total;
  const totalPages = Math.ceil(Number(totalItems) / Number(limit));

  const handlePageChange = (page: number) => {
    setPage(page.toString());
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSort = (e: string) => {
    if (e === 'default') {
      setSortBy('');
      setSortOrder('');
    } else {
      setSortBy('price');
      setSortOrder(e);
    }
    setPage('1');
  };

  const toggleCategory = (catId: string) => {
    if (expandedCategory === catId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(catId);
    }
    setSelectedCategory(catId);
    setSelectedSubCategory('');
    setPage('1');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <ScrollToTop />

      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Mobile Filter Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 overflow-y-auto shadow-2xl transform transition-transform duration-300 lg:hidden ${
        mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest">Filters</h2>
          <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-700">
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>
        <div className="p-4 space-y-6">
          {/* Category Filter (mobile) */}
          <div>
            <h3 className="text-gray-900 font-bold uppercase tracking-wider text-xs mb-4">Categories</h3>
            <div className="space-y-1">
              <button onClick={() => { setSelectedCategory('all'); setSelectedSubCategory(''); setExpandedCategory(null); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'all' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>All Products</button>
              {categories.map((cat: any) => {
                const catId = cat._id || cat.id;
                const filteredSubs = subCategories.filter((sub: any) => sub.categoryId === catId || sub.category?._id === catId || sub.category?.id === catId || sub.category === catId);
                const isActive = selectedCategory === catId;
                const isExpanded = expandedCategory === catId;
                return (
                  <div key={catId}>
                    <button onClick={() => toggleCategory(catId)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                      <span>{cat.name}</span>
                      {filteredSubs.length > 0 && <FaChevronDown className={`text-[10px] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                    </button>
                    {isExpanded && filteredSubs.length > 0 && (
                      <div className="pl-5 space-y-1 mt-1">
                        {filteredSubs.map((sub: any) => (
                          <button key={sub._id || sub.id} onClick={() => { setSelectedSubCategory(sub._id || sub.id); setPage('1'); setMobileFiltersOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedSubCategory === (sub._id || sub.id) ? 'text-orange-500' : 'text-gray-400 hover:text-gray-700'}`}>{sub.name}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Price (mobile) */}
          <div>
            <h3 className="text-gray-900 font-bold uppercase tracking-wider text-xs mb-4">Price Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold" placeholder="Min" value={filterPriceFrom} onChange={(e) => setFilterPriceFrom(e.target.value)} />
              <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold" placeholder="Max" value={filterPriceTo} onChange={(e) => setFilterPriceTo(e.target.value)} />
            </div>
          </div>
          {/* Brands (mobile) */}
          <div>
            <h3 className="text-gray-900 font-bold uppercase tracking-wider text-xs mb-4">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand: any) => (
                <button key={brand._id || brand.id} onClick={() => { setSelectedBrand(selectedBrand === brand.name ? '' : brand.name); }} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${selectedBrand === brand.name ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-500'}`}>{brand.name}</button>
              ))}
            </div>
          </div>
          <button onClick={() => { resetAllFilter(); setMobileFiltersOpen(false); }} className="w-full py-3 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all">Reset All Filters</button>
        </div>
      </div>

      {/* --- Page Header / Hero --- */}
      <div className="relative overflow-hidden bg-gray-900 py-12 sm:py-16 lg:py-24 mb-8 sm:mb-10">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-orange-500 blur-[120px]" />
        </div>
        <div className="main-container relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4 sm:mb-6 shadow-sm">
            <HiSparkles className="text-yellow-400 text-sm" />
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-300">Shopora Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 sm:mb-6">Discover Excellence</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
            Browse our curated collection of premium gadgets, fashion, and accessories.
          </p>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
          <FiFilter className="text-sm" /> Filters
        </button>
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-400" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
        </div>
      </div>

      <div className="main-container px-3 sm:px-4">
        <div className="grid grid-cols-12 gap-6 lg:gap-12">
          
          {/* --- Sidebar Filters (desktop only) --- */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              
              {/* Category Filter */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <FiFilter className="text-orange-500" />
                  </div>
                  <h3 className="text-gray-900 font-bold uppercase tracking-wider text-xs">Categories</h3>
                </div>
                
                <div className="space-y-2">
                  {/* All Categories Option */}
                  <button
                    onClick={() => { setSelectedCategory('all'); setSelectedSubCategory(''); setExpandedCategory(null); }}
                    className={`w-full flex items-center p-2 rounded-xl transition-all ${
                      selectedCategory === 'all' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedCategory === 'all' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                    <span className="text-sm font-bold">All Products</span>
                  </button>

                  {/* Dynamic Categories */}
                  {categories.map((cat: any) => {
                    const catId = cat._id || cat.id;
                    const filteredSubs = subCategories.filter(
                      (sub: any) => 
                        sub.categoryId === catId || 
                        sub.category?._id === catId || 
                        sub.category?.id === catId ||
                        sub.category === catId
                    );
                    const hasSub = filteredSubs.length > 0;
                    const isExpanded = expandedCategory === catId;
                    const isActive = selectedCategory === catId;

                    return (
                      <div key={catId} className="space-y-1">
                        <button
                          onClick={() => toggleCategory(catId)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                            isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-1.5 h-1.5 rounded-full mr-3 ${isActive ? 'bg-orange-500' : 'bg-gray-300'}`} />
                            <span className="text-sm font-bold">{cat.name}</span>
                          </div>
                          {hasSub && (
                            <FaChevronDown className={`text-[10px] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          )}
                        </button>

                        {/* Subcategories */}
                        {isExpanded && hasSub && (
                          <div className="pl-6 space-y-1 mt-1 animate-fade-in">
                            {filteredSubs.map((sub: any) => (
                              <button
                                key={sub._id || sub.id}
                                onClick={() => { setSelectedSubCategory(sub._id || sub.id); setPage('1'); }}
                                className={`w-full text-left p-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  selectedSubCategory === (sub._id || sub.id) ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-900 font-bold uppercase tracking-wider text-xs mb-6">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Min</span>
                    <input
                      type="number"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="$0"
                      value={filterPriceFrom}
                      onChange={(e) => setFilterPriceFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Max</span>
                    <input
                      type="number"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="$5k"
                      value={filterPriceTo}
                      onChange={(e) => setFilterPriceTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-900 font-bold uppercase tracking-wider text-xs mb-6">Popular Brands</h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand: any) => (
                    <button
                      key={brand._id || brand.id}
                      onClick={() => setSelectedBrand(selectedBrand === brand.name ? '' : brand.name)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all border ${
                        selectedBrand === brand.name
                          ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-500'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Ad Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px]" />
                <img src={bannerWatch} alt="Ad" className="w-24 h-24 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
                <h4 className="text-white font-black text-center text-lg leading-tight mb-2">Apple Watch Ultra 2</h4>
                <p className="text-blue-100 text-[10px] text-center font-bold uppercase tracking-widest mb-6">Limited Edition</p>
                <button className="w-full py-3 bg-white text-blue-700 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl">
                  Check Offer
                </button>
              </div>

            </div>
          </aside>

          {/* --- Main Content Area --- */}
          <main className="col-span-12 lg:col-span-9">
            
            {/* Toolbar: Search, Sort, Stats (desktop only — mobile has sticky bar) */}
            <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-10">
              
              <div className="hidden lg:flex flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full lg:max-w-md group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for products, brands, models..."
                    className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-gray-800"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>

                {/* Sort & Reset */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm grow lg:grow-0">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Sort By:</span>
                    <select
                      className="bg-transparent border-none text-sm font-bold text-gray-800 focus:ring-0 cursor-pointer min-w-[120px]"
                      value={sortOrder}
                      onChange={(e) => handleSort(e.target.value)}
                    >
                      <option value="default">Newest First</option>
                      <option value="asc">Price: Low to High</option>
                      <option value="desc">Price: High to Low</option>
                    </select>
                  </div>
                  <button
                    onClick={resetAllFilter}
                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm"
                    title="Reset All Filters"
                  >
                    <IoCloseOutline className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Filters:</span>
                {(selectedCategory !== 'all' || selectedSubCategory || selectedBrand || filterPriceFrom || filterPriceTo || searchKeyword) ? (
                  <>
                    {selectedCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 shadow-sm">
                        Cat: {categories.find((c: any) => (c._id || c.id) === selectedCategory)?.name || selectedCategory}
                        <button onClick={() => { setSelectedCategory('all'); setSelectedSubCategory(''); }}><IoCloseOutline /></button>
                      </span>
                    )}
                    {selectedSubCategory && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 shadow-sm">
                        Sub: {subCategories.find((s: any) => (s._id || s.id) === selectedSubCategory)?.name || selectedSubCategory}
                        <button onClick={() => setSelectedSubCategory('')}><IoCloseOutline /></button>
                      </span>
                    )}
                    {selectedBrand && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 shadow-sm">
                        Brand: {selectedBrand}
                        <button onClick={() => setSelectedBrand('')}><IoCloseOutline /></button>
                      </span>
                    )}
                    {searchKeyword && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 shadow-sm">
                        "{searchKeyword}"
                        <button onClick={() => setSearchKeyword('')}><IoCloseOutline /></button>
                      </span>
                    )}
                    <button 
                      onClick={resetAllFilter}
                      className="text-[10px] font-black text-orange-500 hover:underline px-2"
                    >
                      Clear All
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-gray-300 italic">No active filters</span>
                )}
                <div className="ml-auto text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Showing {products?.length || 0} of {totalItems || 0} Products
                </div>
              </div>
            </div>

            {/* Mobile Sort Bar */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400">{totalItems || 0} products</span>
              <select className="bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:ring-0" value={sortOrder} onChange={(e) => handleSort(e.target.value)}>
                <option value="default">Newest First</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-96 animate-pulse shadow-sm border border-gray-100" />
                ))
              ) : products?.length > 0 ? (
                products.map((product: TProduct) => (
                  <div key={product._id} data-aos="fade-up">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="size-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiSearch className="text-3xl text-orange-400" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    We couldn't find anything matching your current filters. Try adjusting them.
                  </p>
                  <button
                    onClick={resetAllFilter}
                    className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:shadow-xl transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {products?.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-3">
                <button
                  className="size-11 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all disabled:opacity-30"
                  onClick={() => handlePageChange(Number(page) - 1)}
                  disabled={Number(page) === 1}
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Only show first, last, and pages around current
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= Number(page) - 1 && pageNum <= Number(page) + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`size-11 flex items-center justify-center rounded-2xl font-bold text-sm transition-all ${
                            Number(page) === pageNum
                              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                              : 'bg-white text-gray-400 border border-gray-100 shadow-sm hover:border-orange-200 hover:text-orange-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === Number(page) - 2 || pageNum === Number(page) + 2) {
                      return <span key={pageNum} className="text-gray-300">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  className="size-11 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all disabled:opacity-30"
                  onClick={() => handlePageChange(Number(page) + 1)}
                  disabled={Number(page) === totalPages}
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
