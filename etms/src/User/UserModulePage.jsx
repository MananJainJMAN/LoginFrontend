import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './ModuleCards.css'; // Import custom CSS for module cards styling
import ModuleCard from './ModuleCard';

const ModuleCards = () => {
  // State to store the fetched training modules
  const [trainingModules, setTrainingModules] = useState([]);

  // Fetch training modules from the API
  useEffect(() => {
    const fetchTrainingModules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/training-modules');
        setTrainingModules(response.data);
      } catch (error) {
        console.error('Error fetching training modules:', error);
      }
    };
    fetchTrainingModules();
  }, []);

  return (
    <div>
    <h1>Your Modules</h1>
    <div className="container bootstrap snippets bootdeys">
      <div className="row">
        {trainingModules.map(module => (
          <ModuleCard
            key={module._id}
            title={module.moduleName}
            description={module.description}
            duration={module.duration}
            difficultyLevel={module.difficultyLevel}
            prerequisites={module.prerequisites}
            resourceLinks={module.resourceLinks}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default ModuleCards;
