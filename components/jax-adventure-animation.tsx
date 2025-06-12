import React, { useEffect, useRef, useState } from 'react';

interface JaxAdventureProps {
  onKeysPressed?: (keys: { ArrowUp: boolean; ArrowDown: boolean; ArrowLeft: boolean; ArrowRight: boolean }) => void;
}

const JaxAdventure = ({ onKeysPressed }: JaxAdventureProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jaxImageRef = useRef<HTMLImageElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // User control state for keyboard movement
  const [userControlEnabled, setUserControlEnabled] = useState(true);
  const [userOffset, setUserOffset] = useState({ x: 0, y: 0 });
  const userOffsetRef = useRef({ x: 0, y: 0 }); // Ref for animation loop access
  const [keysPressed, setKeysPressed] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  });

  // Update ref whenever userOffset changes
  useEffect(() => {
    userOffsetRef.current = userOffset;
  }, [userOffset]);

  // Notify parent component of key state changes
  useEffect(() => {
    if (onKeysPressed) {
      onKeysPressed(keysPressed);
    }
  }, [keysPressed, onKeysPressed]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!userControlEnabled) return;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setKeysPressed(prev => ({ ...prev, [e.key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!userControlEnabled) return;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setKeysPressed(prev => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [userControlEnabled]);

  // Update user offset based on keys pressed
  useEffect(() => {
    const updatePosition = () => {
      if (!userControlEnabled) return;

      const moveSpeed = 3; // Pixels per frame
      let deltaX = 0;
      let deltaY = 0;

      if (keysPressed.ArrowLeft) deltaX -= moveSpeed;
      if (keysPressed.ArrowRight) deltaX += moveSpeed;
      if (keysPressed.ArrowUp) deltaY -= moveSpeed;
      if (keysPressed.ArrowDown) deltaY += moveSpeed;

      if (deltaX !== 0 || deltaY !== 0) {
        setUserOffset(prev => ({
          x: Math.max(-200, Math.min(200, prev.x + deltaX)), // Limit movement range
          y: Math.max(-150, Math.min(150, prev.y + deltaY))
        }));
      }
    };

    const interval = setInterval(updatePosition, 16); // ~60fps
    return () => clearInterval(interval);
  }, [keysPressed, userControlEnabled]);

  // Load JAX image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      jaxImageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = (error) => {
      console.error('Failed to load JAX image:', error);
      setImageLoaded(false);
    };
    img.src = '/images/jax-tp.png';
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Colors
    const darkBlue = '#0077AA';
    const mediumBlue = '#00AADD';
    const lightBlue = '#99DDFF';
    const white = '#FFFFFF';
    const black = '#000022';
    const purple = '#330066';
    const darkPurple = '#110038'; // Matching the retrowave grid background
    const gridOrange = '#FF6600';
    const gridPink = '#FF0077';
    
    // Scene timing (in frames) - simplified to just final scene
    const scenes = [
      { name: "finalScene", duration: Infinity } // Final retrowave grid with text and controllable JAX
    ];
    
    // JAX character properties
    let jax = {
      x: -50,
      y: canvas.height / 2,
      scale: .15, // Scale factor instead of fixed dimensions
      speed: 1.5,
      bobAmount: 20,
      bobSpeed: 0.03,
      flying: false,
      flyHeight: 0,
      flySpeed: 0.02,
      flyDirection: -1, // 1 for up, -1 for down
      propellerAngle: 0,
      propellerSpeed: 0.2
    };
    
    // Boat properties
    let boat = {
      width: 130, // Increased from 80
      height: 80, // Increased from 50
      bobAmount: 8,
      bobSpeed: 0.025,
      rocking: 0.01
    };
    
    // Animation variables
    let frameCount = 0;
    let sceneStartFrame = 0;
    let currentSceneIndex = 0;
    let fadeOut = false;
    let fadeOutOpacity = 0;
    
    // Base water level
    const waterLevel = canvas.height - 150;
    
    // For boat positioning
    const boatX = canvas.width/3 - boat.width/2;
    const boatY = waterLevel - boat.height;
    
    // Drawing functions
    const drawWater = () => {
      // Draw ocean
      const gradient = ctx.createLinearGradient(0, waterLevel, 0, canvas.height);
      gradient.addColorStop(0, mediumBlue);
      gradient.addColorStop(1, darkBlue);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, waterLevel, canvas.width, canvas.height - waterLevel);
      
      // Draw waves
      ctx.strokeStyle = lightBlue;
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        
        const waveY = waterLevel + i * 15;
        const amplitude = 5 - i * 1.5;
        const frequency = 0.02 + i * 0.01;
        const phaseShift = frameCount * (0.02 - i * 0.005);
        
        for (let x = 0; x < canvas.width; x += 5) {
          const y = waveY + Math.sin(x * frequency + phaseShift) * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
    };
    
    const drawBoat = (x: number, y: number) => {
      // Boat rocking effect
      const rockAngle = Math.sin(frameCount * boat.rocking) * 0.05;
      
      // Save context for rotation
      ctx.save();
      ctx.translate(x + boat.width/2, y + boat.height/2);
      ctx.rotate(rockAngle);
      
      // Draw boat hull
      ctx.fillStyle = '#8B4513'; // Brown
      ctx.beginPath();
      ctx.moveTo(-boat.width/2, boat.height/2); // Bottom left
      ctx.lineTo(boat.width/2, boat.height/2); // Bottom right
      ctx.lineTo(boat.width/3, -boat.height/2); // Top right
      ctx.lineTo(-boat.width/3, -boat.height/2); // Top left
      ctx.closePath();
      ctx.fill();
      
      // Draw boat deck
      ctx.fillStyle = '#A0522D'; // Darker brown
      ctx.fillRect(-boat.width/3, -boat.height/2, boat.width*2/3, boat.height/4);
      
      // Draw mast
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(-5, -boat.height/2, 10, -65); // Taller mast
      
      // Draw sail - larger sail
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, -boat.height/2 - 65);
      ctx.lineTo(50, -boat.height/2 - 35);
      ctx.lineTo(35, -boat.height/2);
      ctx.lineTo(0, -boat.height/2);
      ctx.fill();

      // Second sail - adding a smaller top sail
      ctx.fillStyle = '#EEEEEE';
      ctx.beginPath();
      ctx.moveTo(0, -boat.height/2 - 65);
      ctx.lineTo(30, -boat.height/2 - 75);
      ctx.lineTo(20, -boat.height/2 - 45);
      ctx.lineTo(0, -boat.height/2 - 45);
      ctx.fill();
      

      
      // Add boat details - rope and cleats
      ctx.fillStyle = '#663311';
      // Cleats
      ctx.fillRect(-boat.width/4, -boat.height/2, 6, 5); // Left cleat
      ctx.fillRect(boat.width/4, -boat.height/2, 6, 5); // Right cleat
      
      // Ropes
      ctx.strokeStyle = '#DDCCAA';
      ctx.lineWidth = 1;
      // Rope to sail
      ctx.beginPath();
      ctx.moveTo(-boat.width/4 + 3, -boat.height/2);
      ctx.lineTo(0, -boat.height/2 - 40);
      ctx.stroke();
      
      // Rope along edge
      ctx.beginPath();
      ctx.moveTo(-boat.width/3, -boat.height/2 + 5);
      ctx.lineTo(boat.width/3, -boat.height/2 + 5);
      ctx.stroke();
      
      // Restore context
      ctx.restore();
    };
    
    const drawExplosion = (x: number, y: number, size: number, frame: number) => {
      const maxRadius = size;
      const innerRadius = maxRadius * 0.6;
      const outerRadius = maxRadius * (0.7 + 0.3 * (frame / 30));
      
      // Outer explosion
      const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
      gradient.addColorStop(0, 'rgba(255, 200, 50, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 100, 50, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner explosion
      const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, innerRadius);
      innerGradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
      innerGradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.9)');
      innerGradient.addColorStop(1, 'rgba(255, 150, 50, 0.8)');
      
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add some random sparks
      const sparkCount = 12;
      const sparkSize = 2 + (frame / 10);
      
      ctx.fillStyle = 'rgba(255, 255, 150, 0.8)';
      
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2;
        const randomDistance = outerRadius * 0.6 + Math.random() * outerRadius * 0.4;
        const sparkX = x + Math.cos(angle) * randomDistance;
        const sparkY = y + Math.sin(angle) * randomDistance;
        
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Draw propeller animation (extracted from original drawJax)
    const drawPropeller = (x: number, y: number) => {
      const propellerX = x + 24;
      const propellerY = y - 10;
      const propellerSize = 24;
      
      // Draw propeller mount
      ctx.fillStyle = '#555555';
      ctx.fillRect(x + 20, y - 16, 8, 6);
      
      // Draw propeller blades with enhanced detail
      ctx.save();
      ctx.translate(propellerX, propellerY);
      ctx.rotate(jax.propellerAngle);
      
      // Update propeller angle for animation
      jax.propellerAngle += jax.propellerSpeed;
      
      // Draw 4 blades instead of just 2
      ctx.fillStyle = '#444444';
      ctx.fillRect(-propellerSize / 2, -2, propellerSize, 4); // Horizontal blade
      ctx.fillRect(-2, -propellerSize / 2, 4, propellerSize); // Vertical blade
      
      // Add highlight to blades
      ctx.fillStyle = '#666666';
      ctx.fillRect(-propellerSize / 3, -1, propellerSize / 1.5, 2); // Horizontal highlight
      ctx.fillRect(-1, -propellerSize / 3, 2, propellerSize / 1.5); // Vertical highlight
      
      // Add propeller center
      ctx.fillStyle = '#888888';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // Draw jetpack fire effects (extracted from original drawJax)
    const drawJetpackFire = (x: number, y: number, imageWidth: number, imageHeight: number) => {
      if (Math.random() > 0.3) {
        // Random flickering jet flames
        const flameColors = ['#FFCC00', '#FF9900', '#FF6600', '#FF3300']; // Yellow to red gradient
        
        // Calculate boot positions based on image dimensions
        // Assuming boots are at the bottom of the image, positioned like the original pixel art
        const leftBootX = x + imageWidth * 0.25; // Left boot at 25% of image width
        const rightBootX = x + imageWidth * 0.75; // Right boot at 75% of image width
        const bootY = y + imageHeight; // At the bottom of the image
        
        // Left boot jet
        for (let i = 0; i < 3; i++) {
          const flameSize = Math.random() * 6 + 6;
          const flameX = leftBootX;
          const flameY = bootY + i * 5;
          const colorIndex = Math.floor(Math.random() * flameColors.length);
          
          ctx.fillStyle = flameColors[colorIndex];
          ctx.beginPath();
          ctx.moveTo(flameX, flameY);
          ctx.lineTo(flameX - flameSize / 2, flameY + flameSize);
          ctx.lineTo(flameX + flameSize / 2, flameY + flameSize);
          ctx.closePath();
          ctx.fill();
        }
        
        // Right boot jet
        for (let i = 0; i < 3; i++) {
          const flameSize = Math.random() * 6 + 6;
          const flameX = rightBootX;
          const flameY = bootY + i * 5;
          const colorIndex = Math.floor(Math.random() * flameColors.length);
          
          ctx.fillStyle = flameColors[colorIndex];
          ctx.beginPath();
          ctx.moveTo(flameX, flameY);
          ctx.lineTo(flameX - flameSize / 2, flameY + flameSize);
          ctx.lineTo(flameX + flameSize / 2, flameY + flameSize);
          ctx.closePath();
          ctx.fill();
        }
      }
    };

    const drawJax = (x: number, y: number, flying: boolean = false) => {
      // Only draw if image is loaded
      if (!imageLoaded || !jaxImageRef.current) {
        // Fallback: draw a simple placeholder using reasonable dimensions
        const placeholderWidth = 48 * jax.scale;
        const placeholderHeight = 142 * jax.scale;
        ctx.fillStyle = '#003399';
        ctx.fillRect(x, y, placeholderWidth, placeholderHeight);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.fillText('Loading...', x + 10, y + placeholderHeight / 2);
        return;
      }

      const img = jaxImageRef.current;
      
      // Calculate dimensions using natural image size and scale factor
      const scaledWidth = img.naturalWidth * jax.scale;
      const scaledHeight = img.naturalHeight * jax.scale;
      
      // Draw the static JAX image with proper aspect ratio
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      // Add propeller animation when flying
      if (flying) {
        drawPropeller(x, y);
        drawJetpackFire(x, y, scaledWidth, scaledHeight);
      }
    };
    
    const drawStars = (count: number) => {
      // Use a seeded pseudo-random generator for consistent star placement
      function mulberry32(a: number) {
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
      }
      const rand = mulberry32(12345); // Fixed seed for repeatability
      for (let i = 0; i < count; i++) {
        // Random positions across the whole canvas
        const x = rand() * canvas.width;
        const y = rand() * canvas.height;
        const size = rand() < 0.92 ? 1 : (rand() < 0.98 ? 2 : 3);
        // Twinkle effect
        const alpha = 0.5 + Math.sin(frameCount * 0.05 + i) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    
    const drawRetrowaveGrid = () => {
      // Background - deep blue/purple gradient for depth
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#070016'); // Even darker at top
      bgGradient.addColorStop(0.6, '#0F0024'); // Dark purple in middle
      bgGradient.addColorStop(1, '#1A0030'); // Slightly lighter purple at bottom
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add stars to the background first
      drawStarsForRetrowave(500); // Even more stars for denser field
      
      // Position horizon exactly halfway up the sun
      const horizonY = canvas.height * 0.68;
      
      // Sun - half circle on the horizon line (slightly larger)
      const sunRadius = canvas.width * 0.25; // Sun takes up 50% of width
      const sunCenterX = canvas.width / 2;
      const sunCenterY = horizonY;
      
      // Sun gradient (yellow to orange to red) - more vibrant
      const sunGradient = ctx.createLinearGradient(
        sunCenterX, 
        sunCenterY - sunRadius, 
        sunCenterX, 
        sunCenterY + sunRadius * 0.1 // Extend slightly below horizon
      );
      sunGradient.addColorStop(0, '#FFFF00'); // Bright yellow at top
      sunGradient.addColorStop(0.3, '#FFBD40'); // Orange in upper middle
      sunGradient.addColorStop(0.6, '#FF5500'); // Darker orange in lower middle
      sunGradient.addColorStop(1, '#FF0000'); // Brighter red at bottom
      
      // Draw the sun (half circle)
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunCenterY, sunRadius, Math.PI, 0, false);
      ctx.fill();
      
      // Add subtle glow around sun
      const glowGradient = ctx.createRadialGradient(
        sunCenterX, sunCenterY - sunRadius * 0.3, sunRadius * 0.5,
        sunCenterX, sunCenterY - sunRadius * 0.3, sunRadius * 1.4
      );
      glowGradient.addColorStop(0, 'rgba(255, 150, 50, 0.3)');
      glowGradient.addColorStop(0.6, 'rgba(255, 100, 30, 0.1)');
      glowGradient.addColorStop(1, 'rgba(255, 50, 30, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunCenterY - sunRadius * 0.1, sunRadius * 1.2, Math.PI, 0, false);
      ctx.fill();
      
      // Grid with perspective - precisely matching reference
      // Draw grid lines with slight transparency for better visual effect
      ctx.globalAlpha = 0.9;
      
      // First the horizon line
      ctx.strokeStyle = '#FF00FF'; // Bright magenta for grid lines
      ctx.lineWidth = 1.5; // Thinner lines for finer grid
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(canvas.width, horizonY);
      ctx.stroke();
      
      // Vertical grid lines - perpendicular to horizon
      const verticalLineCount = 40; // More lines for an ultra-fine grid
      
      for (let i = 0; i <= verticalLineCount; i++) {
        const progress = i / verticalLineCount;
        const x = progress * canvas.width;
        
        // Calculate ending point with perspective - lines converge toward sun center
        const distFromCenter = x - sunCenterX;
        const targetX = sunCenterX + distFromCenter * 3; // Stronger perspective effect to match reference
        
        ctx.beginPath();
        ctx.moveTo(x, horizonY);
        ctx.lineTo(targetX, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines - perfect perspective matching reference
      const horizontalLineCount = 20; // More lines for finer grid
      
      for (let i = 1; i <= horizontalLineCount; i++) {
        // Non-linear progression for closer spacing near horizon (matching reference exactly)
        const progress = Math.pow(i / horizontalLineCount, 1.1);
        const y = horizonY + (canvas.height - horizonY) * progress;
        
        // Perspective calculation like in the reference
        const perspectiveRatio = Math.pow(progress, 1.3) * 0.9;
        const leftX = sunCenterX - (sunCenterX * (1 - perspectiveRatio));
        const rightX = sunCenterX + ((canvas.width - sunCenterX) * (1 - perspectiveRatio));
        
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.stroke();
      }
      
      // Text on the sun - always show in final scene
      // Make the text much bigger and reduce line spacing, and move it up higher
      ctx.font = `bold ${Math.floor(sunRadius * 0.22)}px 'VT323', monospace`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      // Move both lines up higher in the sun
      ctx.fillText("COMMAND YOUR FUTURE.", sunCenterX, sunCenterY - sunRadius * 0.32);
      ctx.fillText("NAVIGATE WITH POWER.", sunCenterX, sunCenterY - sunRadius * 0.10);
      
      // Reset opacity
      ctx.globalAlpha = 1;
    };
    
    // Special star drawing function for retrowave scene
    const drawStarsForRetrowave = (count: number) => {
      // Use pseudo-random distribution but fixed pattern
      const starSeed = 12345; // Fixed seed for consistent pattern
      
      for (let i = 0; i < count; i++) {
        // Generate positions with better distribution
        const angle = i * 0.61803 + starSeed; // Golden ratio for better distribution
        const radius = Math.sqrt((i % 149) / 149) * canvas.width * 0.9; // Square root for better radial distribution
        const x = (Math.sin(angle) * radius + canvas.width / 2) % canvas.width;
        const y = (Math.cos(angle) * radius + canvas.height / 4) % (canvas.height * 0.7);
        
        // More varied star sizes, mostly tiny
        const sizeRand = (i * 17) % 100;
        const size = sizeRand < 92 ? 0.8 : (sizeRand < 98 ? 1.5 : 2.5);
        
        // Vary star brightness and add twinkling effect
        const brightness = 0.4 + (i % 67) / 67 * 0.6;
        const twinkleSpeed = 0.01 + (i % 31) / 31 * 0.02;
        const twinkleAmount = 0.3 + (i % 19) / 19 * 0.2;
        ctx.globalAlpha = brightness * (0.7 + Math.sin(frameCount * twinkleSpeed + i * 0.1) * twinkleAmount);
        
        // Draw star as a small dot/pixel
        ctx.fillStyle = 'white';
        if (size <= 1) {
          // For tiny stars, just draw a pixel
          ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
        } else {
          // For larger stars, draw a small circle
          ctx.beginPath();
          ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Occasionally draw a larger, brighter star with glow
        if (i % 51 === 0) {
          ctx.save();
          ctx.globalAlpha = 0.7 + Math.sin(frameCount * 0.02 + i) * 0.3;
          
          // Star glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size * 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Star center
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }
      
      // Reset opacity
      ctx.globalAlpha = 1;
    };
    
    // Helper: Draw neon pixel-art symbol
    const drawNeonSymbol = (symbol: string, x: number, y: number, color: string, size: number = 24) => {
      ctx.save();
      ctx.font = `bold ${size}px 'VT323', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.92;
      ctx.fillText(symbol, x, y);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    // Exaggerated pixel-art waves for confusion scene
    const drawExaggeratedWaves = () => {
      // Large, blocky, exaggerated pixel waves
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.strokeStyle = i % 2 === 0 ? '#00FFF0' : '#FF00FF'; // Neon cyan/magenta
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        const amplitude = 18 - i * 3;
        const frequency = 0.018 + i * 0.008;
        const phase = frameCount * (0.04 - i * 0.008);
        for (let x = 0; x < canvas.width; x += 8) {
          const y = waterLevel + 12 + i * 18 + Math.round(Math.sin(x * frequency + phase) * amplitude);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    };

    // Floating symbols for confusion/complexity/hype
    const floatingSymbols = [
      { symbol: '?', color: '#00FFF0' },
      { symbol: '?', color: '#FF00FF' },
      { symbol: '$', color: '#FFFF00' },
      { symbol: '{', color: '#FF00FF' },
      { symbol: '}', color: '#00FFF0' },
      { symbol: '$', color: '#FF00FF' },
      { symbol: '?', color: '#FFFF00' },
      { symbol: '{', color: '#FFFF00' },
      { symbol: '}', color: '#FF00FF' },
    ];
    
    // Animation function
    const animate = () => {
      // Skip animation if not playing
      if (!isPlaying) return;
      
      // Clear canvas
      ctx.fillStyle = black;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate JAX dimensions dynamically
      let jaxWidth = 48 * jax.scale; // fallback dimensions
      let jaxHeight = 142 * jax.scale;
      
      if (imageLoaded && jaxImageRef.current) {
        jaxWidth = jaxImageRef.current.naturalWidth * jax.scale;
        jaxHeight = jaxImageRef.current.naturalHeight * jax.scale;
      }
      
      // Update scene index
      if (frameCount - sceneStartFrame >= scenes[currentSceneIndex].duration) {
        sceneStartFrame = frameCount;
        currentSceneIndex++;
        
        if (currentSceneIndex >= scenes.length) {
          currentSceneIndex = scenes.length - 1; // Stay on last scene
        }
        
        setCurrentScene(currentSceneIndex);
      }
      
      // Draw current scene
      const sceneName = scenes[currentSceneIndex].name;
      const sceneProgress = (frameCount - sceneStartFrame) / scenes[currentSceneIndex].duration;
      
      // Update JAX position based on scene (base position)
      let baseX, baseY;
      
      if (sceneName === "finalScene") {
        // Position JAX in the final retrowave grid scene
        baseX = canvas.width / 2 - jaxWidth / 2;
        baseY = canvas.height * 0.38 - jaxHeight / 2 + Math.cos(frameCount * 0.02) * 10;
        jax.flying = true;
      } else {
        // Default position
        baseX = canvas.width / 2 - jaxWidth / 2;
        baseY = canvas.height / 2;
        jax.flying = true;
      }

      // Apply user control offset to the base position
      jax.x = baseX + userOffsetRef.current.x;
      jax.y = baseY + userOffsetRef.current.y;

      // Keep JAX within canvas bounds
      jax.x = Math.max(0, Math.min(canvas.width - jaxWidth, jax.x));
      jax.y = Math.max(0, Math.min(canvas.height - jaxHeight, jax.y));
      
      // Render scenes
      if (sceneName === "finalScene") {
        // Final retrowave grid scene with text and controllable JAX
        drawRetrowaveGrid();
        drawJax(jax.x, jax.y, true);
      }
      
      // Handle fade out effect if needed
      if (fadeOut) {
        fadeOutOpacity += 0.02;
        if (fadeOutOpacity > 1) fadeOutOpacity = 1;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeOutOpacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      frameCount++;
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      // Stop animation if component unmounts
      setIsPlaying(false);
    };
  }, [isPlaying, imageLoaded]);
  
  return (
    <div className="jax-animation-container relative">
      <canvas 
        ref={canvasRef} 
        className="pixel-display"
        style={{ 
          width: '100%',
          height: '100%',
          backgroundColor: '#000022',
          imageRendering: 'pixelated',
        }} 
      />
      

      
      <style jsx>{`
      `}</style>
    </div>
  );
};

export default JaxAdventure; 