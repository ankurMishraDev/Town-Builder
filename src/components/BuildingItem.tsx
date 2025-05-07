import React from 'react';
import { Building } from '../utils/localStorage';

interface BuildingItemProps {
  building: Building;
  isAdmin?: boolean;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

const BuildingItem: React.FC<BuildingItemProps> = ({ 
  building, 
  isAdmin = false, 
  isSelected = false,
  onClick 
}) => {
  const { id, imageUrl, x, y, width, height, scale, rotation, perspectiveX, perspectiveY } = building;
  
  const handleClick = () => {
    if (isAdmin && onClick) {
      onClick(id);
    } else if (!isAdmin) {
      window.open(building.redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate percentage-based position and size for responsiveness
  const buildingStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x / window.innerWidth * 100}%`,
    top: `${y / window.innerHeight * 100}%`,
    width: `${width}px`,  // Remove scale from here
    height: `${height}px`, // Remove scale from here
    border: isSelected ? '2px solid #4CAF50' : 'none',
    boxShadow: isSelected ? '0 0 15px rgba(76, 175, 80, 0.6)' : 'none',
    zIndex: isSelected ? 10 : 1,
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
    perspective: `${perspectiveX}px`,
    cursor: isAdmin ? 'move' : 'pointer'
  };
  
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transform: `scale(${scale}) rotateX(${rotation}deg) rotateY(${building.rotateY || 0}deg) rotateZ(${building.rotateZ || 0}deg)`, 
    transition: 'transform 0.3s ease-in-out',
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center'
  };

  return (
    <div
      className={`building ${isAdmin ? 'admin' : ''} ${isSelected ? 'selected' : ''}`}
      style={buildingStyle}
      onClick={handleClick}
      data-building-id={id}
    >
      <img 
        src={imageUrl} 
        alt="Building" 
        style={imageStyle}
        draggable={false}
      />
    </div>
  );
};

export default BuildingItem;
