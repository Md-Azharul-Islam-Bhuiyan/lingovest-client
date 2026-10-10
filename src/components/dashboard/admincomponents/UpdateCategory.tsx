'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useGetSingleCategoryQuery, useUpdateCategoryMutation } from '@/redux/api/categoryApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const UpdateCategory = () => {
  CheckRoleAndLogout('admin');
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: categoryData, isLoading: isCategoryLoading } = useGetSingleCategoryQuery(id);
  const [updateCategory] = useUpdateCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryImage, setCategoryImage] = useState<string>('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data: profileData } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  useEffect(() => {
    if (categoryData?.data) {
      setCategoryName(categoryData.data.name);
      setCategoryImage(categoryData.data.image);
    }
  }, [categoryData]);

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = categoryImage;

      if (newImageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', newImageFile);
        const uploadResult = await uploadImage(formData).unwrap();
        imageUrl = uploadResult?.data?.url;
        if (!imageUrl) throw new Error('Failed to upload new image');
      }

      if (!categoryName || !imageUrl) {
        toast.error('Please fill all fields');
        setIsSubmitting(false);
        setIsUploading(false);
        return;
      }

      const response = await updateCategory({ id, name: categoryName, image: imageUrl }).unwrap();
      if (response?.success) {
        toast.success('Category updated successfully');
        navigate('/dashboard/admin/manage-categories');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (isCategoryLoading) {
    return <Loader />;
  }

  return (
    <div className="main-container pb-8">
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Update Category</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Update the category details below.
      </p>

      <div className="lg:w-8/12 lg:mx-auto shadow px-4 py-8 lg:px-10 rounded mt-6 bg-white">
        <form onSubmit={handleUpdateCategory}>
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
              {categoryImage && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img src={categoryImage} alt="current" className="h-20 w-20 object-cover rounded border" />
                </div>
              )}
              <input
                type="file"
                id="image"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                accept="image/*"
                onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank to keep existing image</p>
            </div>
          </div>
          <div className="flex justify-end items-center mt-8">
            <button
              className="bg-orange rounded-md px-6 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
