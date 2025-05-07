
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface BuildingPlacementModalProps {
  onClose: () => void;
  onAddBuilding: (imageUrl: string, redirectUrl: string, scale: number) => void;
  position: { x: number; y: number };
}

const BuildingPlacementModal: React.FC<BuildingPlacementModalProps> = ({ 
  onClose, 
  onAddBuilding,
  position
}) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [scale, setScale] = useState(1);

  // Predefined building images
  const buildingImages = [
    '/newBuildingImages/Sinoss.PNG',
    '/newBuildingImages/Sinoss(1).PNG',
    '/newBuildingImages/Sinoss(2).PNG',
    '/newBuildingImages/Sinoss(3).PNG',
    '/newBuildingImages/Sinoss(4).PNG',
    '/newBuildingImages/Sinoss(5).PNG',
    '/newBuildingImages/Sinoss(6).PNG',
    '/newBuildingImages/Sinoss(7).PNG',
    '/newBuildingImages/Sinoss(8).PNG',
    '/newBuildingImages/Sinoss(9).PNG',
    '/newBuildingImages/Sinoss(10).PNG',
    '/newBuildingImages/Sinoss(11).PNG',
    '/newBuildingImages/Sinoss(12).PNG',
    '/newBuildingImages/Sinoss(13).PNG',
    '/newBuildingImages/Sinoss(14).PNG',
    '/newBuildingImages/Sinoss(15).PNG',
    '/newBuildingImages/Sinoss(16).PNG'
  ];

  const handleAddBuilding = () => {
    if (!selectedImage) {
      alert('Please select a building image');
      return;
    }

    if (!redirectUrl) {
      alert('Please enter a redirect URL');
      return;
    }

    onAddBuilding(selectedImage, redirectUrl, scale);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Place Building</h2>
        
        <div className="mb-4">
          <Label className="mb-2 block">Select a Building</Label>
          <div className="grid grid-cols-3 gap-2">
            {buildingImages.map((image, index) => (
              <div 
                key={index} 
                className={`border-2 rounded cursor-pointer p-1 ${selectedImage === image ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image}
                  alt={`Building ${index + 1}`}
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="scale" className="mb-2 block">Building Scale: {scale.toFixed(1)}</Label>
          <Slider
            id="scale"
            defaultValue={[1]}
            max={2}
            min={0.5}
            step={0.1}
            onValueChange={(values) => setScale(values[0])}
            className="mb-4"
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="redirectUrl" className="mb-2 block">Redirect URL</Label>
          <Input
            id="redirectUrl"
            type="url"
            placeholder="https://example.com"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddBuilding}>Add Building</Button>
        </div>
      </div>
    </div>
  );
};

export default BuildingPlacementModal;
