/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetAllSubCategoriesQuery, useDeleteSubCategoryMutation } from '@/redux/api/subcategoryApi';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ManageSubCategories = () => {
  CheckRoleAndLogout('admin');

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } = useGetAllSubCategoriesQuery(undefined);
  const subCategories = subCategoriesData?.data;

  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const handleDeleteSubCategory = async (id: string) => {
    const allow = window.confirm('Are you sure you want to delete this subcategory?');
    if (!allow) return;

    try {
      const response = await deleteSubCategory(id).unwrap();
      if (response?.success) {
        toast.success('SubCategory deleted successfully');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete subcategory');
    }
  };

  if (isProfileLoading || isSubCategoriesLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Manage SubCategories</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Here you can manage product subcategories.
      </p>

      <div className="lg:w-11/12 lg:mx-auto">
        <div className="flex justify-between items-center mt-8">
          <Link to="/dashboard/admin/manage-subcategories/add-subcategory">
            <div className="bg-orange rounded-md px-4 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-3">
              <IoIosAddCircleOutline style={{ fontSize: '18px' }} />
              <span>Add SubCategory</span>
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
                    <th scope="col" className="px-6 py-3">SubCategory Name</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-red-400 font-semibold">
                        No SubCategory Found
                      </td>
                    </tr>
                  ) : (
                    subCategories?.map((subCategory: any) => (
                      <tr className="bg-white border-b hover:bg-orange-50 transition-colors" key={subCategory.id}>
                        <td className="px-6 py-4">
                          <img src={subCategory.image} alt={subCategory.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                        </td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap uppercase">
                          {subCategory.name}
                        </th>
                        <td className="px-6 py-4 font-medium text-gray-600 uppercase">
                          {subCategory.category?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 flex space-x-4 justify-end items-center">
                          <Link to={`/dashboard/admin/manage-subcategories/update-subcategory/${subCategory.id}`}>
                            <button className="text-xl text-orange hover:text-orange-600 transition-colors" title="Update SubCategory">
                              <CiEdit />
                            </button>
                          </Link>
                          <button
                            className="text-xl text-red-500 hover:text-red-700 transition-colors"
                            title="Delete SubCategory"
                            onClick={() => handleDeleteSubCategory(subCategory.id)}
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

export default ManageSubCategories;
