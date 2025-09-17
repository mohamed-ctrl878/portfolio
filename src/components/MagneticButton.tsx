import React, { useRef, useEffect } from 'react';
import { gsap } from '../utils/gsapConfig';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  href, 
  onClick, 
  className = '', 
  strength = 1 
}) => {
  const buttonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength * 0.3;
      const deltaY = (e.clientY - centerY) * strength * 0.3;

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    } else if (href) {
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const Component = href && !href.startsWith('#') ? 'a' : 'button';

  return (
    <Component
      ref={buttonRef as any}
      href={href && !href.startsWith('#') ? href : undefined}
      target={href && !href.startsWith('#') ? '_blank' : undefined}
      rel={href && !href.startsWith('#') ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={`inline-block cursor-pointer ${className}`}
    >
      {children}
    </Component>
  );
};

export default MagneticButton;