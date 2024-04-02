import axios from 'axios';

const baseURL = 'http://localhost:5000'; // Replace with your backend URL

const axiosInstance = axios.create({
  baseURL,
});

// Create a new training module
export const createModule = async (moduleData) => {
  try {
    const response = await axiosInstance.post('/admin/training-modules', moduleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Get all training modules
export const getModules = async () => {
  try {
    const response = await axiosInstance.get('/admin/training-modules');

    return response.data;
    
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Get a single training module by ID
export const getModuleById = async (moduleID) => {
  try {
    const response = await axiosInstance.get('/admin/training-modules');
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Update a training module
export const updateModule = async (moduleID, moduleData) => {
  try {
    const response = await axiosInstance.put(`/admin/training-modules/${moduleID}`, moduleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Delete a training module
export const deleteModule = async (moduleID) => {
  try {
    const response = await axiosInstance.delete(`/admin/training-modules/${moduleID}`);
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
