// AssessmentCard.js
import React from 'react';
import './Assessment.css';

const AssessmentCard = ({ assessment, moduleName }) => {
  return (
    <div className={`card-assessment ${assessment.score >= 75 ? 'good-score-assessment' : 'bad-score-assessment'}`}>
      <div className="progress-assessment" style={{ width: `${assessment.score}%`, height: "100%" }}></div>
      <div className="content-assessment">
        <h3>{moduleName}</h3>
        <p className="message-assessment">{assessment.score >= 75 ? 'You are doing well in this module' : 'Focus more on this module'}</p>
        <h4 className="percentage-assessment">{assessment.score}/{assessment.totalScore}</h4>
      </div>
    </div>
  );
};

export default AssessmentCard;
