import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './Assessment.css';
import Cookies from 'js-cookie';
import AssessmentCard from './AsessmentCard';

const UserDashboard = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [moduleNames, setModuleNames] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('all'); // Add state for selected color
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const userId = getUserId(); // Get user ID
        const response = await axios.get(`http://localhost:5000/admin/training-assessment/${userId}`);
        setAssessmentData(response.data);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }
    };

    fetchAssessmentData();
  }, []);

  useEffect(() => {
    const fetchModuleNames = async () => {
      const names = {};
      await Promise.all(assessmentData.map(async (assessment) => {
        try {
          const response = await axios.get(`http://localhost:5000/admin/training-modules/${assessment.moduleId}`);
          names[assessment.moduleId] = response.data.moduleName;
        } catch (error) {
          console.error(`Error fetching module name for module ID ${assessment.moduleId}:`, error);
        }
      }));
      setModuleNames(names);
      setIsLoading(false); // Set loading state to false after fetching module names
    };

    if (assessmentData.length > 0) {
      fetchModuleNames();
    }
  }, [assessmentData]);

  // Function to retrieve user ID from JWT token
  const getUserId = () => {
    const token = getJwtToken(); // Get JWT token

    // Check if token exists
    if (token) {
      // Decode the JWT token to get the payload
      const decodedToken = jwtDecode(token);

      // Extract user ID from the decoded token
      const userId = decodedToken.id; // Assuming the user ID is stored as 'id' in the token payload

      // Return the user ID
      return userId;
    } else {
      // If token doesn't exist, return null or handle accordingly
      return null;
    }
  };

  // Example function to retrieve JWT token from cookies or local storage
  const getJwtToken = () => {
    const storedToken = Cookies.get('token');
    return storedToken;
  };

  // Filter assessment data based on module name and selected color
  const filteredAssessments = assessmentData.filter(assessment =>
    (moduleNames[assessment.moduleId]?.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === '') &&
    (selectedColor === 'all' || (assessment.score >= 75 && selectedColor === 'green') || (assessment.score < 75 && selectedColor === 'red'))
  );

  if (isLoading) {
    return <div>Loading...</div>; // Render loading indicator while fetching data
  }

  return (
    <div>
      <h1>Your Scores</h1>
      <div className="asess-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Search by module name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select-field"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          <option value="all">All</option>
          <option value="green">Pass</option>
          <option value="red">Fail</option>
        </select>
      </div>
      {filteredAssessments.map((assessment, index) => (
        <AssessmentCard
          key={index}
          assessment={assessment}
          moduleName={moduleNames[assessment.moduleId]}
        />
      ))}
    </div>
  );
  
};

export default UserDashboard;
