import React, { useRef, useEffect } from 'react';

const WaveformVisualizer = ({ data = [], isRecording }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // If not recording and no data, show a flat line
    if (!isRecording && data.length === 0) {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = '#CBD5E0';
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }
    
    // Draw waveform
    const barWidth = width / (data.length || 1);
    const centerY = height / 2;
    
    ctx.fillStyle = isRecording ? '#F56565' : '#4299E1';
    
    data.forEach((value, index) => {
      // Normalize value (0-255) to a reasonable height
      const barHeight = (value / 255) * (height * 0.8);
      
      // Draw bars symmetrically above and below the center line
      const halfBarHeight = barHeight / 2;
      const x = index * barWidth;
      
      ctx.fillRect(x, centerY - halfBarHeight, barWidth - 1, halfBarHeight);
      ctx.fillRect(x, centerY, barWidth - 1, halfBarHeight);
    });
    
    // Add a glow effect when recording
    if (isRecording) {
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.strokeStyle = 'rgba(245, 101, 101, 0.3)';
      ctx.lineWidth = height * 0.7;
      ctx.filter = 'blur(8px)';
      ctx.stroke();
      ctx.filter = 'none';
    }
  }, [data, isRecording]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={100} 
      className="w-full h-full bg-gray-50 rounded"
    />
  );
};

export default WaveformVisualizer;