import React, { useState } from 'react';
import axios from 'axios';

function Prediction() {
  const [inputData, setInputData] = useState({
    'Number of Topics': '',
    'Number of Examples': '',
    'Average Score (%)': '',
    'Category': '', // Single 'Category' field
    'Interactive Exercises_True': false,
    'Category_FrontendDevelopment': false,
    'Category_MobileAppDevelopment': false
  });

  const [predictedDuration, setPredictedDuration] = useState(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine which category is selected
    const { Category } = inputData;

    // Update category boolean values based on selected Category
    const isFrontend = Category === 'Frontend Development';
    const isMobileApp = Category === 'Mobile App Development';

    // Prepare the data object to send to the API
    const requestData = {
      'Number of Topics': inputData['Number of Topics'],
      'Number of Examples': inputData['Number of Examples'],
      'Average Score (%)': inputData['Average Score (%)'],
      'Category_FrontendDevelopment': isFrontend,
      'Category_MobileAppDevelopment': isMobileApp,
      'Interactive Exercises_True': inputData['Interactive Exercises_True']
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', requestData);
      setPredictedDuration(response.data.predicted_duration_weeks);
      setShowOutput(true); // Show output pop-up
    } catch (error) {
      console.error('Prediction Error:', error);
    }
  };

  const handleCancel = () => {
    setShowOutput(false); // Hide output pop-up
    setPredictedDuration(null); // Reset predicted duration
  };

  return (
    <div className="App" style={containerStyle}>
      <h1 style={headerStyle}>Duration Predictor</h1>
      {!showOutput ? (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={gridContainerStyle}>
            <div style={gridItemStyle}>
              <label style={labelStyle}>Number of Topics:</label>
              <input type="number" name="Number of Topics" value={inputData['Number of Topics']} onChange={handleInputChange} style={inputStyle}
                  min="1" // Ensures non-negative value
                  required // Makes the field required
                  />
            </div>
            <div style={gridItemStyle}>
  <label style={labelStyle}>Number of Practical Sessions:</label>
  <input
    type="number"
    name="Number of Examples"
    value={inputData['Number of Examples']}
    onChange={handleInputChange}
    style={inputStyle}
    min="1" // Ensures non-negative value
    required // Makes the field required
  />
</div>

            <div style={gridItemStyle}>
              <label style={labelStyle}>Average Score (%):</label>
              <input type="number" name="Average Score (%)" value={inputData['Average Score (%)']} onChange={handleInputChange} style={inputStyle}
              min="75" // Ensures non-negative value
              max = "85"
              required // Makes the field required
               />
            </div>
            <div style={gridItemStyle}>
              <label style={labelStyle}>Category:</label>
              <select name="Category" value={inputData['Category']} onChange={handleInputChange} style={selectStyle} required>
                <option value="">Select Category</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="DevOps">DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Project Management">Project Management</option>
                <option value="Marketing">Marketing</option>
                <option value="Business Skills">Business Skills</option>
                <option value="Emerging Technologies">Emerging Technologies</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Add other input fields and controls */}
          </div>
          <button type="submit" style={buttonStyle}>Predict Duration</button>
        </form>
      ) : (
        <div style={outputContainerStyle}>
          <div style={outputCardStyle}>
            <p style={outputTextStyle}>Predicted Duration Hour(s): {predictedDuration}</p>
            <button onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline CSS styles
const containerStyle = {
  display: 'grid',
  placeItems: 'center',
  minHeight: '10vh',
  padding: '20px',
};

const headerStyle = {
  fontSize: '2rem'
};

const formStyle = {
  width: '100%',
};

const gridContainerStyle = {
  marginTop:'100px',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '10px',
};

const gridItemStyle = {
  marginBottom: '10px',
};

const labelStyle = {
  textAlign: 'left',
};

const inputStyle = {

  width: '100%',
  padding: '5px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const selectStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px',
  borderRadius: '4px',
  background: '#007BFF',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const outputContainerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const outputCardStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
  width:'50%'
};

const outputTextStyle = {
  fontSize: '2.2rem',
  marginBottom: '10px',
};

const cancelButtonStyle = {
  padding: '8px 16px',
  borderRadius: '4px',
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

export default Prediction;
