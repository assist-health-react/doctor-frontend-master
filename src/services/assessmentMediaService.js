import api from './api';

const assessmentMediaService = {
  uploadMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading assessment file:', file.name, file.type, file.size);

      const response = await api.post('/api/v1/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response);

      // Check if response exists and has the expected structure
      if (response && response.success && response.imageUrl) {
        console.log('Successfully uploaded assessment file. URL:', response.imageUrl);
        return response.imageUrl;
      }

      // If we get here, the response structure is unexpected
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from upload API');
    } catch (error) {
      console.error('Assessment upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to upload assessment file');
    }
  },
};

export default assessmentMediaService; 