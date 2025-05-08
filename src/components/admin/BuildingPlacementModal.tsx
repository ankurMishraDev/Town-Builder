import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface BuildingImage {
  normal: string;
  glowing: string;
}

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
  const [selectedImage, setSelectedImage] = useState<BuildingImage | null>(null);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [scale, setScale] = useState(1);

  // Predefined building images
  const buildingImages: BuildingImage[] = [
    {
      normal: '/buildingImages/building_01.png',
      glowing: '/buildingImages/glow_building_01.png'
    },
    {
      normal: '/buildingImages/building_02.png',
      glowing: '/buildingImages/glow_building_02.png'
    },
    {
      normal: '/buildingImages/building_03.png',
      glowing: '/buildingImages/glow_building_03.png'
    },
    {
      normal: '/buildingImages/building_04.png',
      glowing: '/buildingImages/glow_building_04.png'
    },
    {
      normal: '/buildingImages/building_05.png',
      glowing: '/buildingImages/glow_building_05.png'
    },
    {
      normal: '/buildingImages/building_06.png',
      glowing: '/buildingImages/glow_building_06.png'
    },
    {
      normal: '/buildingImages/building_07.png',
      glowing: '/buildingImages/glow_building_07.png'
    },
    {
      normal: '/buildingImages/building_08.png',
      glowing: '/buildingImages/glow_building_08.png'
    },
    {
      normal: '/buildingImages/building_09.png',
      glowing: '/buildingImages/glow_building_09.png'
    },
    {
      normal: '/buildingImages/building_10.png',
      glowing: '/buildingImages/glow_building_10.png'
    },
    {
      normal: '/buildingImages/building_11.png',
      glowing: '/buildingImages/glow_building_11.png'
    },
    {
      normal: '/buildingImages/building_12.png',
      glowing: '/buildingImages/glow_building_12.png'
    },
    {
      normal: '/buildingImages/building_13.png',
      glowing: '/buildingImages/glow_building_13.png'
    },
    {
      normal: '/buildingImages/building_14.png',
      glowing: '/buildingImages/glow_building_14.png'
    },
    {
      normal: '/buildingImages/building_15.png',
      glowing: '/buildingImages/glow_building_15.png'
    },
    {
      normal: '/buildingImages/building_16.png',
      glowing: '/buildingImages/glow_building_16.png'
    },
    {
      normal: '/buildingImages/building_17.png',
      glowing: '/buildingImages/glow_building_17.png'
    }
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

    onAddBuilding(selectedImage.normal, redirectUrl, scale);
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
                className={`border-2 rounded cursor-pointer p-1 relative group ${
                  selectedImage?.normal === image.normal ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.normal}
                  alt={`Building ${index + 1}`}
                  className="w-full h-auto object-cover aspect-square transition-opacity duration-300 group-hover:opacity-0"
                />
                <img 
                  src={image.glowing}
                  alt={`Building ${index + 1} Glowing`}
                  className="w-full h-auto object-cover aspect-square absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
