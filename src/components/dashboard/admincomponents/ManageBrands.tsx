/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetAllBrandsQuery, useDeleteBrandMutation, useApproveBrandMutation } from '@/redux/api/brandApi';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ManageBrands = () => {
  CheckRoleAndLogout('admin');

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  // Fetch all brands (Approved and Pending) to manage
  const { data: brandsData, isLoading: isBrandsLoading } = useGetAllBrandsQuery('status=all');
  const brands = brandsData?.data;

  const [deleteBrand] = useDeleteBrandMutation();
  const [approveBrand] = useApproveBrandMutation();

  const handleApproveBrand = async (id: string) => {
    try {
      const response = await approveBrand(id).unwrap();
      if (response?.success) {
        toast.success('Brand approved successfully');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve brand');
    }
  };

  const handleDeleteBrand = async (id: string) => {
    const allow = window.confirm('Are you sure you want to delete this brand?');
    if (!allow) return;

    try {
      const response = await deleteBrand(id).unwrap();
      if (response?.success) {
        toast.success('Brand deleted successfully');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete brand');
    }
  };

  if (isProfileLoading || isBrandsLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Manage Brands</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Here you can manage product brands.
      </p>

      <div className="lg:w-11/12 lg:mx-auto">
        <div className="flex justify-between items-center mt-8">
          <Link to="/dashboard/admin/manage-brands/add-brand">
            <div className="bg-orange rounded-md px-4 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-3">
              <IoIosAddCircleOutline style={{ fontSize: '18px' }} />
              <span>Add Brand</span>
            </div>
          </Link>
        </div>

        <div className="mb-10 lg:mb-24 lg:mt-8 lg:shadow-md lg:rounded-md lg:py-5 lg:px-6 lg:pb-8 bg-white text-dark">
          <div className="mt-8 lg:mt-2">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Image</th>
                    <th scope="col" className="px-6 py-3">Brand Name</th>
                    <th scope="col" className="px-6 py-3">Requested By</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {brands?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-red-400 font-semibold">
                        No Brand Found
                      </td>
                    </tr>
                  ) : (
                    brands?.map((brand: any) => (
                      <tr className="bg-white border-b hover:bg-orange-50 transition-colors" key={brand.id}>
                        <td className="px-6 py-4">
                          <img src={brand.image} alt={brand.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap uppercase">
                          {brand.name}
                        </th>
                        <td className="px-6 py-4 text-xs">
                          {brand.vendorEmail || <span className="text-gray-400">Admin</span>}
                        </td>
                        <td className={`px-6 py-4 font-semibold ${brand.status === 'APPROVED' ? 'text-green-500' : 'text-orange-500'}`}>
                          {brand.status}
                        </td>
                        <td className="px-6 py-4 flex space-x-4 justify-end items-center">
                          {brand.status === 'PENDING' && (
                            <button
                              className="text-xl text-green-500 hover:text-green-700 transition-colors"
                              title="Approve Brand"
                              onClick={() => handleApproveBrand(brand.id)}
                            >
                              <IoCheckmarkCircleOutline />
                            </button>
                          )}
                          <Link to={`/dashboard/admin/manage-brands/update-brand/${brand.id}`}>
                            <button className="text-xl text-orange hover:text-orange-600 transition-colors" title="Update Brand">
                              <CiEdit />
                            </button>
                          </Link>
                          <button
                            className="text-xl text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Brand"
                            onClick={() => handleDeleteBrand(brand.id)}
                          >
                            <AiOutlineDelete />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBrands;
