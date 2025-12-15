import api from './api';

export const medicalHistoryService = {
  getMedicalHistoryById: async (historyId, memberId) => {
    try {
      if (!historyId || !memberId) {
        throw new Error('Both History ID and Member ID are required');
      }

      console.log('Fetching medical history:', { historyId, memberId });
      const response = await api.get(`/api/v1/medical-history/${memberId}?id=${historyId}`);
      
      if (response?.data?.status === 'success' && response?.data?.data) {
        return {
          status: 'success',
          data: response.data.data
        };
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error fetching medical history:', error);
      throw error;
    }
  },

  createMedicalHistory: async (data) => {
    try {
      if (!data.memberId) {
        throw new Error('Member ID is required');
      }

      console.log('Creating medical history:', data);
      const response = await api.post(`/api/v1/medical-history/${data.memberId}`, data);
      
      if (response?.data?.status === 'success' && response?.data?.data) {
        return {
          status: 'success',
          data: response.data.data
        };
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error creating medical history:', error);
      throw error;
    }
  },

  updateMedicalHistory: async (historyId, memberId, data) => {
    try {
      if (!historyId || !memberId) {
        throw new Error('Both History ID and Member ID are required');
      }

      console.log('Updating medical history:', { historyId, memberId, data });
      const response = await api.patch(`/api/v1/medical-history/${memberId}?id=${historyId}`, data);
      
      if (response?.data?.status === 'success' && response?.data?.data) {
        return {
          status: 'success',
          data: response.data.data
        };
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error updating medical history:', error);
      throw error;
    }
  },

  deleteMedicalHistory: async (historyId, memberId) => {
    try {
      if (!historyId || !memberId) {
        throw new Error('Both History ID and Member ID are required');
      }

      console.log('Deleting medical history:', { historyId, memberId });
      const response = await api.delete(`/api/v1/medical-history/${memberId}?id=${historyId}`);
      
      if (response?.data?.status === 'success') {
        return {
          status: 'success'
        };
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error deleting medical history:', error);
      throw error;
    }
  }
};

export default medicalHistoryService; 