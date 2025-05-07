
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildings } from '@/hooks/useBuildings';
import BuildingItem from '@/components/BuildingItem';
import ContextMenu from '@/components/admin/ContextMenu';
import BuildingPlacementModal from '@/components/admin/BuildingPlacementModal';
import ControlPanel from '@/components/admin/ControlPanel';
import OrientationWarning from '@/components/OrientationWarning';
import { toast } from 'sonner';

const AdminPortal = () => {
  const {
    buildings,
    backgroundImage,
    selectedBuildingId,
    setSelectedBuildingId,
    saveChanges,
    addBuilding,
    updateBuilding,
    removeBuilding,
    getSelectedBuilding,
    updateBackgroundImage
  } = useBuildings();

  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0
  });

  const [placementModal, setPlacementModal] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0
  });

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Update building positions on window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      // If we have a selected building, update its position to stay in the same relative position
      if (selectedBuildingId) {
        const selectedBuilding = getSelectedBuilding();
        if (selectedBuilding) {
          // Position stays the same because we're using percentage-based positioning in BuildingItem
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedBuildingId, getSelectedBuilding]);

  // Handle right-click for context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we're right-clicking on a building
    const target = e.target as HTMLElement;
    const buildingElement = target.closest('[data-building-id]') as HTMLElement;
    
    if (buildingElement) {
      const id = buildingElement.dataset.buildingId;
      if (id) setSelectedBuildingId(id);
    } else {
      // If not clicking on a building, deselect
      setSelectedBuildingId(null);
    }
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle building placement
  const handlePlaceBuilding = () => {
    setPlacementModal({
      visible: true,
      x: contextMenu.x,
      y: contextMenu.y
    });
  };

  // Add new building from modal
  const handleAddBuilding = (imageUrl: string, redirectUrl: string, scale: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    
    if (!rect) return;
    
    // Calculate placement position relative to container
    const x = placementModal.x - rect.left;
    const y = placementModal.y - rect.top;
    
    // Default size of building
    const width = 150;
    const height = 150;
    
    const newBuildingId = addBuilding({
      imageUrl,
      redirectUrl,
      x,
      y,
      width,
      height,
      scale,
      rotation: 0,
      perspective: 1000,
      perspectiveX: 1000, // Add missing properties
      perspectiveY: 1000  // Add missing properties
    });
    
    setSelectedBuildingId(newBuildingId);
    toast.success('Building added successfully');
  };

  // Handle view page button
  const handleViewPage = () => {
    // Save changes before navigating
    saveChanges();
    navigate('/');
  };

  // Handle save changes
  const handleSaveChanges = () => {
    const success = saveChanges();
    if (success) {
      // Reset selected building
      setSelectedBuildingId(null);
    }
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative"
      onContextMenu={handleContextMenu}
    >
      <OrientationWarning />
      
      {/* Background Image */}
      <div
        className="bg-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Buildings */}
      {buildings.map((building) => (
        <BuildingItem
          key={building.id}
          building={building}
          isAdmin={true}
          isSelected={building.id === selectedBuildingId}
          onClick={setSelectedBuildingId}
        />
      ))}
      
      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onPlaceBuilding={handlePlaceBuilding}
          onRemoveBuilding={selectedBuildingId ? () => removeBuilding(selectedBuildingId) : undefined}
          hasSelectedBuilding={!!selectedBuildingId}
        />
      )}
      
      {/* Building Placement Modal */}
      {placementModal.visible && (
        <BuildingPlacementModal
          onClose={() => setPlacementModal({ ...placementModal, visible: false })}
          onAddBuilding={handleAddBuilding}
          position={{ x: placementModal.x, y: placementModal.y }}
        />
      )}
      
      {/* Control Panel */}
      <ControlPanel
        selectedBuilding={getSelectedBuilding()}
        onUpdateBuilding={updateBuilding}
        onRemoveBuilding={removeBuilding}
        onSaveChanges={handleSaveChanges}
        onViewPage={handleViewPage}
        onChangeBackground={updateBackgroundImage}
        backgroundImage={backgroundImage}
      />
      
      {/* Admin Header */}
      <div className="fixed top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-md z-10">
        <h1 className="text-lg font-bold">Admin Portal</h1>
      </div>
    </div>
  );
};

export default AdminPortal;
