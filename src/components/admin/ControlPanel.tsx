import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building } from '@/utils/localStorage';
import { 
  RotateCw, Save, Trash2, ArrowUp, ArrowDown, 
  ArrowLeft, ArrowRight, RefreshCw, Upload, Copy
} from "lucide-react";
import { toast } from "sonner";

interface ControlPanelProps {
  selectedBuilding: Building | null;
  onUpdateBuilding: (id: string, updates: Partial<Building>) => void;
  onRemoveBuilding: (id: string) => void;
  onSaveChanges: () => void;
  onViewPage: () => void;
  onChangeBackground: (url: string) => void;
  backgroundImage: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedBuilding,
  onUpdateBuilding,
  onRemoveBuilding,
  onSaveChanges,
  onViewPage,
  onChangeBackground,
  backgroundImage
}) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedBuilding) return;
    
    const moveStep = 10; // px to move on arrow keys
    const id = selectedBuilding.id;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onUpdateBuilding(id, { y: selectedBuilding.y - moveStep });
        break;
      case 'ArrowDown':
        e.preventDefault();
        onUpdateBuilding(id, { y: selectedBuilding.y + moveStep });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onUpdateBuilding(id, { x: selectedBuilding.x - moveStep });
        break;
      case 'ArrowRight':
        e.preventDefault();
        onUpdateBuilding(id, { x: selectedBuilding.x + moveStep });
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBuilding]);

  // Update functions for 3D transformations
  const handlePerspectiveXChange = (values: number[]) => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, { perspectiveX: values[0] });
    }
  };

  const handlePerspectiveYChange = (values: number[]) => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, { perspectiveY: values[0] });
    }
  };

  const handleRotateXChange = (values: number[]) => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, { rotation: values[0] }); // Keep using rotation for compatibility
    }
  };

  const handleRotateYChange = (values: number[]) => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, { rotateY: values[0] });
    }
  };

  const handleRotateZChange = (values: number[]) => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, { rotateZ: values[0] });
    }
  };

  const handleScaleChange = (values: number[]) => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, { scale: values[0] });
    }
  };

  const handleWidthChange = (value: string) => {
    if (selectedBuilding) {
      const width = parseInt(value);
      if (!isNaN(width) && width > 0) {
        onUpdateBuilding(selectedBuilding.id, { width });
      }
    }
  };

  const handleHeightChange = (value: string) => {
    if (selectedBuilding) {
      const height = parseInt(value);
      if (!isNaN(height) && height > 0) {
        onUpdateBuilding(selectedBuilding.id, { height });
      }
    }
  };

  const handlePositionChange = (direction: 'up' | 'down' | 'left' | 'right', amount: number) => {
    if (selectedBuilding) {
      if (direction === 'up') {
        onUpdateBuilding(selectedBuilding.id, { y: selectedBuilding.y - amount });
      } else if (direction === 'down') {
        onUpdateBuilding(selectedBuilding.id, { y: selectedBuilding.y + amount });
      } else if (direction === 'left') {
        onUpdateBuilding(selectedBuilding.id, { x: selectedBuilding.x - amount });
      } else if (direction === 'right') {
        onUpdateBuilding(selectedBuilding.id, { x: selectedBuilding.x + amount });
      }
    }
  };

  const resetTransformations = () => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, {
        rotation: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        perspectiveX: 1000,
        perspectiveY: 1000
      });
    }
  };

  const setFrontView = () => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, {
        rotation: 0,
        rotateY: 0,
        rotateZ: 0
      });
    }
  };

  const setSideView = () => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, {
        rotation: 0,
        rotateY: 30,
        rotateZ: 0
      });
    }
  };

  const setAngledView = () => {
    if (selectedBuilding) {
      onUpdateBuilding(selectedBuilding.id, {
        rotation: 15,
        rotateY: -25,
        rotateZ: 5,
        scale: 1.1
      });
    }
  };

  const handleCopyBuildingData = () => {
    if (selectedBuilding) {
      const buildingData = JSON.stringify(selectedBuilding, null, 2);
      navigator.clipboard.writeText(buildingData).then(() => {
        toast.success('Building data copied to clipboard');
      }).catch(() => {
        toast.error('Failed to copy building data');
      });
    }
  };

  return (
    <div className="control-panel fixed left-4 top-4 z-10 w-72">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Admin Controls</h2>
        <div className="mb-4">
          <Label htmlFor="background-url" className="mb-1 block">Background Image URL</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="background-url"
              type="text"
              value={backgroundImage}
              onChange={(e) => onChangeBackground(e.target.value)}
              className="flex-grow"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button onClick={onSaveChanges} className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button onClick={onViewPage} className="flex-1">View Page</Button>
        </div>
      </div>

      {selectedBuilding ? (
        <div className="p-3 bg-gray-800 rounded-md">
          <h3 className="text-lg font-medium mb-3">Building Controls</h3>
          
          <div className="mb-4">
            <Label className="mb-1 block">Rotate X (Tilt): {selectedBuilding.rotation || 0}°</Label>
            <Slider
              defaultValue={[selectedBuilding.rotation || 0]}
              max={45}
              min={-45}
              step={1}
              value={[selectedBuilding.rotation || 0]}
              onValueChange={handleRotateXChange}
            />
          </div>
          
          <div className="mb-4">
            <Label className="mb-1 block">Rotate Y (Side): {selectedBuilding.rotateY || 0}°</Label>
            <Slider
              defaultValue={[selectedBuilding.rotateY || 0]}
              max={45}
              min={-45}
              step={1}
              value={[selectedBuilding.rotateY || 0]}
              onValueChange={handleRotateYChange}
            />
          </div>
          
          <div className="mb-4">
            <Label className="mb-1 block">Rotate Z (Roll): {selectedBuilding.rotateZ || 0}°</Label>
            <Slider
              defaultValue={[selectedBuilding.rotateZ || 0]}
              max={20}
              min={-20}
              step={1}
              value={[selectedBuilding.rotateZ || 0]}
              onValueChange={handleRotateZChange}
            />
          </div>
          
          <div className="mb-4">
            <Label className="mb-1 block">Perspective X: {selectedBuilding.perspectiveX}px</Label>
            <Slider
              defaultValue={[selectedBuilding.perspectiveX]}
              max={5000}
              min={500}
              step={50}
              value={[selectedBuilding.perspectiveX]}
              onValueChange={handlePerspectiveXChange}
            />
          </div>
          
          <div className="mb-4">
            <Label className="mb-1 block">Perspective Y: {selectedBuilding.perspectiveY}px</Label>
            <Slider
              defaultValue={[selectedBuilding.perspectiveY]}
              max={5000}
              min={500}
              step={50}
              value={[selectedBuilding.perspectiveY]}
              onValueChange={handlePerspectiveYChange}
            />
          </div>
          
          <div className="mb-4">
            <Label className="mb-1 block">Scale: {selectedBuilding.scale.toFixed(2)}</Label>
            <Slider
              defaultValue={[selectedBuilding.scale]}
              max={5}
              min={0.1}
              step={0.08}
              value={[selectedBuilding.scale]}
              onValueChange={handleScaleChange}
            />
            
          </div>
          
          <div className="flex gap-4 mb-4">
            <div>
              <Label htmlFor="width"  className="mb-1 block">Width</Label>
              <Input
                id="width"
                type="number"
                value={selectedBuilding.width}
                onChange={(e) => handleWidthChange(e.target.value)}
                min={10}
                style={{color: 'black'}}
              />
            </div>
            <div>
              <Label htmlFor="height"  className="mb-1 block">Height</Label>
              <Input
                id="height"
                type="number"
                value={selectedBuilding.height}
                onChange={(e) => handleHeightChange(e.target.value)}
                min={10}
                style={{color: 'black'}}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label className="mb-1 block">Position</Label>
            <div className="grid grid-cols-3 gap-2 my-2">
              <div></div>
              <Button size="sm" onClick={() => handlePositionChange('up', 1)}>
                <ArrowUp size={14} />
              </Button>
              <div></div>
              
              <Button size="sm" onClick={() => handlePositionChange('left', 1)}>
                <ArrowLeft size={14} />
              </Button>
              <div className="flex items-center justify-center">
                <RotateCw size={14} />
              </div>
              <Button size="sm" onClick={() => handlePositionChange('right', 1)}>
                <ArrowRight size={14} />
              </Button>
              
              <div></div>
              <Button size="sm" onClick={() => handlePositionChange('down', 1)}>
                <ArrowDown size={14} />
              </Button>
              <div></div>
            </div>
          </div>
          
          {/* Quick preset buttons for views */}
          <div className="mb-4 flex gap-2">
            <Button size="sm" onClick={setFrontView} className="flex-1">
              Front View
            </Button>
            <Button size="sm" onClick={setSideView} className="flex-1">
              Side View
            </Button>
            <Button size="sm" onClick={setAngledView} className="flex-1">
              Angled View
            </Button>
          </div>
          
          <div className="mb-4">
            <Button onClick={resetTransformations} size="sm" className="w-full mb-4">
              <RefreshCw size={14} className="mr-2" /> Reset Transformations
            </Button>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyBuildingData}
              className="flex-1"
              style={{color: 'black'}}
            >
              <Copy size={14} className="mr-1" /> Copy Building Data
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onRemoveBuilding(selectedBuilding.id)}
              className="flex-1"
            >
              <Trash2 size={14} className="mr-1" /> Delete Building
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-gray-300 bg-gray-800 p-3 rounded-md">
          <p>Select a building to edit, or right-click to place a new building.</p>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
