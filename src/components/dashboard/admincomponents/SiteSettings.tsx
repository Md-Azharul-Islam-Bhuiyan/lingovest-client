import { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } from '@/redux/api/siteSettingsApi';
import { useGetAllNewsQuery, useCreateNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation } from '@/redux/api/newsApi';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { 
  useGetAllLogosQuery, 
  useCreateLogoMutation, 
  useActivateLogoMutation, 
  useDeleteLogoMutation 
} from '@/redux/api/logoApi';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FiSettings, FiSave, FiPlus, FiTrash2, FiEdit3, FiEye, FiEyeOff, FiStar, FiImage } from 'react-icons/fi';
import { TProduct } from '@/types/commonTypes';

type TNews = { id: string; headline: string; isActive: boolean; createdAt: string };

const AdminSiteSettings = () => {
  const { data: settingsData, isLoading: settingsLoading } = useGetSiteSettingsQuery(undefined);
  const { data: newsData, isLoading: newsLoading } = useGetAllNewsQuery(false);
  const { data: productsData } = useGetProductsQuery('limit=100');
  const [updateSettings, { isLoading: saving }] = useUpdateSiteSettingsMutation();
  const [uploadImage, { isLoading: uploadingLogo }] = useUploadImageMutation();
  const [createNews] = useCreateNewsMutation();
const [updateNews] = useUpdateNewsMutation();
const [deleteNews] = useDeleteNewsMutation();

// Logo hooks
const { data: logosData, isLoading: logosLoading } = useGetAllLogosQuery(undefined);
const [createLogo, { isLoading: creatingLogo }] = useCreateLogoMutation();
const [activateLogo, { isLoading: activatingLogo }] = useActivateLogoMutation();
const [deleteLogo, { isLoading: deletingLogo }] = useDeleteLogoMutation();

  const settings = settingsData?.data;
  const newsList: TNews[] = newsData?.data || [];
  const allProducts: TProduct[] = productsData?.data?.data || [];

  const [form, setForm] = useState({ 
    discountLabel: '', 
    discountPercent: 13, 
    dealEndsAt: '', 
    topbarVisible: true,
    macbookPromoId: '',
    samsungPromoId: '',
    logoUrl: ''
  });
  const [newsHeadline, setNewsHeadline] = useState('');
  const [editNewsId, setEditNewsId] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        discountLabel: settings.discountLabel || 'Black Friday',
        discountPercent: settings.discountPercent ?? 13,
        dealEndsAt: settings.dealEndsAt ? new Date(settings.dealEndsAt).toISOString().slice(0, 16) : '',
        topbarVisible: settings.topbarVisible ?? true,
        macbookPromoId: settings.macbookPromoId || '',
        samsungPromoId: settings.samsungPromoId || '',
        logoUrl: settings.logoUrl || ''
      });
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        ...form,
        discountPercent: Number(form.discountPercent),
        dealEndsAt: form.dealEndsAt || null,
      }).unwrap();
      toast.success('Settings saved!');
    } catch {}
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsHeadline.trim()) return;
    try {
      if (editNewsId) {
        await updateNews({ id: editNewsId, headline: newsHeadline }).unwrap();
        toast.success('News updated!');
        setEditNewsId(null);
      } else {
        await createNews({ headline: newsHeadline, isActive: true }).unwrap();
        toast.success('News added!');
      }
      setNewsHeadline('');
    } catch {}
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Delete this headline?')) return;
    try { await deleteNews(id).unwrap(); toast.success('Deleted!'); } catch {}
  };

  const toggleNews = async (n: TNews) => {
    try { await updateNews({ id: n.id, isActive: !n.isActive }).unwrap(); } catch {}
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadImage(formData).unwrap();
      if (res.success) {
        await createLogo({ url: res.data.url }).unwrap();
        toast.success('Logo uploaded and added to gallery!');
      }
    } catch {
      toast.error('Logo upload failed.');
    }
  };

  const handleActivateLogo = async (id: string) => {
    try {
      await activateLogo(id).unwrap();
      toast.success('Logo activated!');
    } catch {
      toast.error('Failed to activate logo.');
    }
  };

  const handleDeleteLogo = async (id: string) => {
    if (!confirm('Delete this logo?')) return;
    try {
      await deleteLogo(id).unwrap();
      toast.success('Logo deleted!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete logo.');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><FiSettings className="text-orange-500" /> Site Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage topbar content, countdown timer, and news headlines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topbar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                  <FiImage className="text-orange-500" /> Logo Management
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">Upload multiple logos and select the active one</p>
              </div>
              <label className={`cursor-pointer bg-orange-400 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2 ${(uploadingLogo || creatingLogo) ? 'opacity-50 pointer-events-none' : ''}`}>
                <FiPlus /> {(uploadingLogo || creatingLogo) ? 'Processing...' : 'Add New'}
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo || creatingLogo} />
              </label>
            </div>
            
            <div className="p-6">
              {logosLoading ? (
                <div className="flex justify-center py-8"><div className="size-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : logosData?.data?.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                  <FiImage className="mx-auto text-3xl text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400 font-bold">No logos uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {logosData?.data?.map((logo: any) => (
                    <div key={logo.id} className={`group relative aspect-square rounded-lg border-2 transition-all p-2 ${logo.isActive ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 bg-gray-50/50'}`}>
                      <img src={logo.url} alt="Logo" className="w-full h-full object-contain" />
                      
                      {/* Badge / Status */}
                      {logo.isActive && (
                        <div className="absolute top-2 left-2 bg-orange-400 text-white text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-lg">Active</div>
                      )}

                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
                        {!logo.isActive && (
                          <button 
                            onClick={() => handleActivateLogo(logo.id)}
                            disabled={activatingLogo}
                            className="w-full bg-white text-gray-900 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                          >
                            Set Active
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteLogo(logo.id)}
                          disabled={deletingLogo || logo.isActive}
                          className={`w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${logo.isActive ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-red-500 text-white hover:bg-red-600 shadow-xl'}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Topbar Settings</h3>
              <p className="text-gray-400 text-xs mt-0.5">Live discount banner and countdown control</p>
            </div>
          {settingsLoading ? (
            <div className="p-8 flex justify-center"><div className="size-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <form onSubmit={handleSaveSettings} className="px-6 py-5 space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Discount Label</label>
                <input value={form.discountLabel} onChange={e => setForm(p => ({ ...p, discountLabel: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="e.g. Black Friday" />
                <p className="text-[10px] text-gray-400 mt-1">First word shown in colored badge, rest as text.</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Discount Percentage</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="1" max="99" value={form.discountPercent} onChange={e => setForm(p => ({ ...p, discountPercent: Number(e.target.value) }))} className="w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  <span className="text-2xl font-black text-orange-400">%</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Deal Ends At</label>
                <input type="datetime-local" value={form.dealEndsAt} onChange={e => setForm(p => ({ ...p, dealEndsAt: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <p className="text-[10px] text-gray-400 mt-1">Leave empty to hide countdown timer.</p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-black text-gray-800">Topbar Visible</p>
                  <p className="text-xs text-gray-400">Show or hide the top announcement bar.</p>
                </div>
                <button type="button" onClick={() => setForm(p => ({ ...p, topbarVisible: !p.topbarVisible }))} className={`relative w-12 h-6 rounded-lg transition-colors ${form.topbarVisible ? 'bg-orange-400' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-lg shadow transition-transform ${form.topbarVisible ? 'translate-x-6' : ''}`} />
                </button>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-orange-400 hover:bg-orange-400 text-white font-black py-3 rounded-lg text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>

        {/* News Manager */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">News Headlines</h3>
            <p className="text-gray-400 text-xs mt-0.5">Scrolling ticker shown above the topbar</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <form onSubmit={handleNewsSubmit} className="flex gap-2">
              <input
                value={newsHeadline}
                onChange={e => setNewsHeadline(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder={editNewsId ? 'Edit headline...' : 'Add news headline...'}
              />
              <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white font-black px-4 py-2.5 rounded-lg text-sm flex items-center gap-1 transition-all">
                <FiPlus /> {editNewsId ? 'Update' : 'Add'}
              </button>
              {editNewsId && (
                <button type="button" onClick={() => { setEditNewsId(null); setNewsHeadline(''); }} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-black px-3 py-2.5 rounded-xl text-sm transition-all">✕</button>
              )}
            </form>

            {newsLoading ? (
              <div className="py-8 flex justify-center"><div className="size-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : newsList.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8 font-bold">No headlines yet. Add one above!</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {newsList.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${n.isActive ? 'border-gray-100 bg-gray-50' : 'border-dashed border-gray-200 bg-gray-50/50 opacity-60'}`}>
                    <p className="flex-1 text-sm text-gray-700 font-medium leading-snug">{n.headline}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleNews(n)} className={`size-7 rounded-lg flex items-center justify-center transition-colors ${n.isActive ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}>
                        {n.isActive ? <FiEye className="text-xs" /> : <FiEyeOff className="text-xs" />}
                      </button>
                      <button onClick={() => { setEditNewsId(n.id); setNewsHeadline(n.headline); }} className="size-7 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <FiEdit3 className="text-xs" />
                      </button>
                      <button onClick={() => handleDeleteNews(n.id)} className="size-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promotional Slot Management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-4xl">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
              <FiStar className="text-orange-500" /> Homepage Promos
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">Select specific products for the large promotional sections on Home page.</p>
          </div>
          <button 
            type="button" 
            onClick={handleSaveSettings} 
            disabled={saving}
            className="bg-orange-400 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-orange-400 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave /> {saving ? 'Saving...' : 'Update Promos'}
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Macbook Slot */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Slot 1 (Left Promo / MacBook)</label>
              <select 
                value={form.macbookPromoId} 
                onChange={e => setForm(p => ({ ...p, macbookPromoId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none bg-gray-50 font-bold"
              >
                <option value="">Default (Auto-select by Title)</option>
                {allProducts.map(p => (
                   <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>
            {form.macbookPromoId && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                <img 
                  src={allProducts.find(p => p._id === form.macbookPromoId)?.displayImage} 
                  className="size-10 object-contain bg-white rounded-lg p-1" 
                  alt="preview"
                />
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Choice</p>
                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{allProducts.find(p => p._id === form.macbookPromoId)?.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Samsung Slot */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Slot 2 (Right Promo / Samsung)</label>
              <select 
                value={form.samsungPromoId} 
                onChange={e => setForm(p => ({ ...p, samsungPromoId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none bg-gray-50 font-bold"
              >
                <option value="">Default (Auto-select by Title)</option>
                {allProducts.map(p => (
                   <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>
            {form.samsungPromoId && (
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                <img 
                  src={allProducts.find(p => p._id === form.samsungPromoId)?.displayImage} 
                  className="size-10 object-contain bg-white rounded-lg p-1" 
                  alt="preview"
                />
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Choice</p>
                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{allProducts.find(p => p._id === form.samsungPromoId)?.title}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminSiteSettings;
