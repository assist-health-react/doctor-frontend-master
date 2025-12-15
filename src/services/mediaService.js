import api from './api';

export const uploadMedia = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/v1/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Log the response for debugging
    console.log('Media upload API response:', response);

    // Check if response has data property (axios wraps the response in data)
    const data = response.data || response;

    // Check if response has the expected structure
    if (data?.success && data?.imageUrl) {
      return {
        success: true,
        imageUrl: data.imageUrl,
        metadata: data.metadata || {}
      };
    }

    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error.response?.data?.message ? new Error(error.response.data.message) : error;
  }
};

export const deleteMedia = async (url) => {
  try {
    const response = await api.delete('/api/v1/media/delete', {
      data: { url }
    });

    const data = response.data || response;

    if (data?.success) {
      return true;
    }

    throw new Error('Failed to delete media');
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error.response?.data?.message ? new Error(error.response.data.message) : error;
  }
};

export default {
  uploadMedia,
  deleteMedia
}; 