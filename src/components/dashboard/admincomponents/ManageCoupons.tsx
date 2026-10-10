import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from '@/redux/api/couponApi';
import { useState } from 'react';
import { toast } from 'sonner';
import { FiPlus, FiTrash2, FiEdit3, FiTag } from 'react-icons/fi';

type TCoupon = {
  id: string;
  code: string;
  description?: string;
  discount: number;
  minAmount?: number;
  maxDiscount?: number;
  isActive: boolean;
  expiryDate?: string;
};

const emptyForm = { code: '', description: '', discount: 10, minAmount: 0, maxDiscount: 0, expiryDate: '', isActive: true };

const ManageCoupons = () => {
  const { data, isLoading } = useGetAllCouponsQuery('limit=100');
  const coupons: TCoupon[] = data?.data || [];
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: TCoupon) => {
    setEditId(c.id);
    setForm({
      code: c.code, description: c.description || '',
      discount: c.discount, minAmount: c.minAmount || 0,
      maxDiscount: c.maxDiscount || 0,
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : '',
      isActive: c.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      description: form.description || undefined,
      discount: Number(form.discount),
      minAmount: form.minAmount ? Number(form.minAmount) : undefined,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
      isActive: form.isActive,
    };
    try {
      if (editId) {
        await updateCoupon({ id: editId, ...payload }).unwrap();
        toast.success('Coupon updated!');
      } else {
        await createCoupon(payload).unwrap();
        toast.success('Coupon created!');
      }
      setShowModal(false);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try { await deleteCoupon(id).unwrap(); toast.success('Coupon deleted!'); } catch {}
  };

  const toggleActive = async (c: TCoupon) => {
    try { await updateCoupon({ id: c.id, isActive: !c.isActive }).unwrap(); toast.success(`Coupon ${c.isActive ? 'deactivated' : 'activated'}!`); } catch {}
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manage Coupons</h2>
          <p className="text-gray-400 text-sm mt-1">Create and manage discount coupon codes.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all">
          <FiPlus className="text-base" /> New Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons', value: coupons.length, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active', value: coupons.filter(c => c.isActive).length, color: 'bg-green-50 text-green-600' },
          { label: 'Inactive', value: coupons.filter(c => !c.isActive).length, color: 'bg-red-50 text-red-600' },
          { label: 'Avg Discount', value: coupons.length ? `${(coupons.reduce((a, c) => a + c.discount, 0) / coupons.length).toFixed(1)}%` : '—', color: 'bg-orange-50 text-orange-600' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <FiTag className="text-orange-500" />
          <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">All Coupons</h3>
        </div>
        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="size-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm font-bold">No coupons found. Create one!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Min Amount</th>
                  <th className="px-6 py-3">Max Discount</th>
                  <th className="px-6 py-3">Expiry</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-gray-900 tracking-wider">{c.code}</td>
                    <td className="px-6 py-4 font-black text-orange-500">{c.discount}%</td>
                    <td className="px-6 py-4 text-gray-600">{c.minAmount ? `$${c.minAmount}` : '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{c.maxDiscount ? `$${c.maxDiscount}` : '—'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'No expiry'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleActive(c)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${c.isActive ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-500' : 'bg-red-100 text-red-500 hover:bg-green-100 hover:text-green-600'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(c)} className="size-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors"><FiEdit3 className="text-sm" /></button>
                        <button onClick={() => handleDelete(c.id)} className="size-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><FiTrash2 className="text-sm" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-gray-900">{editId ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-xl font-black">×</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Code *</label>
                  <input required value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="e.g. SAVE20" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Discount % *</label>
                  <input required type="number" min="1" max="100" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Min Order Amount ($)</label>
                  <input type="number" min="0" value={form.minAmount} onChange={e => setForm(p => ({ ...p, minAmount: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Max Discount ($)</label>
                  <input type="number" min="0" value={form.maxDiscount} onChange={e => setForm(p => ({ ...p, maxDiscount: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Optional note" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm font-bold text-gray-600">{form.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-black py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 bg-orange-500 text-white font-black py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-all disabled:opacity-50">
                  {creating ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
