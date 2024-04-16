// Import custom CSS for module cards styling
import React from 'react';
import './ModuleCards.css'; // Import custom CSS for module card styling

const ModuleCard = ({ title, description, duration, difficultyLevel, prerequisites, resourceLinks }) => {
  // Generate a random color for the card
  const getRandomColor = () => {
    const colors = ['blue', 'green', 'yellow', 'purple', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const color = getRandomColor();

  return (
    <div className="col-md-4 col-sm-6 content-card">
      <div className="card-big-shadow">
        <div className='card card-just-text' data-background="color" data-color={color} data-radius="none">
          <div className="content">
            <h3 className="title">{title} <span role="img" aria-label="Book">📚</span></h3>
            <h6 className="description">{description}</h6> 
            <h4  className="duration">Duration:</h4>  <p> {duration} hour(s)<span role="img" aria-label="Clock">⏰</span></p>
            <h4 className="difficulty">Difficulty Level:</h4> <p>{difficultyLevel} <span role="img" aria-label="Star">⭐️</span></p>
            <h4 className="prerequisites">Prerequisites:</h4>  <p>{prerequisites.join(', ')} <span role="img" aria-label="Link"></span></p>
            <h4 className="resource-links">Resource Links:</h4 >
            <ul>
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url}>{link.title} 🔗</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
