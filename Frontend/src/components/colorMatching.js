import React, {  useState } from 'react';

const CalmColorMatching = () => {
    const generateRandomColor = () => {
        return {
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256),
        };
      };


  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [currentColor, setCurrentColor] = useState({ r: 128, g: 128, b: 128 });
  const [score, setScore] = useState(100);

  const handleSliderChange = (color, value) => {
    setCurrentColor((prev) => ({
      ...prev,
      [color]: parseInt(value, 10),
    }));
  };

  const calculateScore = () => {
    const difference = Math.abs(targetColor.r - currentColor.r) +
      Math.abs(targetColor.g - currentColor.g) +
      Math.abs(targetColor.b - currentColor.b);
    setScore(Math.max(100 - Math.round((difference / 765) * 100), 0));
  };

  

  const resetGame = () => {
    setTargetColor(generateRandomColor());
    setCurrentColor({ r: 128, g: 128, b: 128 });
    setScore(100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-5 text-gray-900 dark:text-white dark:bg-black">
      <h1 className="text-4xl font-bold mb-8">Calm Color Matching</h1>

      <div className="flex flex-col items-center">
       <div className='flex flex-row justify-evenly w-96'>
         {/* Target Color */}
         <div className="mb-4">
          <h2 className="text-xl font-medium mb-2">Target Color</h2>
          <div
            className="w-40 h-40 rounded-lg shadow-md"
            style={{
              backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`,
            }}
          />
        </div>

        {/* Current Color */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-2">Your Color</h2>
          <div
            className="w-40 h-40 rounded-lg shadow-md"
            style={{
              backgroundColor: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`,
            }}
          />
        </div>
       </div>

        {/* RGB Sliders */}
        <div className="w-64 mb-8">
          <ColorSlider
            color="r"
            value={currentColor.r}
            onChange={(e) => handleSliderChange('r', e.target.value)}
          />
          <ColorSlider
            color="g"
            value={currentColor.g}
            onChange={(e) => handleSliderChange('g', e.target.value)}
          />
          <ColorSlider
            color="b"
            value={currentColor.b}
            onChange={(e) => handleSliderChange('b', e.target.value)}
          />
        </div>

        {/* Score Display */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Score: {score}</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={calculateScore}
            className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none"
          >
            Check Match
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            New Color
          </button>
        </div>
      </div>
    </div>
  );
};

// Color Slider Component
const ColorSlider = ({ color, value, onChange }) => {
  const colors = {
    r: 'Red',
    g: 'Green',
    b: 'Blue',
  };
  return (
    <div className="flex flex-col mb-4">
      <label className="text-lg mb-1">{colors[color]}</label>
      <input
        type="range"
        min="0"
        max="255"
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none"
        style={{
          background: `linear-gradient(to right, rgb(${color === 'r' ? '0,0,0' : '255,0,0'}), rgb(${color === 'r' ? '255,0,0' : '0,0,0'}))`,
        }}
      />
      <span className="text-center mt-1">{value}</span>
    </div>
  );
};

export default CalmColorMatching;
