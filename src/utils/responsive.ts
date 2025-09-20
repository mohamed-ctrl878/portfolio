import { useState, useEffect } from 'react';

// Responsive utilities and breakpoint management

export const BREAKPOINTS = {
  xs: 320,   // Extra small devices (phones)
  sm: 640,   // Small devices (landscape phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (desktops)
  xl: 1280,  // Extra large devices
  '2xl': 1536 // Ultra wide screens
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// Hook to detect current breakpoint
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    handleResize(); // Set initial breakpoint
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

// Utility function to check if screen is mobile
export const useIsMobile = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'xs' || breakpoint === 'sm';
};

// Utility function to check if screen is tablet
export const useIsTablet = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'md';
};

// Utility function to check if screen is desktop
export const useIsDesktop = () => {
  const breakpoint = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
};

// Responsive value calculator
export const getResponsiveValue = <T>(
  values: Record<BreakpointKey, T>,
  currentBreakpoint: BreakpointKey
): T => {
  // Return the value for current breakpoint or fallback to smaller ones
  const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  // Fallback to the first available value
  return values[breakpointOrder.find(bp => values[bp] !== undefined) || 'lg'];
};

// Responsive spacing system
export const SPACING = {
  xs: {
    section: 'py-8 px-4',
    container: 'px-4 max-w-sm mx-auto',
    gap: 'gap-2',
    margin: 'mb-4'
  },
  sm: {
    section: 'py-12 px-6',
    container: 'px-6 max-w-md mx-auto',
    gap: 'gap-4',
    margin: 'mb-6'
  },
  md: {
    section: 'py-16 px-6',
    container: 'px-6 max-w-2xl mx-auto',
    gap: 'gap-6',
    margin: 'mb-8'
  },
  lg: {
    section: 'py-20 px-6',
    container: 'px-6 max-w-4xl mx-auto',
    gap: 'gap-8',
    margin: 'mb-12'
  },
  xl: {
    section: 'py-24 px-6',
    container: 'px-6 max-w-6xl mx-auto',
    gap: 'gap-10',
    margin: 'mb-16'
  },
  '2xl': {
    section: 'py-32 px-8',
    container: 'px-8 max-w-7xl mx-auto',
    gap: 'gap-12',
    margin: 'mb-20'
  }
} as const;

// Responsive typography scale
export const TYPOGRAPHY = {
  xs: {
    hero: 'text-3xl font-bold',
    h1: 'text-2xl font-bold',
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-medium',
    heading: 'text-lg font-bold',
    subheading: 'text-base font-semibold',
    caption: 'text-xs',
    body: 'text-base',
    small: 'text-sm'
  },
  sm: {
    hero: 'text-4xl font-bold',
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-medium',
    heading: 'text-xl font-bold',
    subheading: 'text-lg font-semibold',
    caption: 'text-sm',
    body: 'text-base',
    small: 'text-sm'
  },
  md: {
    hero: 'text-5xl font-bold',
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    heading: 'text-2xl font-bold',
    subheading: 'text-xl font-semibold',
    caption: 'text-base',
    body: 'text-lg',
    small: 'text-base'
  },
  lg: {
    hero: 'text-6xl font-bold',
    h1: 'text-5xl font-bold',
    h2: 'text-4xl font-semibold',
    h3: 'text-3xl font-medium',
    heading: 'text-3xl font-bold',
    subheading: 'text-2xl font-semibold',
    caption: 'text-lg',
    body: 'text-xl',
    small: 'text-lg'
  },
  xl: {
    hero: 'text-7xl font-bold',
    h1: 'text-6xl font-bold',
    h2: 'text-5xl font-semibold',
    h3: 'text-4xl font-medium',
    heading: 'text-4xl font-bold',
    subheading: 'text-3xl font-semibold',
    caption: 'text-xl',
    body: 'text-xl',
    small: 'text-lg'
  },
  '2xl': {
    hero: 'text-8xl font-bold',
    h1: 'text-7xl font-bold',
    h2: 'text-6xl font-semibold',
    h3: 'text-5xl font-medium',
    heading: 'text-5xl font-bold',
    subheading: 'text-4xl font-semibold',
    caption: 'text-2xl',
    body: 'text-2xl',
    small: 'text-xl'
  }
} as const;

// Responsive animation configs
export const ANIMATION_CONFIG = {
  xs: {
    duration: { fast: 0.2, normal: 0.3, slow: 0.5 },
    stagger: 0.05,
    scale: { hover: 1.02, active: 0.98 }
  },
  sm: {
    duration: { fast: 0.2, normal: 0.3, slow: 0.5 },
    stagger: 0.05,
    scale: { hover: 1.02, active: 0.98 }
  },
  md: {
    duration: { fast: 0.3, normal: 0.4, slow: 0.6 },
    stagger: 0.08,
    scale: { hover: 1.05, active: 0.95 }
  },
  lg: {
    duration: { fast: 0.3, normal: 0.5, slow: 0.8 },
    stagger: 0.1,
    scale: { hover: 1.1, active: 0.9 }
  },
  xl: {
    duration: { fast: 0.4, normal: 0.6, slow: 1 },
    stagger: 0.12,
    scale: { hover: 1.15, active: 0.85 }
  },
  '2xl': {
    duration: { fast: 0.4, normal: 0.6, slow: 1 },
    stagger: 0.15,
    scale: { hover: 1.2, active: 0.8 }
  }
} as const;

// Helper to get responsive classes
export const getResponsiveClasses = (
  type: 'spacing' | 'typography',
  element: string,
  breakpoint: BreakpointKey
) => {
  if (type === 'spacing') {
    return SPACING[breakpoint][element as keyof typeof SPACING[BreakpointKey]] || '';
  }
  if (type === 'typography') {
    return TYPOGRAPHY[breakpoint][element as keyof typeof TYPOGRAPHY[BreakpointKey]] || '';
  }
  return '';
};
