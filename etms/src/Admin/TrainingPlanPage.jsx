import React, { useState, useEffect } from 'react';
import './TrainingPlanPage.css'; // Import CSS file for styling
import { RiCheckLine } from 'react-icons/ri'; // Import icon for success message
import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai'; // Import icons for error message and delete button
import { createPlan, deletePlan, getPlans, updatePlan } from './services/PlanAPI'; // Import API functions
import { getModules } from './services/ModuleAPI'; // Import API function to get modules
const TrainingPlanPage = () => {
    const [formData, setFormData] = useState({
        planName: '',
        department: '',
        description: '',
        moduleID: '',
        startDate: '',
        endDate: ''
    });

    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [isSuccess, setIsSuccess] = useState(false); // Success state
    const [error, setError] = useState(null); // Error state
    const [plans, setPlans] = useState([]); // Plan state
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [updateFormData, setUpdateFormData] = useState(null); // State for update form data
    const [isUpdateMode, setIsUpdateMode] = useState(false); // State to toggle update mode
    const [modules, setModules] = useState([]); // Module state

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
    }, []); // Fetch modules only once on component mount


    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getPlans();

                setPlans(response);

            } catch (error) {
                console.error('Error fetching plans:', error.message);
            }
        };

        fetchPlans();
    }, [plans]); // Include plans in the dependency array

    const handleUpdateFormOpen = (plan) => {
        setUpdateFormData(plan); // Set the data for the update form
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
            const planId = updateFormData._id;
            const response = await updatePlan(planId, updateFormData);
            // Find the index of the plan being updated
            const index = plans.findIndex(plan => plan._id === planId);
            // Replace the plan with updated data in the plans array
            const updatedPlans = [...plans];
            updatedPlans[index] = response;
            setPlans(updatedPlans);
            setIsSuccess(true); // Set success state to true
        } catch (error) {
            console.error('Error updating plan:', error.message);
            setError(error.message);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setIsSuccess(false);
                setError(null);
                handleUpdateFormClose(); // Close the update form after submitting
            }, [plans]);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true
        try {
            const response = await createPlan(formData);
            // Log the response from the backend
            console.log(formData)
            setIsSuccess(true); // Set success state to true
            setFormData({
                planName: '',
                department: '',
                description: '',
                moduleID: '',
                startDate: '',
                endDate: ''
            });
            setShowForm(false);

            // Update plans state to include the newly created plan
            setPlans(prevPlans => [...prevPlans, response]);
        } catch (error) {
            console.error('Error creating plan:', error.message);
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

        // Convert startDate and endDate to string type
        const updatedValue = name === 'startDate' || name === 'endDate' ? value.toString() : value;
        // For other fields, update the formData state directly
        setFormData((updatedValue) => ({
            ...updatedValue,
            [name]: value,
        }));

    };
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
         // Convert startDate and endDate to string type
         const updatedValue = name === 'startDate' || name === 'endDate' ? value.toString() : value;

        setUpdateFormData((updatedValue) => ({
            ...updatedValue,
            [name]: value,
        }));
    };

    const handleDelete = async (planId) => {
        try {
            await deletePlan(planId);
            console.log(!!plans)
            const updatedPlans = plans.filter((plan) => plan._id !== planId);
            setPlans(updatedPlans);
        } catch (error) {
            console.error('Error deleting plan:', error.message);
            setError(error.message);
        }
    };

    // Filter plans based on search term
    const filteredPlans = plans.filter(plan => {
        return (
            plan && // Check if plan is defined
            plan.planName && // Check if planName is defined
            plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


    
    const isDateConflict = (startDate, endDate) => {
      const newStartDate = new Date(startDate+':30');
      const newEndDate = new Date(endDate+':30');

      const ValidSchedule = newStartDate < newEndDate 
  
      // Check for conflicts with existing plans
      const conflictDetected = plans.some(plan => {
          const existingStartDate = new Date(plan.schedule.startDate);
          const existingEndDate = new Date(plan.schedule.endDate);
      
      // Check if new dates overlap with existing plan's dates (including time)
      const isNewStartBeforeExistingEnd = newStartDate < existingEndDate;
      const isNewEndAfterExistingStart = newEndDate > existingStartDate;
      
      // Check if there's a valid overlap in both date and time
      const isOverlap =
          isNewStartBeforeExistingEnd &&
          isNewEndAfterExistingStart;

      // Also check if new dates exactly match existing plan's dates (including time)
      const isExactMatch =
          newStartDate.getTime() === existingStartDate.getTime() &&
          newEndDate.getTime() === existingEndDate.getTime();

      // Return true if there's any type of conflict detected
      return ValidSchedule||isOverlap || isExactMatch;
      });
      console.log(conflictDetected)
      // Show alert if conflict is detected
      if (conflictDetected) {
          alert("Enter the Valid Date / There might be time conflict with other plans");
      } else {
          return
      }
  };

    const handleStartDateChange = (e) => {
        const { value } = e.target;
        const isConflict = isDateConflict(value, formData.endDate);
        setFormData(prevData => ({
            ...prevData,
            startDate: value,
            endDate: isConflict ? '' : prevData.endDate
        }));
    };

    const handleEndDateChange = (e) => {
        const { value } = e.target;
        const isConflict = isDateConflict(formData.startDate, value);
        setFormData(prevData => ({
            ...prevData,
            endDate: value,
            startDate: isConflict ? '' : prevData.startDate
        }));
    };


    return (
        <div className="container">
            <h1 className="title">Manage Training Plans</h1>

            {/* Search section */}
            <div className="search">
                <input
                    type="text"
                    placeholder="Search by plan name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Circular create plan button */}
            <button className="create-plan-btn" onClick={() => setShowForm(true)}>Create Plan</button>

            {/* Form for creating plan */}
            {showForm && (
                <div className="overlay">
<form className="plan-form" onSubmit={handleSubmit}>
  <h2>Create Plan</h2>
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="planName">Plan Name:</label>
      <input
        type="text"
        id="planName"
        name="planName"
        value={formData.planName}
        onChange={handleChange}
        required
      />
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
        <option value="HR">HR</option>
        <option value="IT">IT</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
      </select>
    </div>
  </div>
  <div className="form-row">
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
      <label htmlFor="moduleID">Module:</label>
      <select
        id="moduleID"
        name="moduleID"
        value={formData.moduleID}
        onChange={handleChange}
        required
      >
        <option value="">Select Module</option>
        {modules.map(module => (
          <option key={module._id} value={module._id}>{module.moduleName}</option>
        ))}
      </select>
    </div>
  </div>
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="startDate">Start Date:</label>
      <input
        type="datetime-local"
        id="startDate"
        name="startDate"
        value={formData.startDate}
        onChange={handleStartDateChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="endDate">End Date:</label>
      <input
        type="datetime-local"
        id="endDate"
        name="endDate"
        value={formData.endDate}
        onChange={handleEndDateChange}
        required
      />
    </div>
  </div>
  <div className="button-row">
    <button type="submit" className="submit-btn">Create Plan</button>
    <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
  </div>
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
                    Plan created successfully
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

            <div className="plan-table">
                <h2>Created Plans</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Department</th>
                            <th>Description</th>
                            <th>Module Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlans.map((plan) => (
                            plan && plan._id && (
                                <tr key={plan._id}>
                                    <td>{plan.planName}</td>
                                    <td>{plan.department}</td>
                                    <td>{plan.description}</td>
                                    {modules.map(module => {
                                        if (module._id === plan.moduleID) {
                                            return (
                                                <td key={module._id}>{module.moduleName}</td>
                                            );
                                        }
                                        return null;
                                    })}

<td>{plan.schedule && plan.schedule.startDate ? new Date(plan.schedule.startDate).toLocaleString() : '-'}</td>
<td>{plan.schedule && plan.schedule.endDate ? new Date(plan.schedule.endDate).toLocaleString() : '-'}</td>


                                    <td>
                                        <button className="edit-btn" onClick={() => handleUpdateFormOpen(plan)}> {/* Handle edit */}
                                            <AiOutlineEdit />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(plan._id)}>
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
                    <form className="plan-form" onSubmit={handleUpdateSubmit}>
  <h2>Create Plan</h2>
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="planName">Plan Name:</label>
      <input
        type="text"
        id="planName"
        name="planName"
        value={updateFormData.planName}
        onChange={handleUpdateChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="department">Department:</label>
      <select
        id="department"
        name="department"
        value={updateFormData.department}
        onChange={handleUpdateChange}
        required
      >
        <option value="">Select Department</option>
        <option value="HR">HR</option>
        <option value="IT">IT</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
      </select>
    </div>
  </div>
  <div className="form-row">
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
      <label htmlFor="moduleID">Module:</label>
      <select
        id="moduleID"
        name="moduleID"
        value={updateFormData.moduleID}
        onChange={handleUpdateChange}
        required
      >
        <option value="">Select Module</option>
        {modules.map(module => (
          <option key={module._id} value={module._id}>{module.moduleName}</option>
        ))}
      </select>
    </div>
  </div>
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="startDate">Start Date:</label>
      <input
        type="datetime-local"
        id="startDate"
        name="startDate"
        value={updateFormData.startDate}
        onChange={handleUpdateChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="endDate">End Date:</label>
      <input
        type="datetime-local"
        id="endDate"
        name="endDate"
        value={updateFormData.endDate}
        onChange={handleUpdateChange}
        required
      />
    </div>
  </div>
  <div className="button-row">
    <button type="submit" className="submit-btn">Create Plan</button>
    <button type="button" onClick={handleUpdateFormClose} className="cancel-btn">Cancel</button>
  </div>
</form>
                </div>
            )}
        </div>
    );
};

export default TrainingPlanPage;
