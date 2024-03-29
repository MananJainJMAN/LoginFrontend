import axios from 'axios';

const baseURL = 'http://localhost:5000'; // Replace with your backend URL

const axiosInstance = axios.create({
  baseURL,
});

const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/createUser', userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create user. Please try again later.');
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/user/deleteUser/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete user. Please try again later.');
  }
};

const getUser = async () => {
  try {
    const response = await axiosInstance.get('/user/getUser');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users. Please try again later.');
  }
};

export { createUser, deleteUser, getUser };
