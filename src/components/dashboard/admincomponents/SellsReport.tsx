'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useGetAllOrdersForAdminHistoryQuery } from '@/redux/api/orderApi';
import { useEffect, useState } from 'react';

const SellsReport = () => {
  CheckRoleAndLogout('admin');

  const [timeframe, setTimeframe] = useState<string>('monthly');
  const [customersEmail, setCustomersEmail] = useState<string>('');

  /* pagination */
  const [page, setPage] = useState<string>('1');
  const limit = '10';
  const handlePageChange = (page: number) => {
    setPage(page.toString());
  };

  /* query */
  const allFilters = {
    page: page,
    limit: limit,
    timeframe: timeframe,
    customersEmail: customersEmail,
  };

  const createQueryString = (obj: any) => {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
      );
    }
    return keyValuePairs.join('&');
  };

  let queryParams = createQueryString(allFilters);

  useEffect(() => {
    queryParams = createQueryString({
      page,
      limit,
      timeframe,
      customersEmail,
    });
  }, [page, limit, customersEmail, timeframe]);

  const { data: orders, isLoading: isAllOrdersLoading } =
    useGetAllOrdersForAdminHistoryQuery(queryParams, {
      refetchOnMountOrArgChange: true,
    });
  const allOrders = orders?.data?.data;

  const { data: profileData, isLoading } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const totalItems = orders?.data?.meta?.total || 0;
  const totalPages = Math.ceil(Number(totalItems) / Number(limit));

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#f8f6f2] p-4 lg:p-8 space-y-8 font-sans">
      
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight mb-2">Sells Report</h3>
        <p className="text-sm font-bold text-slate-400 leading-relaxed md:w-2/3">
          Welcome, {userProfileFromDb?.name}! Here you can explore the total sales history of Shopora. Analyze specific timeframes to generate insights and track your business's growth trajectory.
        </p>
      </div>

      {/* buttons */}
      <div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3 mb-8">
          {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
             <button
                key={tf}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  timeframe === tf 
                     ? 'bg-orange text-white shadow-md' 
                     : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                }`}
                onClick={() => setTimeframe(tf)}
             >
                {tf}
             </button>
          ))}
        </div>
      </div>

      {/* summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center gap-y-2 relative overflow-hidden group">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">Total Sells Completed</p>
          <h3 className="text-4xl font-black text-slate-800 relative z-10">{allOrders?.completedSells || 0}</h3>
          <div className="absolute right-0 bottom-0 text-orange/5 group-hover:text-orange/10 transition-colors pointer-events-none -mr-4 -mb-4">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center gap-y-2 relative overflow-hidden group">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">Total Sells Revenue</p>
          <h3 className="text-4xl font-black text-slate-800 relative z-10">${allOrders?.totalSells?.toFixed(2) || 0}</h3>
          <div className="absolute right-0 bottom-0 text-indigo-500/5 group-hover:text-indigo-500/10 transition-colors pointer-events-none -mr-4 -mb-4">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>

        <div className="bg-[#ffedd5] p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-center gap-y-2 relative overflow-hidden group">
          <p className="text-xs font-bold text-slate-600/70 uppercase tracking-widest relative z-10">Shopora Profit</p>
          <h3 className="text-4xl font-black text-orange relative z-10">${allOrders?.gizmobuyProfit?.toFixed(2) || 0}</h3>
          <div className="absolute right-0 bottom-0 text-orange/10 group-hover:text-orange/20 transition-colors pointer-events-none -mr-4 -mb-4">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
      </div>

      {/* order list table */}
      <div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h4 className="text-xl font-black text-slate-800">Ledger Details</h4>
          </div>

          <div className="relative overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm text-left rtl:text-right text-slate-600">
              <thead className="bg-[#f8f6f2] text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th scope="col" className="px-8 py-4">Order ID</th>
                  <th scope="col" className="px-6 py-4">Customer Email</th>
                  <th scope="col" className="px-6 py-4">Date of Order</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Bill Paid</th>
                </tr>
              </thead>

              <tbody>
                {
                  // if orders are loading
                  isAllOrdersLoading ? (
                    <tr><td colSpan={5}>
                      <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full size-8 border-b-2 border-orange"></div>
                      </div>
                    </td></tr>
                  ) : null
                }
                {!isAllOrdersLoading && allOrders?.orders?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center font-bold text-slate-400 py-12">
                      No Records Found For This Timeframe.
                    </td>
                  </tr>
                ) : null}
                {!isAllOrdersLoading && allOrders?.orders?.length > 0
                  ? allOrders?.orders?.map((order: any) => (
                      <tr
                        className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        key={order?.orderId}
                      >
                        <th
                          scope="row"
                          className="px-8 py-5 font-black text-slate-800 whitespace-nowrap"
                        >
                          {order?.orderId}
                        </th>
                        <td className="px-6 py-5 font-medium">{`${order?.orderBy}`}</td>
                        <td className="px-6 py-5 font-bold text-slate-500">{`${order?.createdAt.slice(
                          0,
                          10
                        )}`}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order?.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {order?.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-5 font-black ${
                            order?.isPaid ? 'text-slate-800' : 'text-rose-500'
                          }`}
                        >{`$${order?.totalBill}`}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>

          {/*  pagination */}
          {isAllOrdersLoading || allOrders?.orders?.length === 0 ? (
            <div></div>
          ) : (
            <div className={`flex justify-end mt-8 items-center gap-2`}>
              <button
                className={`px-4 py-2 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                onClick={() => handlePageChange(Number(page) - 1)}
                disabled={Number(page) === 1}
              >
                Prev
              </button>
              {[...Array(Math.min(totalPages, 5)).keys()].map((index) => {
                const pageNumber = Number(page) - 2 + index;
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      className={`size-8 flex items-center justify-center font-bold text-xs rounded-xl transition-colors ${
                        Number(page) === pageNumber ? 'bg-orange text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={Number(page) === pageNumber}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              <button
                className={`px-4 py-2 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                onClick={() => handlePageChange(Number(page) + 1)}
                disabled={Number(page) === totalPages}
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SellsReport;
