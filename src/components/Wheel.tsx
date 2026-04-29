import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface FoodSpot {
  name: string;
  color: string;
}

const FOOD_SPOTS: FoodSpot[] = [
  { name: 'Jaja', color: '#ff4b2b' },
  { name: 'New Hall Amala', color: '#ff9068' },
  { name: 'Korede Spaghetti', color: '#ffbd39' },
  { name: 'Faculty of Arts', color: '#8e2de2' },
  { name: '*Cook Indomie', color: '#4facfe' },
];

interface WheelProps {
  onResult: (name: string) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

export default function Wheel({ onResult, isSpinning, setIsSpinning }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  
  const FRICTION = 0.992;
  const STOP_THRESHOLD = 0.001;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      const sliceAngle = (2 * Math.PI) / FOOD_SPOTS.length;

      FOOD_SPOTS.forEach((spot, i) => {
        const startAngle = i * sliceAngle + rotation;
        const endAngle = (i + 1) * sliceAngle + rotation;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = spot.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Inter, system-ui, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(spot.name, radius - 20, 10);
        ctx.restore();
      });

      // Draw center peg
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw pointer (Arrow at the top)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius - 25);
      ctx.lineTo(centerX - 15, centerY - radius - 5);
      ctx.lineTo(centerX + 15, centerY - radius - 5);
      ctx.closePath();
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();
    };

    draw();
  }, [rotation]);

  useEffect(() => {
    if (!isSpinning || velocity <= 0) return;

    let rafId: number;
    const update = () => {
      setRotation((prev) => prev + velocity);
      const nextVel = velocity * FRICTION;
      
      if (nextVel < STOP_THRESHOLD) {
        setVelocity(0);
        setIsSpinning(false);
        
        // Calculate result
        // The pointer is at -90 degrees (top)
        // rotation is cumulative offset
        const totalRotationNormalized = (rotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const sliceAngle = (2 * Math.PI) / FOOD_SPOTS.length;
        
        // Pointer at 1.5 * Math.PI (270 deg or -90 deg) relative to 0
        // We need to find which i satisfies: (i * sliceAngle + rotation) < 1.5 * Math.PI < ((i+1) * sliceAngle + rotation)
        // Actually, simpler: index = Math.floor(((1.5 * Math.PI - rotation) % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI) / sliceAngle)
        const pointerAngle = 1.5 * Math.PI;
        const relativeAngle = (pointerAngle - rotation) % (2 * Math.PI);
        const index = Math.floor(((relativeAngle + 2 * Math.PI) % (2 * Math.PI)) / sliceAngle);
        
        const winner = FOOD_SPOTS[index];
        onResult(winner.name);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [winner.color, '#ffffff']
        });
      } else {
        setVelocity(nextVel);
        rafId = requestAnimationFrame(update);
      }
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isSpinning, velocity]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Initial velocity between 0.15 and 0.25 (roughly speed)
    setVelocity(0.2 + Math.random() * 0.15);
  };

  return (
    <div className="relative flex flex-col items-center gap-8">
      <div className="relative p-4 bg-white rounded-full shadow-2xl border-8 border-gray-100">
        <canvas 
          ref={canvasRef} 
          width={450} 
          height={450} 
          className="max-w-full h-auto rounded-full"
        />
      </div>
      
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`
          px-12 py-4 text-2xl font-black uppercase tracking-widest text-white rounded-full
          transition-all duration-300 transform active:scale-95
          ${isSpinning 
            ? 'bg-gray-400 cursor-not-allowed opacity-50' 
            : 'bg-[#1a1a1a] hover:bg-[#333] hover:shadow-xl hover:-translate-y-1'
          }
        `}
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </button>
    </div>
  );
}
