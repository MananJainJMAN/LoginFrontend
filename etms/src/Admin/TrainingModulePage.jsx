import React, { useState, useEffect } from 'react';
import './TrainingModulePage.css'; // Import CSS file for styling
import { RiCheckLine } from 'react-icons/ri'; // Import icon for success message
import { AiFillDelete , AiOutlineEdit } from 'react-icons/ai'; // Import icons for error message and delete button
import { createModule, deleteModule, getModules, updateModule } from './services/ModuleAPI'; // Import API functions

const TrainingModulePage = () => {
  const [formData, setFormData] = useState({
    moduleName: '',
    description: '',
    duration: 0,
    difficultyLevel: '',
    prerequisites: '',
    resourceLinks: [{ title: '', url: '' }]
  });

  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSuccess, setIsSuccess] = useState(false); // Success state
  const [error, setError] = useState(null); // Error state
  const [modules, setModules] = useState([]); // Module state
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filterDifficulty, setFilterDifficulty] = useState(''); // State for filtering by difficulty
  const [updateFormData, setUpdateFormData] = useState(null); // State for update form data
  const [isUpdateMode, setIsUpdateMode] = useState(false); // State to toggle update mode

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();

        setModules(response);

      } catch (error) {
        console.error('Error fetching modules:', error.message);
      }
    };

    fetchModules();
  }, [modules]); // Include modules in the dependency array

  const handleUpdateFormOpen = (module) => {
    setUpdateFormData(module); // Set the data for the update form
    setIsUpdateMode(true); // Set update mode to true
  };
  
  const handleUpdateFormClose = () => {
    setUpdateFormData(null); // Clear the update form data
    setIsUpdateMode(false); // Set update mode to false
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const moduleId = updateFormData._id;
      const response = await updateModule(moduleId, updateFormData);
      // Find the index of the module being updated
      const index = modules.findIndex(module => module._id === moduleId);
      // Replace the module with updated data in the modules array
      const updatedModules = [...modules];
      updatedModules[index] = response;
      setModules(updatedModules);
      setIsSuccess(true); // Set success state to true
    } catch (error) {
      console.error('Error updating module:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsSuccess(false);
        setError(null);
        handleUpdateFormClose(); // Close the update form after submitting
      }, [modules]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const response = await createModule(formData);
      // Log the response from the backend
      setIsSuccess(true); // Set success state to true
      setFormData({
        moduleName: '',
        description: '',
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


    // Ensure duration is not negative
    if (name === 'duration' && parseInt(value) < 0) {
      return; // Do nothing if duration is negative
    }
    

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));


  };
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
  
    // Ensure duration is not negative
    if (name === 'duration' && parseInt(value) < 0) {
      return; // Do nothing if duration is negative
    }
  
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDelete = async (moduleId) => {
    try {
      await deleteModule(moduleId);
      console.log(!!modules)
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
      module && // Check if module is defined
      module.moduleName && // Check if moduleName is defined
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
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration:</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 1 hour"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficultyLevel">Difficulty Level:</label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select Difficulty Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="prerequisites">Prerequisites (separated by comma or newline):</label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                required
              />
            </div>


            <label htmlFor="resourceLinks">Resources (Enter the Title and URL):</label>
            {/* Add inputs for other fields */}
            {formData.resourceLinks.map((link, index) => (
              <div key={index}>
                <div className="form-group">
                  <input type="text" name="title" placeholder="Title" value={link.title} onChange={(e) => handleInputChange(index, e)} required />
                  <input type="text" name="url" placeholder="URL" value={link.url} onChange={(e) => handleInputChange(index, e)} required />
                </div>
                {formData.resourceLinks.length !== 1 && <button type="button" onClick={() => handleRemoveLink(index)} className='remove-btn'>Remove</button>}
              </div>
            ))}
            <button type="button" onClick={handleAddLink} className="add-btn">Add Resource Link</button>
            <button type="submit" className="submit-btn" >Create Module</button>
            <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
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

<div className="module-table">
        <h2>Created Modules</h2>
        <table>
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Difficulty Level</th>
              <th>Prerequisites</th>
              <th>Resource Links</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((module) => (
              module && module._id && (
                <tr key={module._id}>
                  <td>{module.moduleName}</td>
                  <td>{module.description}</td>
                  <td>{module.duration}</td>
                  <td>{module.difficultyLevel}</td>
                  <td>{module.prerequisites.join(', ')}</td>
                  <td>
                    <ul>
                      {module.resourceLinks.map((link, index) => (
                        <li key={index}>
                          <a href={link.url}>{link.title}</a>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() =>  handleUpdateFormOpen(module)}> {/* Handle edit */}
                      <AiOutlineEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(module._id)}>
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      {isUpdateMode && updateFormData && (
  <div className="overlay">
    <form className="module-form" onSubmit={handleUpdateSubmit}>
      <h2>Update Module</h2>
      {/* Implement fields with pre-filled data */}
      <div className="form-group">
              <label htmlFor="moduleName">Module Name:</label>
              <input
                type="text"
                id="moduleName"
                name="moduleName"
                value={updateFormData.moduleName}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={updateFormData.description}
                onChange={handleUpdateChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration:</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={updateFormData.duration}
                onChange={handleUpdateChange}
                placeholder="e.g., 1 hour"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficultyLevel">Difficulty Level:</label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={updateFormData.difficultyLevel}
                onChange={handleUpdateChange}
                required
              >
                <option value="">Select Difficulty Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="prerequisites">Prerequisites (separated by comma or newline):</label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={updateFormData.prerequisites}
                onChange={handleUpdateChange}
                required
              />
            </div>


            <label htmlFor="resourceLinks">Resources (Enter the Title and URL):</label>
            {/* Add inputs for other fields */}
            {updateFormData.resourceLinks.map((link, index) => (
              <div key={index}>
                <div className="form-group">
                  <input type="text" name="title" placeholder="Title" value={link.title} onChange={(e) => handleInputChange(index, e)} required />
                  <input type="text" name="url" placeholder="URL" value={link.url} onChange={(e) => handleInputChange(index, e)} required />
                </div>
                {updateFormData.resourceLinks.length !== 1 && <button type="button" onClick={() => handleRemoveLink(index)} className='remove-btn'>Remove</button>}
              </div>
            ))}
      <button type="submit" className="submit-btn">Update Module</button>
      <button type="button" onClick={handleUpdateFormClose} className="cancel-btn">Cancel</button>
    </form>
  </div>
  
)}
    </div>
  );
};

export default TrainingModulePage;
