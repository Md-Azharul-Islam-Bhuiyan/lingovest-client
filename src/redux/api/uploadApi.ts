import { baseApi } from './baseApi';
import { toast } from 'sonner';

const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      queryFn: async (formData: FormData, _queryApi, _extraOptions, fetchWithBaseQuery) => {
        // Detect if we are running on localhost
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocalhost) {
          // Localhost: Use Backend (Multer proxy to Cloudinary)
          const result = await (fetchWithBaseQuery as any)({
            url: '/upload',
            method: 'POST',
            body: formData,
          });
          return result.data ? { data: result.data } : { error: result.error };
        } else {
          // Vercel / Live Deploy: Direct Cloudinary Upload (Blogpost style)
          const file = formData.get('file') as File;
          if (!file) {
            return { error: { status: 400, data: { message: 'No file provided' } } };
          }
          
          try {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', file);
            
            // Note: You must ensure this upload preset exists in your Cloudinary account
            // and is configured for "Unsigned" uploads.
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'shopora_preset';
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'du8up6ltg';
            
            cloudinaryFormData.append('upload_preset', uploadPreset);
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
              method: 'POST',
              body: cloudinaryFormData,
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Cloudinary direct upload failed:', errorData);
              return { error: { status: response.status, data: errorData } };
            }
            
            const data = await response.json();
            
            // Return exactly what the backend proxy would return
            return {
              data: {
                success: true,
                message: 'File uploaded successfully via Cloudinary direct',
                data: {
                  url: data.secure_url,
                  publicId: data.public_id,
                }
              }
            };
          } catch (error: any) {
            console.error('Direct Cloudinary upload error:', error);
            return { error: { status: 500, data: { message: 'Cloudinary direct upload failed' } } };
          }
        }
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
