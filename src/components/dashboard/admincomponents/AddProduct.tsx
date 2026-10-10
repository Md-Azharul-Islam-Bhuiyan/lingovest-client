'use client';

import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useGetAllBrandsQuery } from '@/redux/api/brandApi';
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi';
import { useCreateProductMutation } from '@/redux/api/productApi';
import { useGetAllSubCategoriesQuery } from '@/redux/api/subcategoryApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useGenerateDescriptionMutation } from '@/redux/api/aiApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RichTextEditor from '@/components/common/RichTextEditor';
import {
  Package, DollarSign, Tag, Calendar, Image as ImageIcon,
  Sparkles, Info, Truck, Layers, PlusCircle, ChevronRight,
  Plus, Box, AlertCircle, ShieldCheck, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddProduct = () => {
  CheckRoleAndLogout('admin');
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [brandId, setBrandId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [features, setFeatures] = useState<string>('');
  const [shippingInfo, setShippingInfo] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [runningDiscount, setRunningDiscount] = useState<number>(0);
  const [releaseDate, setReleaseDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: profileData } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const categories = categoriesData?.data || [];

  const { data: brandsData } = useGetAllBrandsQuery(undefined);
  const brands = brandsData?.data || [];

  const { data: subCategoriesData } = useGetAllSubCategoriesQuery(undefined);
  const subCategories = subCategoriesData?.data || [];

  const [createProduct] = useCreateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const [generateDescription, { isLoading: isGeneratingAIDescription }] = useGenerateDescriptionMutation();
  const [isGeneratingAIFeatures, setIsGeneratingAIFeatures] = useState<boolean>(false);
  const [isGeneratingAIShippingInfo, setIsGeneratingAIShippingInfo] = useState<boolean>(false);

  const handleGenerateAIDescription = async () => {
    if (!title) { toast.error('Enter a product title first.', { position: 'top-right' }); return; }
    const selectedCategory = categories?.find((c: any) => c.id === categoryId)?.name || 'General Product';
    const prompt = `Product Name: ${title}\nCategory: ${selectedCategory}\nGenerate an engaging and detailed product description. Response should only strictly contain the description text.`;
    try {
      const response = await generateDescription({ prompt }).unwrap();
      const aiData = response?.data;
      if (aiData?.description) { setDescription(aiData.description); }
      else if (typeof aiData === 'string') { setDescription(aiData); }
      toast.success('Description generated! ✨', { position: 'top-right' });
    } catch { toast.error('Failed to generate description.', { position: 'top-right' }); }
  };

  const handleGenerateAIFeatures = async () => {
    if (!title) { toast.error('Enter a product title first.', { position: 'top-right' }); return; }
    setIsGeneratingAIFeatures(true);
    const selectedCategory = categories?.find((c: any) => c.id === categoryId)?.name || 'General Product';
    const prompt = `Product Name: ${title}\nCategory: ${selectedCategory}\nGenerate only the key features. Use an HTML unordered list (<ul><li>...</li></ul>) format. Strictly respond only with HTML.`;
    try {
      const response = await generateDescription({ prompt }).unwrap();
      const aiData = response?.data;
      if (aiData?.features) { setFeatures(aiData.features); }
      else if (typeof aiData === 'string') { setFeatures(aiData); }
      toast.success('Key features generated! ✨', { position: 'top-right' });
    } catch { toast.error('Failed to generate features.', { position: 'top-right' });
    } finally { setIsGeneratingAIFeatures(false); }
  };

  const handleGenerateAIShippingInfo = async () => {
    if (!title) { toast.error('Enter a product title first.', { position: 'top-right' }); return; }
    setIsGeneratingAIShippingInfo(true);
    const prompt = `Product Name: ${title}\nGenerate shipping information. Include estimated delivery time and handling instructions. Respond only with the text content.`;
    try {
      const response = await generateDescription({ prompt }).unwrap();
      const aiData = response?.data;
      if (aiData?.shippingInfo) { setShippingInfo(aiData.shippingInfo); }
      else if (typeof aiData === 'string') { setShippingInfo(aiData); }
      toast.success('Shipping info generated! ✨', { position: 'top-right' });
    } catch { toast.error('Failed to generate shipping info.', { position: 'top-right' });
    } finally { setIsGeneratingAIShippingInfo(false); }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !price || !brandId || !categoryId || !displayImage || !description || !releaseDate) {
      toast.error('Please fill all required fields.', { position: 'top-right' }); return;
    }
    if (description.replace(/<[^>]*>/g, '').length < 400) {
      toast.error('Description must be at least 400 characters.', { position: 'top-right' }); return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', displayImage);
      const uploadResult = await uploadImage(formData).unwrap();
      const imageUrl = uploadResult?.data?.url;
      if (!imageUrl) throw new Error('Failed to upload image');

      const productData = {
        title, price: Number(price), stock: Number(stock), brandId, categoryId,
        subCategoryId: subCategoryId === '' ? undefined : subCategoryId,
        displayImage: imageUrl, description, features, shippingInfo,
        vendor: userProfileFromDb?.email,
        runningDiscount: Number(runningDiscount), releaseDate,
      };

      const response = await createProduct(productData).unwrap();
      if (response?.success || response?.statusCode === 201) {
        toast.success('Product created successfully!', { position: 'top-right' });
        navigate('/dashboard/admin/manage-products');
      } else {
        toast.error('Failed to create product.', { position: 'top-right' });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Something went wrong', { position: 'top-right' });
    } finally { setIsSubmitting(false); }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const richSections = [
    { id: 'description', title: 'Comprehensive Description', icon: <Info className="size-5" />, value: description, setter: setDescription, handler: handleGenerateAIDescription, loading: isGeneratingAIDescription, minChars: 400, placeholder: "Describe this product in detail — use case, benefits, and what sets it apart..." },
    { id: 'features', title: 'Technical Highlights', icon: <Sparkles className="size-5" />, value: features, setter: setFeatures, handler: handleGenerateAIFeatures, loading: isGeneratingAIFeatures, placeholder: "List key specs and features..." },
    { id: 'shipping', title: 'Shipping & Fulfillment', icon: <Truck className="size-5" />, value: shippingInfo, setter: setShippingInfo, handler: handleGenerateAIShippingInfo, loading: isGeneratingAIShippingInfo, placeholder: "Delivery timeline, packaging, restrictions..." },
  ];

  return (
    <motion.div className="min-h-screen bg-[#f8fafc] pb-12" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="main-container pt-8 lg:pt-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <PlusCircle className="text-orange-500 size-8" /> Add New Product
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl font-medium">
              Welcome, <span className="text-gray-900 font-bold">{userProfileFromDb?.name}</span>! You are in the Admin control panel. Listings are published immediately.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <ShieldCheck className="size-4 text-purple-500" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Admin Access</span>
          </div>
        </header>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">

            {/* Primary Details */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg"><Package className="text-orange-500 size-5" /></div>
                  <h2 className="font-bold text-gray-800">Product Identity</h2>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-100 text-purple-600 px-3 py-1 rounded-full">Admin Listing</span>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Product Title <span className="text-red-500">*</span></label>
                  <input type="text" required className="w-full text-sm font-medium rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none" placeholder="e.g. iPhone 15 Pro Max Titanium" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <div className="flex justify-end mt-1 px-1">
                    <p className={`text-[10px] font-bold ${title.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>{title.length}/255</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Layers className="size-4 text-gray-400" /> Category <span className="text-red-500">*</span></label>
                    <select required className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none cursor-pointer transition-all" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="">Select Category</option>
                      {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><ChevronRight className="size-4 text-gray-400" /> Sub-Category</label>
                    <select disabled={!categoryId} className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed" value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
                      <option value="">Select Sub-Category</option>
                      {subCategories?.filter((sub: any) => sub.categoryId === categoryId).map((sub: any) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Tag className="size-4 text-gray-400" /> Brand <span className="text-red-500">*</span></label>
                    <select required className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none cursor-pointer transition-all" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                      <option value="">Select Brand</option>
                      {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Calendar className="size-4 text-gray-400" /> Release Date <span className="text-red-500">*</span></label>
                    <input type="date" required className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rich Content Sections */}
            <motion.div variants={itemVariants} className="space-y-8">
              {richSections.map((section) => (
                <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-500">{section.icon}</div>
                      <div>
                        <h2 className="font-bold text-gray-800">{section.title}</h2>
                        {section.minChars && (
                          <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 mt-0.5">
                            <AlertCircle className="size-2" /> Min {section.minChars} characters required
                          </p>
                        )}
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={section.handler} disabled={section.loading} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-black px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all disabled:opacity-50 uppercase tracking-widest">
                      {section.loading ? <div className="animate-spin size-3 border-2 border-white rounded-full border-t-transparent"></div> : <Sparkles className="size-3" />}
                      {section.loading ? 'GENERATING...' : 'GENERATE WITH AI'}
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <RichTextEditor id={section.id} value={section.value} onChange={section.setter} placeholder={section.placeholder} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">

            {/* Image Upload */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-500"><ImageIcon className="size-5" /></div>
                <h2 className="font-bold text-gray-800">Media Asset</h2>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed rounded-2xl transition-all relative overflow-hidden group"
                  style={{ borderColor: displayImage ? '#f97316' : '#e5e7eb', background: displayImage ? 'rgba(249,115,22,0.02)' : '#f9fafb' }}>
                  {imagePreview ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Click to Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="size-16 rounded-full bg-orange-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-orange-500 size-8" />
                      </div>
                      <h3 className="text-sm font-black text-gray-800 mb-1">Product Photo</h3>
                      <p className="text-[10px] font-bold text-gray-400">Drag & drop or click to browse</p>
                      <div className="mt-3 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-widest">JPG / PNG · Max 1MB</div>
                    </div>
                  )}
                  <input type="file" required={!displayImage} accept="image/jpeg,image/jpg,image/png" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setDisplayImage(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                </div>
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-500"><DollarSign className="size-5" /></div>
                <h2 className="font-bold text-gray-800">Pricing & Inventory</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Base Price ($) <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-lg group-focus-within:text-orange-500 transition-colors">$</div>
                    <input type="number" step="0.01" required className="w-full text-2xl font-black rounded-2xl py-5 pl-10 pr-6 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none" placeholder="0.00" value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2"><Hash className="size-3" /> Stock Quantity <span className="text-red-500">*</span></label>
                  <input type="number" required className="w-full text-xl font-bold rounded-2xl py-4 px-6 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none" placeholder="50" value={stock || ''} onChange={(e) => setStock(Number(e.target.value))} />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Promotional Discount (%)</label>
                  <div className="relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-lg group-focus-within:text-orange-500 transition-colors">%</div>
                    <input type="number" className="w-full text-xl font-bold rounded-2xl py-4 pl-6 pr-12 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none" placeholder="0" value={runningDiscount || ''} onChange={(e) => setRunningDiscount(Number(e.target.value))} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Base Price:</span><span>${price?.toLocaleString() || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-rose-500">
                    <span>Discount:</span><span>-${((price * runningDiscount) / 100).toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                    <span>Final Price:</span>
                    <span className="text-orange-600">${(price - (price * runningDiscount) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sticky Publish Button */}
            <motion.div className="sticky top-8" variants={itemVariants}>
              <div className="bg-white/40 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-2xl shadow-purple-500/10">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-gray-900/30 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 mb-4"
                  type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <div className="animate-spin size-5 border-2 border-white/30 rounded-full border-t-white"></div> : <PlusCircle className="size-5 text-orange-500" />}
                  <span className="uppercase tracking-widest text-sm">{isSubmitting ? 'PUBLISHING...' : 'PUBLISH LISTING'}</span>
                </motion.button>
                <button type="button" onClick={() => navigate('/dashboard/admin/manage-products')}
                  className="w-full text-[10px] font-black text-gray-400 hover:text-rose-500 transition-colors py-2 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Plus className="size-3 rotate-45" /> Discard & Exit
                </button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProduct;
