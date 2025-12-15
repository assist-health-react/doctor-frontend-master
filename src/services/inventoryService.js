import api from './api';

export const getAllInventoryItems = async (params = {}) => {
  try {
    // Ensure we're using the MongoDB ObjectId for schoolId
    const queryParams = {
      ...params,
      schoolId: params.schoolId || undefined
    };
    const response = await api.get('/api/v1/inventory', { params: queryParams });
    return {
      ...response,
      data: Array.isArray(response?.data?.data) ? response.data.data : []
    };
  } catch (error) {
    throw error;
  }
};

export const getInventoryItemById = async (id) => {
  try {
    const response = await api.get(`/api/v1/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createInventoryItem = async (data) => {
  try {
    const response = await api.post('/api/v1/inventory', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateInventoryItem = async (id, data) => {
  try {
    const response = await api.put(`/api/v1/inventory/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const response = await api.delete(`/api/v1/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}; 