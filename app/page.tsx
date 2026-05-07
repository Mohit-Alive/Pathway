'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const mouse = { x: 0, y: 0, isActive: false };

    // Canvas setup
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };
    
    const handleMouseOut = () => {
      mouse.isActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      angle: number;
      distance: number;
      color: string;
      size: number;
      speed: number;

      constructor(x: number, y: number, color: string, distance: number, angle: number) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.distance = distance;
        this.size = Math.random() * 2 + 1.5;
        this.speed = Math.random() * 0.005 + 0.001;
      }

      update() {
        // Orbit slowly
        this.angle -= this.speed;
        
        // Calculate base position (circular)
        let targetX = (canvas!.width / 2) + Math.cos(this.angle) * this.distance;
        let targetY = (canvas!.height / 2) + Math.sin(this.angle) * this.distance;

        // Mouse interaction - "Antigravity" effect
        if (mouse.isActive) {
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200; // Reaction range

          if (dist < maxDist) {
            // Push particles away
            const force = (maxDist - dist) / maxDist;
            targetX -= (dx / dist) * force * 120;
            targetY -= (dy / dist) * force * 120;
          }
        }

        // Ease to target
        this.x += (targetX - this.x) * 0.05;
        this.y += (targetY - this.y) * 0.05;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.color;
        
        // Direction to center
        const cx = canvas!.width / 2;
        const cy = canvas!.height / 2;
        const dirAngle = Math.atan2(this.y - cy, this.x - cx);
        
        const lineLen = 14;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(dirAngle) * lineLen, this.y + Math.sin(dirAngle) * lineLen);
        ctx.stroke();
      }
    }

    const init = () => {
      particles = [];
      const numParticles = 400; // Dense particle field
      const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#eab308', '#f97316', '#ef4444', '#10b981'];
      
      for (let i = 0; i < numParticles; i++) {
        const radius = Math.random() * (Math.min(canvas.width, canvas.height) / 2) + 50;
        const angle = Math.random() * Math.PI * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const px = (canvas.width / 2) + Math.cos(angle) * radius;
        const py = (canvas.height / 2) + Math.sin(angle) * radius;
        
        particles.push(new Particle(px, py, color, radius, angle));
      }
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center font-sans">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-80 pointer-events-none"
      />
      
      <div className="relative z-10 text-center max-w-4xl px-6">
        <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
          Pathway<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-medium mb-12 max-w-2xl mx-auto leading-relaxed bg-white/50 backdrop-blur-sm p-4 rounded-2xl inline-block">
          Create personalized, dynamic roadmaps that adapt to your pace. Master new skills faster than ever.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
          <Link href="/onboarding">
            <button className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <button className="cursor-pointer bg-white/80 hover:bg-slate-50 backdrop-blur-md text-slate-900 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold shadow-sm transition-all flex items-center gap-3 w-full sm:w-auto justify-center">
            View Demo
          </button>
        </div>
      </div>
    </div>
  );
}
