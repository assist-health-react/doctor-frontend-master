import api from './api';

export const blogsService = {
  getAllBlogs: async (page = 1, limit = 10, status = '', searchTerm = '') => {
    try {
      let url = `/api/v1/blogs?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBlogById: async (id) => {
    try {
      const response = await api.get(`/api/v1/blogs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await api.post('/api/v1/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  createBlog: async (blogData) => {
    try {
      const response = await api.post('/api/v1/blogs', blogData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateBlog: async (id, blogData) => {
    try {
      const response = await api.put(`/api/v1/blogs/${id}`, blogData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/api/v1/blogs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default blogsService; 