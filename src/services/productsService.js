import api from './api';

export const productsService = {
  getAllProducts: async (page = 1, limit = 10, searchTerm = '') => {
    try {
      let url = `/api/v1/products?page=${page}&limit=${limit}`;
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/v1/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/v1/products', productData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/api/v1/products/${id}`, productData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/api/v1/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default productsService; 