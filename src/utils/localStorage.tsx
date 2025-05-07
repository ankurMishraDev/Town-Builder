
export interface Building {
  id: string;
  imageUrl: string;
  redirectUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  perspective: number;
  perspectiveX: number; // Horizontal perspective
  perspectiveY: number; // Vertical perspective
  rotateX?: number;     // X-axis rotation (tilt)
  rotateY?: number;     // Y-axis rotation (side view)
  rotateZ?: number;     // Z-axis rotation (roll)
}

export const loadBuildings = (): Building[] => {
  try {
    const storedBuildings = localStorage.getItem('buildings');
    if (!storedBuildings) return [];
    
    const parsedBuildings = JSON.parse(storedBuildings);
    
    // Ensure backward compatibility with older building data
    return parsedBuildings.map((building: Building) => ({
      ...building,
      // Default values if properties don't exist
      perspective: building.perspective || 1000,
      perspectiveX: building.perspectiveX || building.perspective || 1000,
      perspectiveY: building.perspectiveY || building.perspective || 1000,
      rotateX: building.rotateX || building.rotation || 0, // Compatible with old rotation
      rotateY: building.rotateY || 0,
      rotateZ: building.rotateZ || 0
    }));
  } catch (error) {
    console.error('Error loading buildings:', error);
    return [];
  }
};

export const saveBuildings = (buildings: Building[]) => {
  localStorage.setItem('buildings', JSON.stringify(buildings));
};

export const loadBackgroundImage = (): string => {
  try {
    const storedBackground = localStorage.getItem('backgroundImage');
    return storedBackground || '';
  } catch (error) {
    console.error('Error loading background image:', error);
    return '';
  }
};

export const saveBackgroundImage = (url: string) => {
  localStorage.setItem('backgroundImage', url);
};

export const getLastUpdated = (): string | null => {
  try {
    return localStorage.getItem('lastUpdated');
  } catch (error) {
    console.error('Error getting last updated time:', error);
    return null;
  }
};

export const setLastUpdated = (timestamp: string) => {
  localStorage.setItem('lastUpdated', timestamp);
};
