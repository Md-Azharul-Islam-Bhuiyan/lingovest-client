import Loader from '@/components/common/Loader';
import { useCreateNewsMutation, useDeleteNewsMutation, useGetAllNewsQuery, useUpdateNewsMutation } from '@/redux/api/newsApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useState } from 'react';
import { FiEdit3, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';

type TNews = { id: string; headline: string; image?: string; content?: string; tag?: string; isActive: boolean; createdAt: string };

const ManageNews = () => {
  const { data: newsData, isLoading } = useGetAllNewsQuery(false);
  const [createNews] = useCreateNewsMutation();
  const [updateNews] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();
  const [uploadImage] = useUploadImageMutation();

  const newsList: TNews[] = newsData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({ id: '', headline: '', image: '', content: '', tag: '', isActive: true });

  const handleOpenModal = (news?: TNews) => {
    if (news) {
      setForm({
        id: news.id,
        headline: news.headline,
        image: news.image || '',
        content: news.content || '',
        tag: news.tag || '',
        isActive: news.isActive,
      });
    } else {
      setForm({ id: '', headline: '', image: '', content: '', tag: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadImage(formData).unwrap();
      setForm({ ...form, image: res.data.url });
      toast.success('Image uploaded!');
    } catch {
      toast.error('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.headline.trim()) return toast.error('Headline is required.');
    
    try {
      if (form.id) {
        await updateNews({ id: form.id, headline: form.headline, image: form.image, content: form.content, tag: form.tag, isActive: form.isActive }).unwrap();
        toast.success('Blog post updated!');
      } else {
        await createNews({ headline: form.headline, image: form.image, content: form.content, tag: form.tag, isActive: form.isActive }).unwrap();
        toast.success('Blog post created!');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Operation failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteNews(id).unwrap();
      toast.success('Post deleted successfully');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2">Manage Blog & News</h2>
          <p className="text-gray-500 text-sm">Create and edit news articles and ticker headlines.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/20 text-white font-black py-3 px-6 rounded-xl text-sm uppercase tracking-widest transition-all"
        >
          <FiPlus className="text-lg" /> Create Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Headline</th>
                <th className="px-6 py-4">Tag</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {newsList.map((n) => (
                <tr key={n.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4">
                    {n.image ? (
                      <img src={n.image} alt={n.headline} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><FiImage /></div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 shrink-0 max-w-xs truncate">{n.headline}</td>
                  <td className="px-6 py-4 text-orange-500 font-bold text-xs">{n.tag || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${n.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {n.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium text-xs">{new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(n)} className="inline-flex items-center justify-center size-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <FiEdit3 />
                    </button>
                    <button onClick={() => handleDelete(n.id)} className="inline-flex items-center justify-center size-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {newsList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">No news posts found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{form.id ? 'Edit Post' : 'Create New Post'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Headline</label>
                  <input required value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="News or article title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Tag/Category</label>
                    <input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="e.g. Technology" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Status</label>
                    <select value={form.isActive.toString()} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">
                      <option value="true">Active (Visible)</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {form.image && <img src={form.image} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-gray-200" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100" />
                  </div>
                  {uploadingImage && <p className="text-xs text-orange-500 mt-2 font-bold animate-pulse">Uploading image...</p>}
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Post Content</label>
                  <textarea rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Write the full post here..." />
                </div>
              </div>
            </form>
            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
              <button disabled={uploadingImage} onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50">Save Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNews;
