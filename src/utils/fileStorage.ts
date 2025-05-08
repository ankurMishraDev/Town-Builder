import { Building } from './localStorage';

// Function to fetch building data from the JSON file
export const loadBuildings = async (): Promise<Building[]> => {
  try {
    const response = await fetch('/buildings.json');
    const data = await response.json();
    
    // Ensure backward compatibility with older building data
    return data.buildings.map((building: Building) => ({
      ...building,
      // Default values if properties don't exist
      perspective: building.perspective || 1000,
      perspectiveX: building.perspectiveX || building.perspective || 1000,
      perspectiveY: building.perspectiveY || building.perspective || 1000,
      rotateX: building.rotateX || building.rotation || 0,
      rotateY: building.rotateY || 0,
      rotateZ: building.rotateZ || 0
    }));
  } catch (error) {
    console.error('Error loading buildings:', error);
    return [];
  }
};

// Function to fetch background image from the JSON file
export const loadBackgroundImage = async (): Promise<string> => {
  try {
    const response = await fetch('/buildings.json');
    const data = await response.json();
    return data.backgroundImage || '';
  } catch (error) {
    console.error('Error loading background image:', error);
    return '';
  }
};

// Function to get last updated timestamp
export const getLastUpdated = async (): Promise<string | null> => {
  try {
    const response = await fetch('/buildings.json');
    const data = await response.json();
    return data.lastUpdated || null;
  } catch (error) {
    console.error('Error getting last updated time:', error);
    return null;
  }
}; 