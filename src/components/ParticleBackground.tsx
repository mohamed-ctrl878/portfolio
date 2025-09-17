import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapConfig';
import { useIsMobile, useIsTablet } from '../utils/responsive';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  element: HTMLDivElement;
}

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Responsive particle count for performance
    const particleCount = isMobile ? 12 : isTablet ? 20 : 35;
    const particles: Particle[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle absolute rounded-full pointer-events-none';
      particle.style.background = `linear-gradient(45deg, 
        rgba(59, 130, 246, ${Math.random() * (isMobile ? 0.3 : 0.5) + 0.1}), 
        rgba(147, 51, 234, ${Math.random() * (isMobile ? 0.3 : 0.5) + 0.1})
      )`;
      
      const size = Math.random() * (isMobile ? 4 : 6) + (isMobile ? 1 : 2);
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const opacity = Math.random() * (isMobile ? 0.4 : 0.6) + 0.2;
      const speed = Math.random() * 0.5 + 0.1;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = opacity.toString();

      container.appendChild(particle);

      const particleData: Particle = {
        x,
        y,
        size,
        opacity,
        speed,
        element: particle
      };

      particles.push(particleData);

      // Animate particle floating (reduced on mobile)
      if (!isMobile) {
        gsap.to(particle, {
          y: y - Math.random() * 100 - 50,
          x: x + Math.random() * 60 - 30,
          duration: Math.random() * 10 + 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 5
        });
      }

      // Animate opacity pulsing (simpler on mobile)
      gsap.to(particle, {
        opacity: opacity * (isMobile ? 0.5 : 0.3),
        duration: Math.random() * (isMobile ? 4 : 3) + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3
      });

      // Animate rotation (slower on mobile for performance)
      if (!isMobile) {
        gsap.to(particle, {
          rotation: 360,
          duration: Math.random() * 30 + 15,
          repeat: -1,
          ease: "none"
        });
      }
    }

    particlesRef.current = particles;

    // Mouse interaction (disabled on mobile for performance)
    let mouseX = 0;
    let mouseY = 0;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;

    if (!isMobile) {
      handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        particles.forEach((particle, index) => {
          const distance = Math.sqrt(
            Math.pow(mouseX - particle.x, 2) + Math.pow(mouseY - particle.y, 2)
          );

          if (distance < 150) {
            const force = (150 - distance) / 150;
            const angle = Math.atan2(mouseY - particle.y, mouseX - particle.x);
            
            gsap.to(particle.element, {
              x: particle.x - Math.cos(angle) * force * 50,
              y: particle.y - Math.sin(angle) * force * 50,
              duration: 0.3,
              ease: "power2.out"
            });
          } else {
            gsap.to(particle.element, {
              x: particle.x,
              y: particle.y,
              duration: 0.5,
              ease: "power2.out"
            });
          }
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup
    return () => {
      if (handleMouseMove) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      particles.forEach(particle => {
        gsap.killTweensOf(particle.element);
        particle.element.remove();
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ 
        background: 'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
      }}
    />
  );
};

export default ParticleBackground;