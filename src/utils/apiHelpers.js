/**
 * Normalizes an API response to ensure it always contains an array in the data property
 * @param {Object} response - The API response object
 * @returns {Object} - The normalized response with guaranteed array in data property
 */
export const normalizeArrayResponse = (response) => {
  return {
    ...response,
    data: Array.isArray(response?.data?.data) ? response.data.data : 
          Array.isArray(response?.data) ? response.data : []
  };
};

/**
 * Sets state with a guaranteed array, useful for components that map over data
 * @param {Function} setState - The state setter function
 * @param {Object} response - The API response object
 */
export const setStateWithArray = (setState, response) => {
  setState(Array.isArray(response?.data) ? response.data : []);
}; 