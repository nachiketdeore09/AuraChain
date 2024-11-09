import React, { useState, useEffect } from 'react';

const DivingCircleGame = () => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [size, setSize] = useState(300); // Initial size of the circle in pixels

  // Generate random position within the screen
  const getRandomPosition = () => {
    const randomTop = Math.floor(Math.random() * 80) + 10; // Random percentage from 10% to 90%
    const randomLeft = Math.floor(Math.random() * 80) + 10; // Random percentage from 10% to 90%
    return { top: `${randomTop}%`, left: `${randomLeft}%` };
  };

  // Handle circle hover
  const handleHover = () => {
    setPosition(getRandomPosition()); // Move circle to new random position
    setSize(prevSize => Math.max(prevSize - 20, 50)); // Decrease size but stop at 50px minimum
  };

  // Reset game when circle is too small
  useEffect(() => {
    if (size <= 50) {
      alert("You won! The circle dived too much!");
      setSize(300); // Reset size
      setPosition({ top: '50%', left: '50%' }); // Reset position to center
    }
  }, [size]);

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-600">
      <div
        className="absolute rounded-full bg-red-400 transition-all duration-300 ease-in-out cursor-pointer"
        style={{
          top: position.top,
          left: position.left,
          width: `${size}px`,
          height: `${size}px`,
        }}
        onMouseEnter={handleHover}
      ></div>
      <div className="absolute bottom-10 text-white text-2xl">
        Try to catch the diving circle!
      </div>
    </div>
  );
};

export default DivingCircleGame;
