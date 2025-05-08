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

  // Get the glowing version of the image
  const getGlowingImageUrl = (normalUrl: string) => {
    return normalUrl.replace('building_', 'glow_building_');
  };

  // Calculate percentage-based position and size for responsiveness
  const buildingStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x / window.innerWidth * 100}%`,
    top: `${y / window.innerHeight * 100}%`,
    width: `${width}px`,
    height: `${height}px`,
    border: isSelected ? '2px solid #4CAF50' : 'none',
    boxShadow: isSelected ? '0 0 15px rgba(76, 175, 80, 0.6)' : 'none',
    zIndex: isSelected ? 10 : 1,
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
    perspective: `${perspectiveX}px`,
    cursor: isAdmin ? 'move' : 'pointer',
    padding: 0,
    margin: 0,
    overflow: 'hidden'
  };
  
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transform: `scale(${scale}) rotateX(${rotation}deg) rotateY(${building.rotateY || 0}deg) rotateZ(${building.rotateZ || 0}deg)`, 
    transition: 'transform 0.3s ease-in-out',
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
    display: 'block'
  };

  return (
    <div
      className={`building ${isAdmin ? 'admin' : ''} ${isSelected ? 'selected' : ''} relative group`}
      style={buildingStyle}
      onClick={handleClick}
      data-building-id={id}
    >
      <div className="w-full h-full relative">
        <img 
          src={imageUrl}
          alt="Building" 
          style={imageStyle}
          draggable={false}
          className="transition-opacity duration-300 group-hover:opacity-0"
        />
        <img 
          src={getGlowingImageUrl(imageUrl)}
          alt="Building Glowing" 
          style={imageStyle}
          draggable={false}
          className="absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
    </div>
  );
};

export default BuildingItem;
