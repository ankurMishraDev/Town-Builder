import { useState, useEffect } from 'react';
import { Building, loadBuildings, saveBuildings, loadBackgroundImage, saveBackgroundImage, getLastUpdated } from '../utils/localStorage';
import { toast } from 'sonner';

export const useBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load data on initial mount
  useEffect(() => {
    loadData();
  }, []);

  // Poll for updates every 30 seconds in non-admin mode to check for changes
  useEffect(() => {
    if (window.location.pathname !== '/admin-portal') {
      const interval = setInterval(() => {
        const currentLastUpdated = getLastUpdated();
        if (currentLastUpdated && currentLastUpdated !== lastUpdated) {
          loadData();
        }
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [lastUpdated]);

  const loadData = () => {
    try {
      const loadedBuildings = loadBuildings();
      const loadedBackground = loadBackgroundImage();
      const currentLastUpdated = getLastUpdated();
      
      setBuildings(loadedBuildings);
      setBackgroundImage(loadedBackground);
      setLastUpdated(currentLastUpdated);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load buildings data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveChanges = () => {
    try {
      saveBuildings(buildings);
      saveBackgroundImage(backgroundImage);
      const currentLastUpdated = new Date().toISOString();
      setLastUpdated(currentLastUpdated);
      toast.success('Changes saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save changes');
      return false;
    }
  };

  const addBuilding = (building: Omit<Building, 'id'>) => {
    const newBuilding: Building = {
      ...building,
      id: `building-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      perspectiveX: building.perspectiveX || building.perspective || 800,
      perspectiveY: building.perspectiveY || building.perspective || 800
    };
    
    setBuildings(prev => [...prev, newBuilding]);
    return newBuilding.id;
  };

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    setBuildings(prev => 
      prev.map(building => 
        building.id === id ? { ...building, ...updates } : building
      )
    );
  };

  const removeBuilding = (id: string) => {
    setBuildings(prev => prev.filter(building => building.id !== id));
    if (selectedBuildingId === id) {
      setSelectedBuildingId(null);
    }
  };

  const getSelectedBuilding = () => {
    if (!selectedBuildingId) return null;
    return buildings.find(b => b.id === selectedBuildingId) || null;
  };

  const updateBackgroundImage = (url: string) => {
    setBackgroundImage(url);
  };

  return {
    buildings,
    backgroundImage,
    isLoading,
    selectedBuildingId,
    setSelectedBuildingId,
    saveChanges,
    addBuilding,
    updateBuilding,
    removeBuilding,
    getSelectedBuilding,
    updateBackgroundImage,
    lastUpdated
  };
};
