import React, { useState, useEffect } from 'react';
import './TrainingModulePage.css'; // Import CSS file for styling
import { RiCheckLine } from 'react-icons/ri'; // Import icon for success message
import { AiOutlineCloseCircle, AiFillDelete } from 'react-icons/ai'; // Import icons for error message and delete button
import { createModule, deleteModule, getModules } from './services/ModuleAPI'; // Import API functions

const TrainingModulePage = () => {
  const [formData, setFormData] = useState({
    moduleID: '',
    moduleName: '',
    description: '',
    content: '',
    duration: 0,
    difficultyLevel: '',
    prerequisites: [],
    resourceLinks: [{ title: '', url: '' }]
  });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSuccess, setIsSuccess] = useState(false); // Success state
  const [error, setError] = useState(null); // Error state
  const [modules, setModules] = useState([]); // Module state
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filterDifficulty, setFilterDifficulty] = useState(''); // State for filtering by difficulty

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
        setModules(response.data);
      } catch (error) {
        console.error('Error fetching modules:', error.message);
      }
    };
  
    fetchModules();
  }, [modules]); // Include modules in the dependency array
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const response = await createModule(formData);
      console.log(response); // Log the response from the backend
      setIsSuccess(true); // Set success state to true
      setFormData({
        moduleID: '',
        moduleName: '',
        description: '',
        content: '',
        duration: 0,
        difficultyLevel: '',
        prerequisites: [],
        resourceLinks: [{ title: '', url: '' }]
      });
      setShowForm(false);
  
      // Update modules state to include the newly created module
      setModules(prevModules => [...prevModules, response.data]);
    } catch (error) {
      console.error('Error creating module:', error.message);
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

  const handleDelete = async (moduleId) => {
    try {
      await deleteModule(moduleId);
      const updatedModules = modules.filter((module) => module._id !== moduleId);
      setModules(updatedModules);
    } catch (error) {
      console.error('Error deleting module:', error.message);
      setError(error.message);
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...formData.resourceLinks];
    list[index][name] = value;
    setFormData({ ...formData, resourceLinks: list });
  };

  const handleAddLink = () => {
    setFormData({ ...formData, resourceLinks: [...formData.resourceLinks, { title: '', url: '' }] });
  };

  const handleRemoveLink = (index) => {
    const list = [...formData.resourceLinks];
    list.splice(index, 1);
    setFormData({ ...formData, resourceLinks: list });
  };

  // Filter modules based on search term and difficulty
  const filteredModules = modules.filter(module => {
    return (
      module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterDifficulty === '' || module.difficultyLevel === filterDifficulty)
    );
  });

  return (
    <div className="container">
      <h1 className="title">Manage Training Modules</h1>

      {/* Search and filter section */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by module name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
        >
          <option value="">Filter by Difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Circular create module button */}
      <button className="create-module-btn" onClick={() => setShowForm(true)}>Create Module</button>

      {/* Form for creating module */}
      {showForm && (
        <div className="overlay">
          <form className="module-form" onSubmit={handleSubmit}>
            <h2>Create Module</h2>
            <div className="form-group">
              <label htmlFor="moduleName">Module Name:</label>
              <input 
                type="text" 
                id="moduleName" 
                name="moduleName" 
                value={formData.moduleName} 
                onChange={handleChange} 
                required 
              />
            </div>
            {/* Add inputs for other fields */}
            {formData.resourceLinks.map((link, index) => (
              <div key={index}>
                <input type="text" name="title" placeholder="Title" value={link.title} onChange={(e) => handleInputChange(index, e)} required />
                <input type="text" name="url" placeholder="URL" value={link.url} onChange={(e) => handleInputChange(index, e)} required />
                {formData.resourceLinks.length !== 1 && <button type="button" onClick={() => handleRemoveLink(index)}>Remove</button>}
              </div>
            ))}
            <button type="button" onClick={handleAddLink}>Add Resource Link</button>
            <button type="submit">Create Module</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
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
          Module created successfully
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

      {/* Table-like structure for displaying created modules */}
      <div className="module-table">
        <h2>Created Modules</h2>
        <table>
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Description</th>
              <th>Difficulty Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((module) => (
              <tr key={module._id}>
                <td>{module.moduleName}</td>
                <td>{module.description}</td>
                <td>{module.difficultyLevel}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(module._id)}>
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

export default TrainingModulePage;
