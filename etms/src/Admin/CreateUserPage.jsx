import React, { useState, useEffect } from 'react';
import './CreateUserPage.css';
import { RiCheckLine } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { createUser, deleteUser, getUser } from './services/UserAPI';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    department: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

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
  }, []); // Fetch users only on component mount (empty dependency array)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await createUser(formData);
      setIsSuccess(true);
      setFormData({ email: '', role: '', department: '' });
      setShowForm(false);
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
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error.message);
      setError(error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    return (
      user &&
      user.email &&
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment === '' || user.department === filterDepartment)
    );
  });

  return (
    <div className="container">
      <h1 className="title">Manage Users</h1>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="">Filter by Department</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <button className="create-user-btn" onClick={() => setShowForm(true)}>
        Create User
      </button>

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
            <button type="submit" className="submit-btn">
              Create User
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      )}

      {isSuccess && (
        <div className="success-message">
          User created successfully
        </div>
      )}

      {error && (
        <div className="overlay">
          <div className="error-message">{error}</div>
        </div>
      )}

      <div className="user-table">
        <h2>Created Users</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.department}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateUserPage;
