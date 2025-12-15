import { FaUpload, FaImage, FaSignature, FaSpinner } from 'react-icons/fa';

const FileUploadSection = ({ 
  profilePreview, 
  signaturePreview, 
  handleFileChange,
  isUploadingProfile,
  isUploadingSignature
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Profile Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
            {profilePreview ? (
              <img
                src={profilePreview}
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
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isUploadingProfile ? (
                <FaSpinner className="mr-2 -ml-1 h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
              )}
              {isUploadingProfile ? 'Uploading...' : 'Upload Photo'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profile')}
                disabled={isUploadingProfile}
              />
            </label>
            <p className="mt-1 text-sm text-gray-500">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Signature Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Signature
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
            {signaturePreview ? (
              <img
                src={signaturePreview}
                alt="Signature preview"
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaSignature className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isUploadingSignature ? (
                <FaSpinner className="mr-2 -ml-1 h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
              )}
              {isUploadingSignature ? 'Uploading...' : 'Upload Signature'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'signature')}
                disabled={isUploadingSignature}
              />
            </label>
            <p className="mt-1 text-sm text-gray-500">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection; 