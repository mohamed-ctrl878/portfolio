import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapConfig';
import { useBreakpoint, useIsMobile, useIsTablet, TYPOGRAPHY } from '../utils/responsive';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  
  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const progress = progressRef.current;
    const counter = counterRef.current;

    if (!container || !logo || !progress || !counter) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 500);
      }
    });

    // Initial setup
    gsap.set(container, { opacity: 1 });
    gsap.set(logo, { scale: 0.5, opacity: 0, rotationY: 180 });
    gsap.set(progress, { scaleX: 0 });

    // Animate logo entrance
    tl.to(logo, {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    })
    
    // Animate progress bar
    .to(progress, {
      scaleX: 1,
      duration: 2,
      ease: 'power2.out'
    }, '-=0.5')
    
    // Animate counter
    .to({ value: 0 }, {
      value: 100,
      duration: 2,
      ease: 'power2.out',
      onUpdate: function() {
        if (counter) {
          counter.textContent = Math.round(this.targets()[0].value).toString();
        }
      }
    }, '-=2')

    // Logo pulse effect
    .to(logo, {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }, '-=0.5')

    // Exit animation
    .to([logo, progress, counter], {
      opacity: 0,
      y: -50,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.in'
    }, '+=0.3')
    
    .to(container, {
      scaleY: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      transformOrigin: 'top'
    }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #000000 0%, #1a1a2e 100%)
        `
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(isMobile ? 4 : 8)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1'} bg-blue-400 rounded-full animate-pulse`}
            style={{
              left: `${20 + (i * (isMobile ? 15 : 10))}%`,
              top: `${30 + (i * (isMobile ? 8 : 5))}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `2s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <div ref={logoRef} className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
          <h1 className={`${isMobile ? 'text-4xl' : isTablet ? 'text-6xl' : 'text-6xl md:text-8xl'} font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent ${isMobile ? 'mb-2' : 'mb-4'}`}>
            M
          </h1>
          <div className={`${isMobile ? 'w-12 h-0.5' : 'w-20 h-1'} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto`}></div>
        </div>

        {/* Loading text */}
        <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
          <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-300 ${isMobile ? 'mb-1' : 'mb-2'}`}>Loading Portfolio</p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {isMobile ? 'Preparing experiences...' : 'Preparing amazing experiences...'}
          </p>
        </div>

        {/* Progress bar */}
        <div className={`${isMobile ? 'w-48 h-0.5' : 'w-64 h-1'} bg-gray-800 rounded-full mx-auto ${isMobile ? 'mb-3' : 'mb-4'} overflow-hidden`}>
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform origin-left scale-x-0"
          ></div>
        </div>

        {/* Counter */}
        <div className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-400`}>
          <span ref={counterRef}>0</span>%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;