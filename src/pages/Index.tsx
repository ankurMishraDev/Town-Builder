
import React, { useEffect, useState } from 'react';
import { useBuildings } from '@/hooks/useBuildings';
import BuildingItem from '@/components/BuildingItem';
import OrientationWarning from '@/components/OrientationWarning';

const Index = () => {
  const { buildings, backgroundImage, isLoading } = useBuildings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-attention">
            <div className="h-12 w-12 border-4 rounded-full border-t-transparent border-primary animate-rotation mx-auto"></div>
          </div>
          <p className="mt-4 text-lg">Loading your visual hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
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
        />
      ))}
      
      {buildings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 p-6 rounded-lg text-center max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">Welcome to Visual Hub</h2>
            <p>No buildings have been placed yet. If you are the administrator, please visit the admin portal to add buildings.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
