'use client';

import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useCreateBrandMutation } from '@/redux/api/brandApi';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddBrand = () => {
  CheckRoleAndLogout('admin');
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState<string>('');
  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data: profileData } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const [createBrand] = useCreateBrandMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleAddBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!brandName || !brandImage) {
      toast.error('Please fill all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', brandImage);

      const uploadResult = await uploadImage(formData).unwrap();
      const imageUrl = uploadResult?.data?.url;

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      const brandData = {
        name: brandName,
        image: imageUrl,
      };

      const response = await createBrand(brandData).unwrap();
      if (response?.success) {
        toast.success('Brand created successfully');
        navigate('/dashboard/admin/manage-brands');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to create brand');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="main-container pb-8">
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold">Add New Brand</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Fill in the details to create a new brand.
      </p>

      <div className="lg:w-8/12 lg:mx-auto shadow px-4 py-8 lg:px-10 rounded mt-6 bg-white">
        <form onSubmit={handleAddBrand}>
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
              <input
                type="file"
                id="image"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-50 border focus:ring-orange focus:border-orange focus:outline-none"
                accept="image/*"
                required
                onChange={(e) => setBrandImage(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <div className="flex justify-end items-center mt-8">
            <button
              className="bg-orange rounded-md px-6 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Adding...' : 'Add Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
