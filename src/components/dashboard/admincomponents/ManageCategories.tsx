/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from '@/redux/api/categoryApi';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ManageCategories = () => {
  CheckRoleAndLogout('admin');

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery(undefined);
  const categories = categoriesData?.data;

  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDeleteCategory = async (id: string) => {
    const allow = window.confirm('Are you sure you want to delete this category?');
    if (!allow) return;

    try {
      const response = await deleteCategory(id).unwrap();
      if (response?.success) {
        toast.success('Category deleted successfully');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete category');
    }
  };

  if (isProfileLoading || isCategoriesLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Manage Categories</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Here you can manage product categories.
      </p>

      <div className="lg:w-11/12 lg:mx-auto">
        <div className="flex justify-between items-center mt-8">
          <Link to="/dashboard/admin/manage-categories/add-category">
            <div className="bg-orange rounded-md px-4 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-3">
              <IoIosAddCircleOutline style={{ fontSize: '18px' }} />
              <span>Add Category</span>
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
                    <th scope="col" className="px-6 py-3">Category Name</th>
                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-red-400 font-semibold">
                        No Category Found
                      </td>
                    </tr>
                  ) : (
                    categories?.map((category: any) => (
                      <tr className="bg-white border-b hover:bg-orange-50 transition-colors" key={category.id}>
                        <td className="px-6 py-4">
                          <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap uppercase">
                          {category.name}
                        </th>
                        <td className="px-6 py-4 flex space-x-4 justify-end items-center">
                          <Link to={`/dashboard/admin/manage-categories/update-category/${category.id}`}>
                            <button className="text-xl text-orange hover:text-orange-600 transition-colors" title="Update Category">
                              <CiEdit />
                            </button>
                          </Link>
                          <button
                            className="text-xl text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Category"
                            onClick={() => handleDeleteCategory(category.id)}
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

export default ManageCategories;
