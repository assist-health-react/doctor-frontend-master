import api from './api';

export const getAllInfirmaryRecords = async (params = {}) => {
  try {
    // Convert params object to URLSearchParams
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    // Construct URL with query parameters
    const queryString = queryParams.toString();
    const url = `/api/v1/infirmary${queryString ? `?${queryString}` : ''}`;

    console.log('Fetching infirmary records with URL:', url);
    const response = await api.get(url);

    return {
      ...response,
      data: Array.isArray(response?.data?.data) ? response.data.data : []
    };
  } catch (error) {
    console.error('Error in getAllInfirmaryRecords:', error);
    throw error;
  }
};

export const getInfirmaryRecordById = async (id) => {
  try {
    const response = await api.get(`/api/v1/infirmary/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createInfirmaryRecord = async (data) => {
  try {
    // Log the request data
    console.log('Making infirmary API request with data:', data);
    
    const response = await api.post('/api/v1/infirmary', {
      ...data,
      schoolId: data.schoolId,  // Ensure these are explicitly included
      nurseId: data.nurseId
    });
    return response.data;
  } catch (error) {
    console.error('Infirmary API error:', {
      message: error.message,
      data: error.response?.data
    });
    throw error;
  }
};

export const updateInfirmaryRecord = async (id, data) => {
  try {
    const response = await api.put(`/api/v1/infirmary/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteInfirmaryRecord = async (id) => {
  try {
    const response = await api.delete(`/api/v1/infirmary/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllReports = async () => {
  try {
    const response = await api.get('/api/v1/infirmary');
    return response;
  } catch (error) {
    throw error;
  }
};

export const infirmaryService = {
  getAllInfirmaryRecords,
  getInfirmaryRecordById,
  createInfirmaryRecord,
  updateInfirmaryRecord,
  deleteInfirmaryRecord
}; 