
import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onPlaceBuilding: () => void;
  onRemoveBuilding?: () => void;
  hasSelectedBuilding: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  x, 
  y, 
  onClose, 
  onPlaceBuilding, 
  onRemoveBuilding,
  hasSelectedBuilding 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="context-menu"
      style={{ top: y, left: x }}
    >
      <div className="py-1">
        <button
          onClick={() => {
            onPlaceBuilding();
            onClose();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Place Building
        </button>
        
        {hasSelectedBuilding && onRemoveBuilding && (
          <button
            onClick={() => {
              onRemoveBuilding();
              onClose();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Remove Building
          </button>
        )}
      </div>
    </div>
  );
};

export default ContextMenu;
