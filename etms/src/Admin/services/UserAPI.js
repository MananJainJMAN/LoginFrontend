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
const resetPassword = async (token, newPassword) => {
  try {
    console.log(newPassword)
    const response = await axiosInstance.patch(`/user/resetPassword/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    throw new Error('Failed to reset password. Please try again later.');
  }
};


const login  = async(loginData)=>
{
  try
  {
    const response = await axiosInstance.post('/user/login',loginData)
    console.log(response)
    return response.data;

  }
  catch(error)
  {
    throw new Error('Failed to login')
  }
}

const forgotPassword = async(email)=>
{
  try
  {
    console.log(email)
    const response = await axiosInstance.post('user/forgotPassword',email)
    console.log(response)
    return response.data

  }
  catch(error)
  {

    throw new Error('Something went wrong')
  }
}
export { createUser, deleteUser, getUser , resetPassword , login , forgotPassword};
