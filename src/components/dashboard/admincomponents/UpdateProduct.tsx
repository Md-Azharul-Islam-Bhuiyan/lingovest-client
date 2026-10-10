'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useGetAllBrandsQuery } from '@/redux/api/brandApi';
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi';
import { useGetSingleProductQuery, useUpdateProductMutation } from '@/redux/api/productApi';
import { useGetAllSubCategoriesQuery } from '@/redux/api/subcategoryApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useGenerateDescriptionMutation } from '@/redux/api/aiApi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import RichTextEditor from '@/components/common/RichTextEditor';
import {
  Package, DollarSign, Tag, Calendar, Image as ImageIcon,
  Sparkles, Info, Truck, Layers, ChevronRight, ShieldCheck, RotateCcw, Save, Hash, AlertCircle, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const UpdateProduct = () => {
  CheckRoleAndLogout('admin');
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading: isProductLoading } = useGetSingleProductQuery(id);
  const product = productData?.data;

  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [brandId, setBrandId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [features, setFeatures] = useState<string>('');
  const [shippingInfo, setShippingInfo] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
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

  const [updateProduct] = useUpdateProductMutation();
  const [uploadImage] = useUploadImageMutation();
  const [generateDescription, { isLoading: isGeneratingAIDescription }] = useGenerateDescriptionMutation();
  const [isGeneratingAIFeatures, setIsGeneratingAIFeatures] = useState<boolean>(false);
  const [isGeneratingAIShippingInfo, setIsGeneratingAIShippingInfo] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setPrice(product.price || 0);
      setStock(product.stock || 0);
      setBrandId(product.brandId || '');
      setCategoryId(product.categoryId || '');
      setSubCategoryId(product.subCategoryId || '');
      setDescription(product.description || '');
      setFeatures(product.features || '');
      setShippingInfo(product.shippingInfo || '');
      setDisplayImage(product.displayImage || '');
      setImagePreview(product.displayImage || null);
      setRunningDiscount(product.runningDiscount || 0);
      setReleaseDate(product.releaseDate || '');
    }
  }, [product]);

  const handleGenerateAIDescription = async () => {
    if (!title) { toast.error('Enter a product title first.', { position: 'top-right' }); return; }
    const selectedCategory = categories?.find((c: any) => c.id === categoryId)?.name || 'General Product';
    const prompt = `Product Name: ${title}\nCategory: ${selectedCategory}\nGenerate an engaging and detailed product description. Response should only strictly contain the description text.`;
    try {
      const response = await generateDescription({ prompt }).unwrap();
      const aiData = response?.data;
      if (aiData?.description) { setDescription(aiData.description); }
      else if (typeof aiData === 'string') { setDescription(aiData); }
      toast.success('Description re-generated! ✨', { position: 'top-right' });
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
      toast.success('Features re-generated! ✨', { position: 'top-right' });
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
      toast.success('Shipping info re-generated! ✨', { position: 'top-right' });
    } catch { toast.error('Failed to generate shipping info.', { position: 'top-right' });
    } finally { setIsGeneratingAIShippingInfo(false); }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (description && description.replace(/<[^>]*>/g, '').length < 20) {
      toast.error('Description must be at least 20 characters.', { position: 'top-right' }); return;
    }
    setIsSubmitting(true);
    try {
      let imageUrl = displayImage;
      if (newImageFile) {
        const formData = new FormData();
        formData.append('file', newImageFile);
        const uploadResult = await uploadImage(formData).unwrap();
        imageUrl = uploadResult?.data?.url;
        if (!imageUrl) throw new Error('Failed to upload new image');
      }

      const updateData = {
        id, title, price: Number(price), stock: Number(stock), brandId, categoryId,
        subCategoryId: subCategoryId === '' ? null : subCategoryId,
        displayImage: imageUrl, description, features, shippingInfo,
        runningDiscount: Number(runningDiscount), releaseDate,
      };

      const response = await updateProduct(updateData).unwrap();
      if (response?.success || response?.statusCode === 200) {
        toast.success('Product updated successfully!', { position: 'top-right' });
        navigate('/dashboard/admin/manage-products');
      } else {
        toast.error('Failed to update product.', { position: 'top-right' });
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

  if (isProductLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="size-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading Product...</p>
    </div>
  );

  const richSections = [
    { id: 'description', title: 'Product Description', icon: <Info className="size-5" />, value: description, setter: setDescription, handler: handleGenerateAIDescription, loading: isGeneratingAIDescription, minChars: 400, placeholder: product?.description },
    { id: 'features', title: 'Technical Highlights', icon: <Sparkles className="size-5" />, value: features, setter: setFeatures, handler: handleGenerateAIFeatures, loading: isGeneratingAIFeatures, placeholder: "List key specs..." },
    { id: 'shipping', title: 'Shipping & Fulfillment', icon: <Truck className="size-5" />, value: shippingInfo, setter: setShippingInfo, handler: handleGenerateAIShippingInfo, loading: isGeneratingAIShippingInfo, placeholder: "Delivery timeline..." },
  ];

  return (
    <motion.div className="min-h-screen bg-[#f8fafc] pb-12" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="main-container pt-8 lg:pt-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-widest mb-2">
              <ShieldCheck className="size-3" /> Admin Override — Editing Catalog Item
            </div>
            <h1 className="text-3xl font-black text-gray-900">Update Product</h1>
            <p className="text-gray-500 mt-2 max-w-xl font-medium">
              Revising <span className="text-purple-600 font-bold">"{product?.title}"</span>. Changes take effect immediately system-wide.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="size-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Admin Revision Mode</span>
          </div>
        </header>

        <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">

            {/* Identity Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg"><Package className="text-purple-500 size-5" /></div>
                <h2 className="font-bold text-gray-800">Identity & Classification</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Product Title</label>
                  <input type="text" className="w-full text-sm font-medium rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Layers className="size-4 text-gray-400" /> Category</label>
                    <select className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer transition-all" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="">{product?.category?.name || 'Select Category'}</option>
                      {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><ChevronRight className="size-4 text-gray-400" /> Sub-Category</label>
                    <select disabled={!categoryId} className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none cursor-pointer transition-all disabled:opacity-50" value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
                      <option value="">{product?.subCategory?.name || 'Select Sub-Category'}</option>
                      {subCategories?.filter((sub: any) => sub.categoryId === categoryId).map((sub: any) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Tag className="size-4 text-gray-400" /> Brand</label>
                    <select className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none cursor-pointer transition-all" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                      <option value="">{product?.brand?.name || 'Select Brand'}</option>
                      {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2"><Calendar className="size-4 text-gray-400" /> Release Date</label>
                    <input type="date" className="w-full text-sm font-semibold rounded-xl p-4 bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none transition-all" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rich Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              {richSections.map((section) => (
                <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-500">{section.icon}</div>
                      <div>
                        <h2 className="font-bold text-gray-800">{section.title}</h2>
                        {section.minChars && (
                          <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 mt-0.5">
                            <AlertCircle className="size-2" /> Min {section.minChars} characters
                          </p>
                        )}
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={section.handler} disabled={section.loading}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-50 uppercase tracking-widest">
                      {section.loading ? <div className="animate-spin size-3 border-2 border-white rounded-full border-t-transparent"></div> : <Sparkles className="size-3" />}
                      {section.loading ? 'RE-GENERATING...' : 'GENERATE WITH AI'}
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <RichTextEditor id={section.id} value={section.value} onChange={section.setter} placeholder={typeof section.placeholder === 'string' ? section.placeholder : ''} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">

            {/* Status */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-50">
                <ShieldCheck className="text-purple-500 size-4" />
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Admin Revision Panel</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">SKU:</span>
                  <span className="text-[10px] font-bold py-1 px-3 bg-gray-100 rounded-full text-gray-600">#{id?.slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Vendor:</span>
                  <span className="text-[10px] font-black text-gray-900 truncate ml-4 text-right">{product?.vendor || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Visibility:</span>
                  <span className="text-[10px] font-black text-green-700 uppercase bg-green-50 px-2 py-0.5 rounded-full">Live</span>
                </div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-500"><ImageIcon className="size-5" /></div>
                <h2 className="font-bold text-gray-800">Product Visual</h2>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl relative overflow-hidden group hover:border-purple-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-xl border-2 border-white">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Click to Replace</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <ImageIcon className="text-gray-300 size-12 mb-2" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase">No Image Set</p>
                    </div>
                  )}
                  <input type="file" accept="image/jpeg,image/jpg,image/png" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 text-center mt-3 uppercase tracking-wider">Leave untouched to keep existing image</p>
              </div>
            </motion.div>

            {/* Pricing & Stock */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-500"><DollarSign className="size-5" /></div>
                <h2 className="font-bold text-gray-800">Financials & Stock</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Base Price ($)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-lg group-focus-within:text-purple-500 transition-colors">$</span>
                    <input type="number" step="0.01" className="w-full text-2xl font-black rounded-2xl py-5 pl-10 pr-6 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" placeholder={product?.price?.toString()} value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-1"><Hash className="size-3" /> Stock Level</label>
                  <input type="number" className="w-full text-xl font-bold text-center rounded-2xl py-4 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" placeholder={product?.stock?.toString()} value={stock || ''} onChange={(e) => setStock(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Discount (%)</label>
                  <div className="relative group">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-lg group-focus-within:text-purple-500 transition-colors">%</span>
                    <input type="number" className="w-full text-xl font-bold rounded-2xl py-4 pl-6 pr-12 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none" value={runningDiscount || ''} onChange={(e) => setRunningDiscount(Number(e.target.value))} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-500"><span>Base:</span><span>${price?.toFixed(2) || '0.00'}</span></div>
                  <div className="flex justify-between text-xs font-bold text-rose-500"><span>Discount:</span><span>-${((price * runningDiscount) / 100).toFixed(2)}</span></div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                    <span>Final:</span>
                    <span className="text-purple-600">${(price - (price * runningDiscount) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div className="sticky top-8" variants={itemVariants}>
              <div className="bg-white/40 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-2xl shadow-purple-500/10">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-gray-900/30 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 mb-4"
                  type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <div className="animate-spin size-5 border-2 border-white/30 rounded-full border-t-white"></div> : <Save className="size-5 text-purple-400" />}
                  <span className="uppercase tracking-widest text-sm">{isSubmitting ? 'SAVING...' : 'COMMIT CHANGES'}</span>
                </motion.button>
                <button type="button" onClick={() => navigate('/dashboard/admin/manage-products')}
                  className="w-full text-[10px] font-black text-gray-400 hover:text-rose-500 transition-colors py-2 uppercase tracking-widest flex items-center justify-center gap-2">
                  <RotateCcw className="size-3" /> Discard & Exit
                </button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProduct;
