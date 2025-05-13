
import React, { useEffect, useRef } from 'react';

interface ShootingStarProps {
  className?: string;
}

const ShootingStars: React.FC<ShootingStarProps> = ({ className }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    
    // Clear any existing stars
    scene.innerHTML = '';
    
    // Create stars
    const createDivs = () => {
      for (let i = 0; i < 210; i++) {
        const div = document.createElement('div');
        scene.appendChild(div);
      }
    };
    
    createDivs();
    
    // Position and animate stars
    const stars = scene.querySelectorAll('div');
    stars.forEach(star => {
      const x = `${Math.random() * 200}vmax`;
      const rx = `${Math.random() * 360}deg`;
      const delay = `${Math.random() * 1.5}s`;
      
      star.style.setProperty('--x', x);
      star.style.setProperty('--rx', rx);
      star.style.animationDelay = delay;
    });
    
    return () => {
      // Cleanup
      if (scene) scene.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={sceneRef} 
      className={`scene ${className || ''}`}
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        perspective: '10vmin',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  );
};

export default ShootingStars;
