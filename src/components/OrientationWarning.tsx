
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const OrientationWarning: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  const checkOrientation = () => {
    // Check if screen is in portrait mode (height > width)
    const portrait = window.innerHeight > window.innerWidth;
    setIsPortrait(portrait);
    
    if (portrait) {
      toast.warning('Please rotate your device to landscape mode for the best experience', {
        duration: 3000,
        id: 'orientation-warning', // Prevents duplicate toasts
      });
    }
  };

  useEffect(() => {
    // Check orientation on initial load
    checkOrientation();

    // Add event listener for orientation changes
    window.addEventListener('resize', checkOrientation);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-white p-6 animate-fade-in">
      <div className="animate-rotation mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21V14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7" />
          <path d="M7 9h10" />
          <path d="M7 6h10" />
          <path d="M7 3h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Please Rotate Your Device</h2>
      <p className="text-center mb-4">This application is designed for landscape mode only.</p>
      <p className="text-center text-sm">Rotate your device to horizontal position for the best experience.</p>
    </div>
  );
};

export default OrientationWarning;
