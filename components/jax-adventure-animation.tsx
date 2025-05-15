import React, { useEffect, useRef, useState } from 'react';

const JaxAdventure = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  
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
    
    // Scene timing (in frames)
    const scenes = [
      { name: "intro", duration: 180 }, // Black screen
      { name: "oceanText1", duration: 360 }, // First text appears
      { name: "oceanJourney", duration: 360 }, // JAX moves through ocean
      { name: "oceanText2", duration: 360 }, // Second text appears
      { name: "explosionScene", duration: 180 }, // Explosion scene
      { name: "oceanObstacles", duration: 360 }, // JAX encounters obstacles
      { name: "oceanText3", duration: 360 }, // Third text appears
      { name: "spaceTransition", duration: 360 }, // Ocean transforms to space
      { name: "spaceJourney", duration: 360 }, // JAX navigates space
      { name: "spaceText", duration: 360 }, // Space text appears
      { name: "gridTransition", duration: 360 }, // Space transforms to grid
      { name: "gridJourney", duration: 360 }, // JAX reaches destination
      { name: "finalText", duration: 360 }, // Final text appears
      { name: "startButton", duration: Infinity } // Press start button
    ];
    
    // JAX character properties
    let jax = {
      x: -50,
      y: canvas.height / 2,
      width: 48 * 1.5, // 50% larger
      height: 142 * 1.5, // 50% larger
      speed: 1,
      bobAmount: 10,
      bobSpeed: 0.03,
      flying: false,
      flyHeight: 0,
      flySpeed: 0.02,
      flyDirection: 1, // 1 for up, -1 for down
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
      
      // Draw JAX sitting in the boat (simplified version)
      // Position JAX in boat center
      const jaxBoatX = -30; // relative to boat center
      const jaxBoatY = -boat.height/2 - 55; // sitting on boat
      const jaxScale = 1.5; // Scale factor to make JAX bigger
      
      // Only draw upper body parts
      
      // Ears
      ctx.fillStyle = '#FFA755'; // Skin tone
      ctx.fillRect(jaxBoatX + 6 * jaxScale, jaxBoatY + 18 * jaxScale, 4 * jaxScale, 10 * jaxScale); // Left ear
      ctx.fillRect(jaxBoatX + 38 * jaxScale, jaxBoatY + 18 * jaxScale, 4 * jaxScale, 10 * jaxScale); // Right ear
      
      // Face
      ctx.fillStyle = '#FFA755'; // Skin tone
      ctx.fillRect(jaxBoatX + 10 * jaxScale, jaxBoatY + 10 * jaxScale, 28 * jaxScale, 30 * jaxScale); // Face
      
      // Navy blue hat
      ctx.fillStyle = '#003399';
      ctx.fillRect(jaxBoatX + 8 * jaxScale, jaxBoatY, 32 * jaxScale, 12 * jaxScale); // Hat base
      ctx.fillRect(jaxBoatX + 6 * jaxScale, jaxBoatY - 10 * jaxScale, 36 * jaxScale, 10 * jaxScale); // Hat top
      
      // Gold trim on hat
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(jaxBoatX + 8 * jaxScale, jaxBoatY, 32 * jaxScale, 2 * jaxScale); // Hat trim
      
      // JAX logo on hat
      ctx.fillStyle = '#FFCC00';
      // J shape
      ctx.fillRect(jaxBoatX + 19 * jaxScale, jaxBoatY - 8 * jaxScale, 4 * jaxScale, 6 * jaxScale); // Vertical part
      ctx.fillRect(jaxBoatX + 15 * jaxScale, jaxBoatY - 4 * jaxScale, 4 * jaxScale, 2 * jaxScale); // Bottom part
      
      // A shape
      ctx.fillRect(jaxBoatX + 23 * jaxScale, jaxBoatY - 8 * jaxScale, 2 * jaxScale, 6 * jaxScale); // Left leg
      ctx.fillRect(jaxBoatX + 27 * jaxScale, jaxBoatY - 8 * jaxScale, 2 * jaxScale, 6 * jaxScale); // Right leg
      ctx.fillRect(jaxBoatX + 23 * jaxScale, jaxBoatY - 4 * jaxScale, 6 * jaxScale, 2 * jaxScale); // Middle connector
      
      // X shape (simplified for pixel art)
      ctx.fillRect(jaxBoatX + 29 * jaxScale, jaxBoatY - 8 * jaxScale, 2 * jaxScale, 2 * jaxScale); // Top left of X
      ctx.fillRect(jaxBoatX + 33 * jaxScale, jaxBoatY - 8 * jaxScale, 2 * jaxScale, 2 * jaxScale); // Top right of X
      ctx.fillRect(jaxBoatX + 31 * jaxScale, jaxBoatY - 6 * jaxScale, 2 * jaxScale, 2 * jaxScale); // Center of X
      ctx.fillRect(jaxBoatX + 29 * jaxScale, jaxBoatY - 4 * jaxScale, 2 * jaxScale, 2 * jaxScale); // Bottom left of X
      ctx.fillRect(jaxBoatX + 33 * jaxScale, jaxBoatY - 4 * jaxScale, 2 * jaxScale, 2 * jaxScale); // Bottom right of X
      
      // Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(jaxBoatX + 16 * jaxScale, jaxBoatY + 20 * jaxScale, 6 * jaxScale, 6 * jaxScale); // Left eye
      
      // Cyber eye (right eye)
      ctx.fillStyle = '#003366'; // Dark blue base
      ctx.fillRect(jaxBoatX + 26 * jaxScale, jaxBoatY + 20 * jaxScale, 8 * jaxScale, 8 * jaxScale); // Cyber eye base
      
      // Add more detail to cyber eye
      ctx.fillStyle = '#001133'; // Darker blue for shadow
      ctx.fillRect(jaxBoatX + 26 * jaxScale, jaxBoatY + 20 * jaxScale, 2 * jaxScale, 8 * jaxScale); // Left edge
      ctx.fillRect(jaxBoatX + 26 * jaxScale, jaxBoatY + 20 * jaxScale, 8 * jaxScale, 2 * jaxScale); // Top edge
      
      ctx.fillStyle = '#FFCC00'; // Gold center
      ctx.fillRect(jaxBoatX + 28 * jaxScale, jaxBoatY + 22 * jaxScale, 4 * jaxScale, 4 * jaxScale); // Cyber eye glow
      
      // Highlight in cyber eye
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(jaxBoatX + 28 * jaxScale, jaxBoatY + 22 * jaxScale, 2 * jaxScale, 2 * jaxScale); // Small highlight
      
      // Mouth/smile
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(jaxBoatX + 16 * jaxScale, jaxBoatY + 30 * jaxScale, 16 * jaxScale, 4 * jaxScale); // Smile
      
      // Teeth details
      ctx.fillStyle = '#000022';
      ctx.fillRect(jaxBoatX + 19 * jaxScale, jaxBoatY + 30 * jaxScale, 2 * jaxScale, 1 * jaxScale); // Tooth separator
      ctx.fillRect(jaxBoatX + 23 * jaxScale, jaxBoatY + 30 * jaxScale, 2 * jaxScale, 1 * jaxScale); // Tooth separator
      ctx.fillRect(jaxBoatX + 27 * jaxScale, jaxBoatY + 30 * jaxScale, 2 * jaxScale, 1 * jaxScale); // Tooth separator
      
      // Orange beard - more dense
      ctx.fillStyle = '#FF6600';
      for (let beardY = 0; beardY < 18; beardY += 4) {
        for (let beardX = -8; beardX < 24; beardX += 4) {
          if (Math.random() > 0.1 || beardY < 8) { // More density
            ctx.fillRect(jaxBoatX + (16 + beardX) * jaxScale, jaxBoatY + (34 + beardY) * jaxScale, 4 * jaxScale, 4 * jaxScale);
          }
        }
      }
      
      // Beard highlight
      ctx.fillStyle = '#FF9933';
      for (let beardX = -4; beardX < 20; beardX += 6) {
        ctx.fillRect(jaxBoatX + (16 + beardX) * jaxScale, jaxBoatY + 34 * jaxScale, 4 * jaxScale, 4 * jaxScale);
        ctx.fillRect(jaxBoatX + (14 + beardX) * jaxScale, jaxBoatY + 38 * jaxScale, 4 * jaxScale, 4 * jaxScale); // Second row of highlights
      }
      
      // Body - Navy Blue uniform (just upper part)
      ctx.fillStyle = '#003399';
      ctx.fillRect(jaxBoatX + 8 * jaxScale, jaxBoatY + 50 * jaxScale, 32 * jaxScale, 25 * jaxScale); // Upper torso only
      
      // Red trim on uniform
      ctx.fillStyle = '#DD0000';
      ctx.fillRect(jaxBoatX + 8 * jaxScale, jaxBoatY + 50 * jaxScale, 32 * jaxScale, 2 * jaxScale); // Top trim (collar)
      ctx.fillRect(jaxBoatX + 8 * jaxScale, jaxBoatY + 50 * jaxScale, 2 * jaxScale, 25 * jaxScale); // Left trim
      ctx.fillRect(jaxBoatX + 38 * jaxScale, jaxBoatY + 50 * jaxScale, 2 * jaxScale, 25 * jaxScale); // Right trim
      
      // Center line (buttons area)
      ctx.fillStyle = '#DD0000';
      ctx.fillRect(jaxBoatX + 22 * jaxScale, jaxBoatY + 50 * jaxScale, 2 * jaxScale, 25 * jaxScale); // Center red line
      
      // Gold buttons (just top ones)
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(jaxBoatX + 26 * jaxScale, jaxBoatY + 55 * jaxScale, 4 * jaxScale, 4 * jaxScale); // Top button
      ctx.fillRect(jaxBoatX + 26 * jaxScale, jaxBoatY + 65 * jaxScale, 4 * jaxScale, 4 * jaxScale); // Middle button
      
      // Epaulettes (shoulder decorations)
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(jaxBoatX + 6 * jaxScale, jaxBoatY + 50 * jaxScale, 8 * jaxScale, 6 * jaxScale); // Left epaulette
      ctx.fillRect(jaxBoatX + 34 * jaxScale, jaxBoatY + 50 * jaxScale, 8 * jaxScale, 6 * jaxScale); // Right epaulette
      
      // Epaulette details
      ctx.fillStyle = '#FF9900'; // Darker gold for detail
      ctx.fillRect(jaxBoatX + 8 * jaxScale, jaxBoatY + 52 * jaxScale, 4 * jaxScale, 2 * jaxScale); // Left epaulette detail
      ctx.fillRect(jaxBoatX + 36 * jaxScale, jaxBoatY + 52 * jaxScale, 4 * jaxScale, 2 * jaxScale); // Right epaulette detail
      
      // Arms
      ctx.fillStyle = '#003399';
      ctx.fillRect(jaxBoatX - 2 * jaxScale, jaxBoatY + 54 * jaxScale, 8 * jaxScale, 20 * jaxScale); // Left arm
      ctx.fillRect(jaxBoatX + 42 * jaxScale, jaxBoatY + 54 * jaxScale, 8 * jaxScale, 20 * jaxScale); // Right arm
      
      // Red trim on arms
      ctx.fillStyle = '#DD0000';
      ctx.fillRect(jaxBoatX - 2 * jaxScale, jaxBoatY + 64 * jaxScale, 8 * jaxScale, 2 * jaxScale); // Left arm trim
      ctx.fillRect(jaxBoatX + 42 * jaxScale, jaxBoatY + 64 * jaxScale, 8 * jaxScale, 2 * jaxScale); // Right arm trim
      
      // Hands
      ctx.fillStyle = '#FFA755';
      ctx.fillRect(jaxBoatX - 2 * jaxScale, jaxBoatY + 74 * jaxScale, 8 * jaxScale, 8 * jaxScale); // Left hand
      ctx.fillRect(jaxBoatX + 42 * jaxScale, jaxBoatY + 74 * jaxScale, 8 * jaxScale, 8 * jaxScale); // Right hand
      
      // Handle
      ctx.fillStyle = '#663311';
      ctx.fillRect(jaxBoatX + 42 * jaxScale, jaxBoatY + 58 * jaxScale, 15 * jaxScale, 6 * jaxScale); // Boat handle
      
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
    
    const drawJax = (x: number, y: number, flying: boolean = false) => {
      // Scale factor for larger JAX
      const scale = flying ? 1.0 : 1.5; // Only apply scale in early scenes (not flying)
      
      // Ears
      ctx.fillStyle = '#FFA755'; // Skin tone
      ctx.fillRect(x + 6 * scale, y + 18 * scale, 4 * scale, 10 * scale); // Left ear
      ctx.fillRect(x + 38 * scale, y + 18 * scale, 4 * scale, 10 * scale); // Right ear
      
      // Face
      ctx.fillStyle = '#FFA755'; // Skin tone
      ctx.fillRect(x + 10 * scale, y + 10 * scale, 28 * scale, 30 * scale); // Face
      
      // Navy blue hat
      ctx.fillStyle = '#003399';
      ctx.fillRect(x + 8 * scale, y, 32 * scale, 12 * scale); // Hat base
      ctx.fillRect(x + 6 * scale, y - 10 * scale, 36 * scale, 10 * scale); // Hat top
      
      // Gold trim on hat
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(x + 8 * scale, y, 32 * scale, 2 * scale); // Hat trim
      
      // JAX logo on hat (more detailed)
      ctx.fillStyle = '#FFCC00';
      
      // Draw pixelated "JAX" emblem
      // J shape
      ctx.fillRect(x + 19 * scale, y - 8 * scale, 4 * scale, 6 * scale); // Vertical part
      ctx.fillRect(x + 15 * scale, y - 4 * scale, 4 * scale, 2 * scale); // Bottom part
      
      // A shape
      ctx.fillRect(x + 23 * scale, y - 8 * scale, 2 * scale, 6 * scale); // Left leg
      ctx.fillRect(x + 27 * scale, y - 8 * scale, 2 * scale, 6 * scale); // Right leg
      ctx.fillRect(x + 23 * scale, y - 4 * scale, 6 * scale, 2 * scale); // Middle connector
      
      // X shape (simplified for pixel art)
      ctx.fillRect(x + 29 * scale, y - 8 * scale, 2 * scale, 2 * scale); // Top left of X
      ctx.fillRect(x + 33 * scale, y - 8 * scale, 2 * scale, 2 * scale); // Top right of X
      ctx.fillRect(x + 31 * scale, y - 6 * scale, 2 * scale, 2 * scale); // Center of X
      ctx.fillRect(x + 29 * scale, y - 4 * scale, 2 * scale, 2 * scale); // Bottom left of X
      ctx.fillRect(x + 33 * scale, y - 4 * scale, 2 * scale, 2 * scale); // Bottom right of X
      
      // Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 16 * scale, y + 20 * scale, 6 * scale, 6 * scale); // Left eye
      
      // Cyber eye (right eye)
      ctx.fillStyle = '#003366'; // Dark blue base
      ctx.fillRect(x + 26 * scale, y + 20 * scale, 8 * scale, 8 * scale); // Cyber eye base
      
      // Add more detail to cyber eye
      ctx.fillStyle = '#001133'; // Darker blue for shadow
      ctx.fillRect(x + 26 * scale, y + 20 * scale, 2 * scale, 8 * scale); // Left edge
      ctx.fillRect(x + 26 * scale, y + 20 * scale, 8 * scale, 2 * scale); // Top edge
      
      ctx.fillStyle = '#FFCC00'; // Gold center
      ctx.fillRect(x + 28 * scale, y + 22 * scale, 4 * scale, 4 * scale); // Cyber eye glow
      
      // Highlight in cyber eye
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 28 * scale, y + 22 * scale, 2 * scale, 2 * scale); // Small highlight
      
      // Mouth/smile
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 16 * scale, y + 30 * scale, 16 * scale, 4 * scale); // Smile
      
      // Teeth details
      ctx.fillStyle = '#000022';
      ctx.fillRect(x + 19 * scale, y + 30 * scale, 2 * scale, 1 * scale); // Tooth separator
      ctx.fillRect(x + 23 * scale, y + 30 * scale, 2 * scale, 1 * scale); // Tooth separator
      ctx.fillRect(x + 27 * scale, y + 30 * scale, 2 * scale, 1 * scale); // Tooth separator
      
      // Orange beard - more dense and vibrant
      ctx.fillStyle = '#FF6600';
      for (let beardY = 0; beardY < 18; beardY += 4) {
        for (let beardX = -8; beardX < 24; beardX += 4) {
          if (Math.random() > 0.1 || beardY < 8) { // More density (0.1 instead of 0.2)
            ctx.fillRect(x + (16 + beardX) * scale, y + (34 + beardY) * scale, 4 * scale, 4 * scale);
          }
        }
      }
      
      // Beard highlight - more highlights for volume
      ctx.fillStyle = '#FF9933';
      for (let beardX = -4; beardX < 20; beardX += 6) { // More highlights (step 6 instead of 8)
        ctx.fillRect(x + (16 + beardX) * scale, y + 34 * scale, 4 * scale, 4 * scale);
        ctx.fillRect(x + (14 + beardX) * scale, y + 38 * scale, 4 * scale, 4 * scale); // Second row of highlights
      }
      
      // Body - Navy Blue uniform
      ctx.fillStyle = '#003399'; // Darker navy blue
      ctx.fillRect(x + 8 * scale, y + 50 * scale, 32 * scale, 50 * scale); // Torso
      
      // Red trim on uniform - thicker and more pronounced
      ctx.fillStyle = '#DD0000';
      ctx.fillRect(x + 8 * scale, y + 50 * scale, 32 * scale, 2 * scale); // Top trim (collar)
      ctx.fillRect(x + 8 * scale, y + 50 * scale, 2 * scale, 50 * scale); // Left trim
      ctx.fillRect(x + 38 * scale, y + 50 * scale, 2 * scale, 50 * scale); // Right trim
      ctx.fillRect(x + 8 * scale, y + 98 * scale, 32 * scale, 2 * scale); // Bottom trim
      
      // Center line (buttons area)
      ctx.fillStyle = '#DD0000';
      ctx.fillRect(x + 22 * scale, y + 50 * scale, 2 * scale, 50 * scale); // Center red line
      
      // Gold buttons - more buttons for detailed uniform
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(x + 26 * scale, y + 55 * scale, 4 * scale, 4 * scale); // Top button
      ctx.fillRect(x + 26 * scale, y + 65 * scale, 4 * scale, 4 * scale); // Upper middle button
      ctx.fillRect(x + 26 * scale, y + 75 * scale, 4 * scale, 4 * scale); // Lower middle button
      ctx.fillRect(x + 26 * scale, y + 85 * scale, 4 * scale, 4 * scale); // Bottom button
      
      // Epaulettes (shoulder decorations) - more detailed
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(x + 6 * scale, y + 50 * scale, 8 * scale, 6 * scale); // Left epaulette
      ctx.fillRect(x + 34 * scale, y + 50 * scale, 8 * scale, 6 * scale); // Right epaulette
      
      // Epaulette details
      ctx.fillStyle = '#FF9900'; // Darker gold for detail
      ctx.fillRect(x + 8 * scale, y + 52 * scale, 4 * scale, 2 * scale); // Left epaulette detail
      ctx.fillRect(x + 36 * scale, y + 52 * scale, 4 * scale, 2 * scale); // Right epaulette detail
      
      // Belt
      ctx.fillStyle = '#663311';
      ctx.fillRect(x + 8 * scale, y + 90 * scale, 32 * scale, 8 * scale);
      
      // Belt buckle - more detailed gold buckle
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(x + 18 * scale, y + 90 * scale, 12 * scale, 8 * scale);
      ctx.fillStyle = '#884400';
      ctx.fillRect(x + 20 * scale, y + 92 * scale, 8 * scale, 4 * scale); // Buckle detail
      
      // Legs - Navy blue
      ctx.fillStyle = '#003399';
      ctx.fillRect(x + 12 * scale, y + 98 * scale, 10 * scale, 32 * scale); // Left leg
      ctx.fillRect(x + 26 * scale, y + 98 * scale, 10 * scale, 32 * scale); // Right leg
      
      // Red trim on legs
      ctx.fillStyle = '#DD0000';
      ctx.fillRect(x + 12 * scale, y + 122 * scale, 10 * scale, 2 * scale); // Left leg trim
      ctx.fillRect(x + 26 * scale, y + 122 * scale, 10 * scale, 2 * scale); // Right leg trim
      
      // Brown boots - taller and more detailed
      ctx.fillStyle = '#663311';
      ctx.fillRect(x + 12 * scale, y + 130 * scale, 10 * scale, 12 * scale); // Left boot
      ctx.fillRect(x + 26 * scale, y + 130 * scale, 10 * scale, 12 * scale); // Right boot
      
      // Boot details
      ctx.fillStyle = '#442200';
      ctx.fillRect(x + 12 * scale, y + 136 * scale, 10 * scale, 6 * scale); // Left boot detail
      ctx.fillRect(x + 26 * scale, y + 136 * scale, 10 * scale, 6 * scale); // Right boot detail
      
      // Gold boot trim
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(x + 12 * scale, y + 130 * scale, 10 * scale, 2 * scale); // Left boot top trim
      ctx.fillRect(x + 26 * scale, y + 130 * scale, 10 * scale, 2 * scale); // Right boot top trim
      
      // Arms
      ctx.fillStyle = '#003399';
      ctx.fillRect(x * scale, y + 54 * scale, 8 * scale, 26 * scale); // Left arm
      ctx.fillRect(x + 40 * scale, y + 54 * scale, 8 * scale, 26 * scale); // Right arm
      
      // Red trim on arms
      ctx.fillStyle = '#DD0000';
      ctx.fillRect(x * scale, y + 70 * scale, 8 * scale, 2 * scale); // Left arm trim
      ctx.fillRect(x + 40 * scale, y + 70 * scale, 8 * scale, 2 * scale); // Right arm trim
      
      // Hands
      ctx.fillStyle = '#FFA755';
      ctx.fillRect(x * scale, y + 80 * scale, 8 * scale, 8 * scale); // Left hand
      ctx.fillRect(x + 40 * scale, y + 80 * scale, 8 * scale, 8 * scale); // Right hand
      
      // Propeller (when flying)
      if (flying) {
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
        
        // Flight effects - jet flames when flying
        if (Math.random() > 0.3) {
          // Random flickering jet flames
          const flameColors = ['#FFCC00', '#FF9900', '#FF6600', '#FF3300']; // Yellow to red gradient
          
          // Left boot jet
          for (let i = 0; i < 3; i++) {
            const flameSize = (Math.random() * 6 + 6) * scale;
            const flameX = x + 16 * scale;
            const flameY = y + 142 * scale + i * 5 * scale;
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
            const flameSize = (Math.random() * 6 + 6) * scale;
            const flameX = x + 32 * scale;
            const flameY = y + 142 * scale + i * 5 * scale;
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
      
      // Text on the sun (only in final scenes)
      if (currentSceneIndex >= scenes.findIndex(s => s.name === "finalText")) {
        // Make the text much bigger and reduce line spacing, and move it up higher
        ctx.font = `bold ${Math.floor(sunRadius * 0.22)}px 'VT323', monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        // Move both lines up higher in the sun
        ctx.fillText("COMMAND YOUR FUTURE.", sunCenterX, sunCenterY - sunRadius * 0.32);
        ctx.fillText("NAVIGATE WITH POWER.", sunCenterX, sunCenterY - sunRadius * 0.10);
      }
      
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
      
      // Update JAX position based on scene
      if (sceneName === "oceanJourney" || sceneName === "oceanText1") {
        jax.x = canvas.width / 3 - jax.width - 50;
        // Bobbing effect
        jax.y = canvas.height / 2 + Math.sin(frameCount * jax.bobSpeed) * jax.bobAmount;
      } else if (sceneName === "oceanObstacles" || sceneName === "oceanText2" || sceneName === "oceanText3") {
        jax.x = canvas.width / 3 - jax.width - 50;
        // More intense bobbing
        jax.y = canvas.height / 2 + Math.sin(frameCount * jax.bobSpeed * 1.5) * jax.bobAmount * 1.5;
      } else if (sceneName === "spaceTransition") {
        jax.x = canvas.width / 3 - jax.width - 50;
        // Start flying upward
        jax.flying = true;
        jax.flyHeight = sceneProgress * 100;
        jax.y = (canvas.height / 2) - jax.flyHeight;
      } else if (sceneName === "spaceJourney" || sceneName === "spaceText") {
        jax.x = canvas.width / 3 - jax.width - 50 + Math.sin(frameCount * 0.02) * 20;
        // Flying in space - floating up and down
        jax.flying = true;
        const floatAmount = Math.sin(frameCount * jax.flySpeed) * 30;
        jax.y = (canvas.height / 3) + floatAmount;
      } else if (sceneName === "gridTransition") {
        jax.x = canvas.width / 3 - jax.width - 50 + sceneProgress * 100;
        jax.y = (canvas.height / 3) + 50 * sceneProgress;
        jax.flying = true;
      } else if (sceneName === "gridJourney" || sceneName === "finalText" || sceneName === "startButton") {
        // Move JAX higher and more centered on the sun
        jax.x = canvas.width / 2 - jax.width / 2;
        jax.y = canvas.height * 0.38 - jax.height / 2 + Math.cos(frameCount * 0.02) * 10;
        jax.flying = true;
      }
      
      // Render scenes
      if (sceneName === "intro") {
        // Just black screen, nothing to draw
      } else if (sceneName === "oceanJourney" || sceneName === "oceanText1" || 
                 sceneName === "oceanText2" || sceneName === "oceanText3" || sceneName === "oceanObstacles") {
        // Ocean scene
        if (sceneName === "oceanText2") {
          // Exaggerated pixel-art waves for confusion scene
          drawWater();
          drawExaggeratedWaves();
        } else {
          drawWater();
        }
        drawBoat(boatX, boatY + Math.sin(frameCount * boat.bobSpeed) * boat.bobAmount);
        // Floating neon symbols for confusion/complexity/hype
        if (sceneName === "oceanText2" || sceneName === "oceanText3" || sceneName === "oceanObstacles") {
          // Animate floating symbols
          for (let i = 0; i < floatingSymbols.length; i++) {
            // Orbit around JAX/boat or float in water
            const angle = (frameCount * 0.015 + i * 0.7) % (Math.PI * 2);
            const radius = 90 + 30 * Math.sin(frameCount * 0.01 + i);
            let sx = boatX + boat.width / 2 + Math.cos(angle) * radius;
            let sy = boatY + boat.height / 2 + Math.sin(angle) * radius * 0.6;
            // Some symbols float in the water
            if (i % 3 === 2) {
              sx = 120 + i * 70 + Math.sin(frameCount * 0.02 + i) * 18;
              sy = waterLevel + 30 + Math.cos(frameCount * 0.03 + i) * 8;
            }
            drawNeonSymbol(floatingSymbols[i].symbol, sx, sy, floatingSymbols[i].color, 32);
          }
        }
        // Draw explosion for obstacle scene
        if (sceneName === "oceanObstacles") {
          const explosionProgress = ((frameCount - sceneStartFrame) % 60) / 60;
          if (explosionProgress < 0.5) {
            drawExplosion(
              canvas.width * 0.7, 
              waterLevel - 50, 
              30 + explosionProgress * 20, 
              explosionProgress * 30
            );
          }
        }
      } else if (sceneName === "explosionScene") {
        // Dedicated explosion scene
        drawWater();
        drawBoat(boatX, boatY + Math.sin(frameCount * boat.bobSpeed) * boat.bobAmount);
        
        const explosionSize = 50 + sceneProgress * 50;
        drawExplosion(
          canvas.width * 0.7,
          waterLevel - 100,
          explosionSize,
          sceneProgress * 30
        );
      } else if (sceneName === "spaceTransition") {
        // Mix of ocean and space
        const transitionProgress = sceneProgress;
        
        // Draw water with fading opacity
        ctx.globalAlpha = 1 - transitionProgress;
        drawWater();
        ctx.globalAlpha = 1;
        
        // Keep the confusion symbols visible during transition
        const symbolsOpacity = Math.max(0, 1 - transitionProgress * 1.5); // Fade out slowly
        ctx.globalAlpha = symbolsOpacity;
        for (let i = 0; i < floatingSymbols.length; i++) {
          // Position symbols around JAX as he flies
          const angle = (frameCount * 0.015 + i * 0.7) % (Math.PI * 2);
          const radius = 100 + 20 * Math.sin(frameCount * 0.02 + i);
          const sx = jax.x + jax.width/2 + Math.cos(angle) * radius;
          const sy = jax.y + jax.height/2 + Math.sin(angle) * radius * 0.8;
          drawNeonSymbol(floatingSymbols[i].symbol, sx, sy, floatingSymbols[i].color, 32);
        }
        ctx.globalAlpha = 1;
        
        // Draw stars with increasing opacity
        ctx.globalAlpha = transitionProgress;
        drawStars(100);
        ctx.globalAlpha = 1;
        
        // Draw JAX flying
        drawJax(jax.x, jax.y, true);
      } else if (sceneName === "spaceJourney" || sceneName === "spaceText") {
        // Space scene
        ctx.fillStyle = black;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawStars(200);
        drawJax(jax.x, jax.y, true);
      } else if (sceneName === "gridTransition") {
        // Mix of space and grid
        const transitionProgress = sceneProgress;
        
        // Draw space with fading opacity
        ctx.globalAlpha = 1 - transitionProgress;
        ctx.fillStyle = black;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStars(200);
        ctx.globalAlpha = 1;
        
        // Draw grid with increasing opacity
        ctx.globalAlpha = transitionProgress;
        drawRetrowaveGrid();
        ctx.globalAlpha = 1;
        
        // Draw JAX flying
        drawJax(jax.x, jax.y, true);
      } else if (sceneName === "gridJourney" || sceneName === "finalText" || sceneName === "startButton") {
        // Grid scene
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
  }, [isPlaying]);
  
  return (
    <div className="jax-animation-container">
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
    </div>
  );
};

export default JaxAdventure; 