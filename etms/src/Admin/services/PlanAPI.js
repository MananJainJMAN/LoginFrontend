import axios from 'axios';

const baseURL = 'http://localhost:5000'; // Replace with your backend URL

const axiosInstance = axios.create({
  baseURL,
});

// Create a new training plan
export const createPlan = async (planData) => {
  try {
    
     const newPlanData = {
        "planName": planData.planName,
        "department": planData.department,
        "description": planData.description,
        "moduleID": planData.moduleID,
        "schedule": {
          "startDate": planData.startDate,
          "endDate": planData.endDate
        }
      }
      
          
    const response = await axiosInstance.post('/admin/training-plans', newPlanData);
  
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Get all training plans
export const getPlans = async () => {
  try {
    const response = await axiosInstance.get('/admin/training-plans');
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Update a training plan
export const updatePlan = async (planID, planData) => {
  try {
    const newPlanData = {
        "planName": planData.planName,
        "department": planData.department,
        "description": planData.description,
        "moduleID": planData.moduleID,
        "schedule": {
          "startDate": planData.startDate,
          "endDate": planData.endDate
        }
      }
      
    const response = await axiosInstance.put(`/admin/training-plans/${planID}`, newPlanData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Delete a training plan
export const deletePlan = async (planID) => {
  try {
    const response = await axiosInstance.delete(`/admin/training-plans/${planID}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export default {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
};
