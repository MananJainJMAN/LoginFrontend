import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Assessment.css'

const UserDashboard = () => {
  const [assessmentData, setAssessmentData] = useState([]);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/training-assessment');
        setAssessmentData(response.data);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }
    };

    fetchAssessmentData();
  }, []);

  return (
    <div>
      {assessmentData.map((assessment, index) => (
        <div key={index} className={`card-assessment ${assessment.score >= 75 ? 'good-score-assessment' : 'bad-score-assessment'}`}>
          <div className="progress-assessment" style={{ width: `${assessment.score}%`, height: "100%" }}></div>
          <div className="content-assessment">
            <h3>{assessment.moduleId}</h3>
            <p className="message-assessment">{assessment.score >= 75 ? 'You are doing well in this module' : 'Focus more on this module'}</p>
            <h4 className="percentage-assessment">{assessment.score}/{assessment.totalScore}</h4>
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
