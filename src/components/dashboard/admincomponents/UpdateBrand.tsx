'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useGetSingleBrandQuery, useUpdateBrandMutation } from '@/redux/api/brandApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const UpdateBrand = () => {
  CheckRoleAndLogout('admin');
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: brandData, isLoading: isBrandLoading } = useGetSingleBrandQuery(id);
  const [updateBrand] = useUpdateBrandMutation();
  const [uploadImage] = useUploadImageMutation();

  const [brandName, setBrandName] = useState<string>('');
  const [brandImage, setBrandImage] = useState<string>('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data: profileData } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  useEffect(() => {
    if (brandData?.data) {
      setBrandName(brandData.data.name);
      setBrandImage(brandData.data.image);
    }
  }, [brandData]);

  const handleUpdateBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = brandImage;

      if (newImageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', newImageFile);
        const uploadResult = await uploadImage(formData).unwrap();
        imageUrl = uploadResult?.data?.url;
        if (!imageUrl) throw new Error('Failed to upload new image');
      }

      if (!brandName || !imageUrl) {
        toast.error('Please fill all fields');
        setIsSubmitting(false);
        setIsUploading(false);
        return;
      }

      const response = await updateBrand({ id, name: brandName, image: imageUrl }).unwrap();
      if (response?.success) {
        toast.success('Brand updated successfully');
        navigate('/dashboard/admin/manage-brands');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update brand');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (isBrandLoading) {
    return <Loader />;
  }

  return (
    <div className="main-container pb-8">
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Update Brand</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Update the brand details below.
      </p>

      <div className="lg:w-8/12 lg:mx-auto shadow px-4 py-8 lg:px-10 rounded mt-6 bg-white">
        <form onSubmit={handleUpdateBrand}>
          <div className="grid gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-semibold">Brand Name</label>
              <input
                type="text"
                id="name"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                placeholder="e.g. Samsung"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm font-semibold">Brand Image</label>
              {brandImage && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img src={brandImage} alt="current" className="h-16 w-16 object-cover rounded border" />
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
              {isUploading ? 'Uploading...' : isSubmitting ? 'Updating...' : 'Update Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBrand;
