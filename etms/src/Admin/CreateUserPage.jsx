import React, { useState, useEffect } from 'react';
import './CreateUserPage.css'; // Import CSS file for styling
import { RiCheckLine } from 'react-icons/ri'; // Import icon for success message
import { AiOutlineCloseCircle, AiFillDelete } from 'react-icons/ai'; // Import icons for error message and delete button
import { createUser, deleteUser, getUser } from './services/UserAPI'; // Import API functions

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    department: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSuccess, setIsSuccess] = useState(false); // Success state
  const [error, setError] = useState(null); // Error state
  const [users, setUsers] = useState([]); // User state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUser();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };
  
    fetchUsers();
  }, [users]); // Include users in the dependency array
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const response = await createUser(formData);
      console.log(response); // Log the response from the backend
      setIsSuccess(true); // Set success state to true
      setFormData({
        email: '',
        role: '',
        department: '',
      });
      setShowForm(false);
  
      // Update users state to include the newly created user
      setUsers(prevUsers => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Error creating user:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsSuccess(false);
        setError(null);
      }, 3000);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Manage Users</h1>

 {/* Circular create user button */}
 <button className="create-user-btn" onClick={() => setShowForm(true)}>Create User</button>

{/* Form for creating user */}
{showForm && (
  <div className="overlay">
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role:</label>
        <select 
          id="role" 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          required 
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Employee">Employee</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="department">Department:</label>
        <select 
          id="department" 
          name="department" 
          value={formData.department} 
          onChange={handleChange} 
          required 
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="HR">HR</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">Create User</button>
      <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
    </form>
  </div>
)}

{/* Loading animation */}
{isLoading && (
  <div className="loading-container">
    <div className="loading"></div>
  </div>
)}

{/* Success message */}
{isSuccess && (
  <div className="success-message">
    <RiCheckLine className="tick-icon" />
    User created successfully
  </div>
)}

{/* Error message */}
{error && (
  <div className="overlay">
    <div className="error-message">
      {error}
    </div>
  </div>
)}

      {/* Table-like structure for displaying created users */}
      <div className="user-table">
        <h2>Created Users</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Action</th> {/* New column for delete button */}
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
    user ? (
      <tr key={user._id}>
        <td>{user.email || 'N/A'}</td>
        <td>{user.role || 'N/A'}</td>
        <td>{user.department || 'N/A'}</td>
        <td>
          <button className="delete-btn" onClick={() => handleDelete(user._id)}>
            <AiFillDelete />
          </button>
        </td>
      </tr>
    ) : null
  ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateUserPage;
