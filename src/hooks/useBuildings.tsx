import { useState, useEffect } from 'react';
import { Building } from '../utils/localStorage';
import { loadBuildings, loadBackgroundImage, getLastUpdated } from '../utils/fileStorage';
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
      const interval = setInterval(async () => {
        const currentLastUpdated = await getLastUpdated();
        if (currentLastUpdated && currentLastUpdated !== lastUpdated) {
          loadData();
        }
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [lastUpdated]);

  const loadData = async () => {
    try {
      const [loadedBuildings, loadedBackground, currentLastUpdated] = await Promise.all([
        loadBuildings(),
        loadBackgroundImage(),
        getLastUpdated()
      ]);
      
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
    // In this implementation, we don't save changes directly
    // Instead, we'll show a message to update the JSON file
    toast.info('Please update the buildings.json file with the current layout');
    return true;
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
    // If we have a selected building, update its redirect URL
    if (selectedBuildingId) {
      const building = buildings.find(b => b.id === selectedBuildingId);
      if (building) {
        updateBuilding(selectedBuildingId, { redirectUrl: url });
        return;
      }
    }
    // Otherwise, update the background image as before
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
