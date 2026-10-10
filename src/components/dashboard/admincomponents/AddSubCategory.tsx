'use client';

import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi';
import { useCreateSubCategoryMutation } from '@/redux/api/subcategoryApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddSubCategory = () => {
  CheckRoleAndLogout('admin');
  const navigate = useNavigate();

  const [subCategoryName, setSubCategoryName] = useState<string>('');
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data: profileData } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
  const categories = categoriesData?.data;

  const [createSubCategory] = useCreateSubCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleAddSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!subCategoryName || !subCategoryImage || !categoryId) {
      toast.error('Please fill all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', subCategoryImage);

      const uploadResult = await uploadImage(formData).unwrap();
      const imageUrl = uploadResult?.data?.url;

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      const subCategoryData = {
        name: subCategoryName,
        image: imageUrl,
        categoryId,
      };

      const response = await createSubCategory(subCategoryData).unwrap();
      if (response?.success) {
        toast.success('SubCategory created successfully');
        navigate('/dashboard/admin/manage-subcategories');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to create subcategory');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="main-container pb-8">
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Add New SubCategory</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Fill in the details to create a new subcategory.
      </p>

      <div className="lg:w-8/12 lg:mx-auto shadow px-4 py-8 lg:px-10 rounded mt-6 bg-white">
        <form onSubmit={handleAddSubCategory}>
          <div className="grid gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-semibold">SubCategory Name</label>
              <input
                type="text"
                id="name"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                placeholder="e.g. Laptops"
                required
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="block mb-2 text-sm font-semibold">Parent Category</label>
              <select
                id="category"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories?.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm font-semibold">SubCategory Image</label>
              <input
                type="file"
                id="image"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                accept="image/*"
                required
                onChange={(e) => setSubCategoryImage(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <div className="flex justify-end items-center mt-8">
            <button
              className="bg-orange rounded-md px-6 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Adding...' : 'Add SubCategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;
