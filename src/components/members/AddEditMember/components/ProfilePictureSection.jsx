import React from 'react';
import { FaSpinner, FaImage, FaUpload } from 'react-icons/fa';
import { uploadMedia } from '../../../../services/mediaService';

const ProfilePictureSection = ({ 
  formData, 
  setFormData, 
  isUploadingImage, 
  setIsUploadingImage,
  setError 
}) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadingImage(true);
        setError(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Please upload an image file');
        }
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File size should be less than 10MB');
        }

        // Upload image using mediaService
        const response = await uploadMedia(file);
        console.log('Upload response:', response);

        if (response?.success && response?.imageUrl) {
          setFormData(prev => ({
            ...prev,
            profilePic: response.imageUrl,
            profilePicUrl: response.imageUrl
          }));
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        let errorMessage = err.message || 'Failed to upload image';
        
        if (err.response?.status === 413) {
          errorMessage = 'File size too large. Please upload a smaller image (max 10MB)';
        } else if (err.response?.status === 415) {
          errorMessage = 'Invalid file type. Please upload only images (PNG, JPG, GIF)';
        }
        
        setError(errorMessage);
        // Reset the file input
        e.target.value = '';
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Picture
      </label>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
          {isUploadingImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : formData.profilePicUrl ? (
            <img
              src={formData.profilePicUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FaImage className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
            isUploadingImage ? 'bg-gray-100 text-gray-500' : 'text-gray-700 bg-white hover:bg-gray-50'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
            {isUploadingImage ? (
              <>
                <FaSpinner className="mr-2 -ml-1 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
                Upload Photo
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploadingImage}
            />
          </label>
          <p className="mt-1 text-sm text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
          {formData.profilePicUrl && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                profilePic: null, 
                profilePicUrl: '', 
                imageUrl: '' 
              }))}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureSection; 