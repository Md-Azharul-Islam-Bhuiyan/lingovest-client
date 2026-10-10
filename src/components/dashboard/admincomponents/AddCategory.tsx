'use client';

import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useCreateCategoryMutation } from '@/redux/api/categoryApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddCategory = () => {
  CheckRoleAndLogout('admin');
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data: profileData } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const [createCategory] = useCreateCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!categoryName || !categoryImage) {
      toast.error('Please fill all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', categoryImage);

      const uploadResult = await uploadImage(formData).unwrap();
      const imageUrl = uploadResult?.data?.url;

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      const categoryData = {
        name: categoryName,
        image: imageUrl,
      };

      const response = await createCategory(categoryData).unwrap();
      if (response?.success) {
        toast.success('Category created successfully');
        navigate('/dashboard/admin/manage-categories');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="main-container pb-8">
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Add New Category</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Fill in the details to create a new category.
      </p>

      <div className="lg:w-8/12 lg:mx-auto shadow px-4 py-8 lg:px-10 rounded mt-6 bg-white">
        <form onSubmit={handleAddCategory}>
          <div className="grid gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-semibold">Category Name</label>
              <input
                type="text"
                id="name"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                placeholder="e.g. Electronics"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm font-semibold">Category Image</label>
              <input
                type="file"
                id="image"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                accept="image/*"
                required
                onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <div className="flex justify-end items-center mt-8">
            <button
              className="bg-orange rounded-md px-6 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
