import api from './api'

const BASE_URL = '/api/v1/schools'

export const getAllSchools = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`${BASE_URL}?page=${page}&limit=${limit}`)
    console.log('Raw API Response:', response)

    // If response is an array, return it directly
    if (Array.isArray(response.data)) {
      return {
        status: 'success',
        data: response.data
      }
    }

    // If response is in { status, data } format
    if (response?.data?.status === 'success' && response?.data?.data) {
      return response.data
    }
    
    // If response.data is the array directly
    if (Array.isArray(response?.data?.data)) {
      return {
        status: 'success',
        data: response.data.data
      }
    }

    console.error('Unexpected schools response format:', response)
    return {
      status: 'error',
      data: [],
      message: 'Unexpected response format'
    }
  } catch (error) {
    console.error('Error fetching schools:', error)
    return {
      status: 'error',
      data: [],
      message: error.message || 'Failed to fetch schools'
    }
  }
}

export const createSchool = async (schoolData) => {
  try {
    // Transform the data to match API requirements exactly
    const requestBody = {
      name: schoolData.name,
      logo: schoolData.logo || null,
      description: schoolData.description,
      address: {
        description: schoolData.address.description,
        landmark: schoolData.address.landmark,
        pinCode: schoolData.address.pinCode,
        region: schoolData.address.region,
        city: schoolData.address.city,
        state: schoolData.address.state,
        country: schoolData.address.country,
        location: schoolData.address.location
      },
      contactNumber: schoolData.contactNumber,
      email: schoolData.email,
      website: schoolData.website,
      grades: schoolData.grades,
      principal: schoolData.principal,
      isActive: schoolData.isActive
    }

    console.log('Creating school with data:', requestBody)
    const response = await api.post(BASE_URL, requestBody)
    
    console.log('Create school response:', response.data)
    
    // If the response indicates an error, throw it
    if (response.data.status === 'error') {
      throw {
        message: response.data.message,
        response: response.data
      }
    }
    
    // Return the standardized response structure
    return {
      status: response.data.status || 'success',
      data: response.data.data || response.data
    }
  } catch (error) {
    console.error('Error creating school:', {
      message: error.message,
      response: error.response?.data
    })
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      // Handle validation errors or duplicate entries
      throw {
        message: error.response.data.message || 'Invalid school data',
        response: error.response.data,
        type: 'validation'
      }
    } else if (error.response?.status === 401) {
      throw {
        message: 'Unauthorized. Please log in again.',
        type: 'auth'
      }
    } else if (error.response?.status === 403) {
      throw {
        message: 'You do not have permission to create schools.',
        type: 'permission'
      }
    }
    
    // For other errors, throw a standardized error structure
    throw {
      message: error.message || 'Failed to create school',
      response: error.response?.data,
      type: 'unknown'
    }
  }
}

export const deleteSchool = async (id) => {
  try {
    console.log('Deleting school with ID:', id)
    const response = await api.delete(`${BASE_URL}/${id}`)
    console.log('Delete school response:', response)

    // Ensure we return a consistent response structure
    return {
      status: response.data?.status || 'success',
      message: response.data?.message || 'School deleted successfully'
    }
  } catch (error) {
    console.error('Error in deleteSchool:', {
      message: error.message,
      response: error.response?.data
    })
    
    // Throw a standardized error structure
    throw {
      message: error.response?.data?.message || 'Failed to delete school',
      response: error.response?.data
    }
  }
}

export const getSchoolById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`)
    console.log('Get School By ID Response:', response)

    // Check if response has the expected structure
    if (!response.data) {
      throw new Error('Invalid response structure')
    }

    // If the data is directly in response.data
    if (!response.data.data && !response.data.status) {
      return {
        status: 'success',
        data: response.data
      }
    }

    // If the data is nested in response.data.data
    return {
      status: response.data.status || 'success',
      data: response.data.data || response.data
    }
  } catch (error) {
    console.error('Error fetching school details:', {
      name: error.name,
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    })
    throw error
  }
}

export const updateSchool = async (id, schoolData) => {
  try {
    console.log('Updating school with ID:', id)
    console.log('Update data:', schoolData)

    const response = await api.put(`${BASE_URL}/${id}`, schoolData)
    console.log('Update school response:', response)

    // Check if we have a valid response
    if (response && response.data) {
      return {
        status: 'success',
        data: response.data.data,
        message: 'School updated successfully'
      }
    }

    // If no valid response, throw an error
    throw new Error('Invalid response from server')
  } catch (error) {
    console.error('Error in updateSchool:', {
      message: error.message,
      response: error.response?.data
    })
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      throw {
        message: error.response.data.message || 'Invalid school data',
        type: 'validation'
      }
    } else if (error.response?.status === 401) {
      throw {
        message: 'Unauthorized. Please log in again.',
        type: 'auth'
      }
    } else if (error.response?.status === 403) {
      throw {
        message: 'You do not have permission to update schools.',
        type: 'permission'
      }
    }
    
    // For other errors, throw a standardized error structure
    throw {
      message: error.message || 'Failed to update school',
      type: 'unknown'
    }
  }
}

export const schoolsService = {
  getAllSchools,
  createSchool,
  deleteSchool,
  getSchoolById,
  updateSchool,
  getSchoolGrades: async (schoolId) => {
    try {
      const response = await api.get(`${BASE_URL}/${schoolId}/grades`);
      console.log('Raw grades response:', response);

      if (response?.data?.status === 'success' && response?.data?.data) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (Array.isArray(response?.data?.data)) {
        return response.data.data;
      }

      console.error('Unexpected grades response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  },

  getGradeSections: async (schoolId, gradeId) => {
    try {
      const response = await api.get(`${BASE_URL}/${schoolId}/grades/${gradeId}/sections`);
      console.log('Raw sections response:', response);

      if (response?.data?.status === 'success' && response?.data?.data) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (Array.isArray(response?.data?.data)) {
        return response.data.data;
      }

      console.error('Unexpected sections response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching sections:', error);
      return [];
    }
  },

  updateSchool: async (id, schoolData) => {
    try {
      console.log('Updating school with ID:', id)
      console.log('Update data:', schoolData)

      const response = await api.put(`${BASE_URL}/${id}`, schoolData)
      console.log('Update school response:', response)

      // Check if we have a valid response
      if (response && response.data) {
        return {
          status: 'success',
          data: response.data.data,
          message: 'School updated successfully'
        }
      }

      // If no valid response, throw an error
      throw new Error('Invalid response from server')
    } catch (error) {
      console.error('Error in updateSchool:', {
        message: error.message,
        response: error.response?.data
      })
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw {
          message: error.response.data.message || 'Invalid school data',
          type: 'validation'
        }
      } else if (error.response?.status === 401) {
        throw {
          message: 'Unauthorized. Please log in again.',
          type: 'auth'
        }
      } else if (error.response?.status === 403) {
        throw {
          message: 'You do not have permission to update schools.',
          type: 'permission'
        }
      }
      
      // For other errors, throw a standardized error structure
      throw {
        message: error.message || 'Failed to update school',
        type: 'unknown'
      }
    }
  }
} 