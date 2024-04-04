import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './Assessment.css';
import Cookies from 'js-cookie';

const UserDashboard = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [moduleNames, setModuleNames] = useState({});

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
      const decodedToken =jwtDecode(token);

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

  return (
    <div>
      <h1>Your Scores</h1>
      {assessmentData.map((assessment, index) => (
        <div key={index} className={`card-assessment ${assessment.score >= 75 ? 'good-score-assessment' : 'bad-score-assessment'}`}>
          <div className="progress-assessment" style={{ width: `${assessment.score}%`, height: "100%" }}></div>
          <div className="content-assessment">
            <h3>{moduleNames[assessment.moduleId]}</h3>
            <p className="message-assessment">{assessment.score >= 75 ? 'You are doing well in this module' : 'Focus more on this module'}</p>
            <h4 className="percentage-assessment">{assessment.score}/{assessment.totalScore}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
