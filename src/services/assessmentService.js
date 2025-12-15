import api from './api';

export const getAllAssessments = async (params = {}) => {
  try {
    const response = await api.get('/api/v1/assessments', { params });
    return {
      ...response,
      data: Array.isArray(response?.data?.data) ? response.data.data : []
    };
  } catch (error) {
    throw error;
  }
};

export const getAssessmentById = async (id) => {
  try {
    const response = await api.get(`/api/v1/assessments/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createAssessment = async (data) => {
  try {
    const response = await api.post('/api/v1/assessments', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateAssessment = async (id, data) => {
  try {
    const response = await api.put(`/api/v1/assessments/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAssessment = async (id) => {
  try {
    const response = await api.delete(`/api/v1/assessments/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}; 