import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');
    
    // Column setup
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Rainbow colors for matrix effect
    const colors = [
      '#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#ffff00',
      '#ccff00', '#99ff00', '#66ff00', '#33ff00', '#00ff00', '#00ff33',
      '#00ff66', '#00ff99', '#00ffcc', '#00ffff', '#00ccff', '#0099ff',
      '#0066ff', '#0033ff', '#0000ff', '#3300ff', '#6600ff', '#9900ff',
      '#cc00ff', '#ff00ff', '#ff00cc', '#ff0099', '#ff0066', '#ff0033'
    ];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    
    const draw = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Rainbow color based on position and time
        const colorIndex = (i + Math.floor(Date.now() / 100)) % colors.length;
        ctx.fillStyle = colors[colorIndex];
        
        // Add glow effect
        ctx.shadowColor = colors[colorIndex];
        ctx.shadowBlur = 10;
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Move drop down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 50);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(45deg, #0a0a0a, #1a1a2e, #16213e)' }}
    />
  );
};

export default MatrixBackground;