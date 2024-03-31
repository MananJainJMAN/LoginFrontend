import axios from 'axios';

const BASE_URL = '/api'; // Assuming your API is served from /api endpoint

// Create a new training module
export const createModule = async (moduleData) => {
  try {
    const response = await axios.post(`${BASE_URL}/modules`, moduleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Get all training modules
export const getModules = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/modules`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Get a single training module by ID
export const getModuleById = async (moduleID) => {
  try {
    const response = await axios.get(`${BASE_URL}/modules/${moduleID}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Update a training module
export const updateModule = async (moduleID, moduleData) => {
  try {
    const response = await axios.put(`${BASE_URL}/modules/${moduleID}`, moduleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Delete a training module
export const deleteModule = async (moduleID) => {
  try {
    const response = await axios.delete(`${BASE_URL}/modules/${moduleID}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export default {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule,
};
