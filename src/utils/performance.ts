// Performance monitoring and optimization utilities

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private animationFrameId: number = 0;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private isMonitoring: boolean = false;

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.measureFPS();
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private measureFPS(): void {
    if (!this.isMonitoring) return;

    this.animationFrameId = requestAnimationFrame((currentTime) => {
      this.frameCount++;
      
      if (currentTime - this.lastFrameTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
        
        // Log performance if FPS is low
        if (this.fps < 30) {
          console.warn(`Low FPS detected: ${this.fps} FPS`);
        }
      }
      
      this.measureFPS();
    });
  }

  public getCurrentFPS(): number {
    return this.fps;
  }

  public isPerformanceGood(): boolean {
    return this.fps >= 60;
  }
}

// Device capability detection
export const DeviceCapabilities = {
  // Check if device supports hardware acceleration
  hasHardwareAcceleration(): boolean {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  },

  // Check if device is mobile
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Check if device is low-end
  isLowEndDevice(): boolean {
    // Check for hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 1;
    
    // Check for device memory (if available)
    const memory = (navigator as any).deviceMemory || 1;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return cores <= 2 || memory <= 2 || prefersReducedMotion;
  },

  // Check network connection
  hasSlowConnection(): boolean {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (!connection) return false;
    
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' || 
           connection.saveData === true;
  }
};

// Animation optimization based on device capabilities
export const OptimizedAnimationConfig = {
  getConfig() {
    const isLowEnd = DeviceCapabilities.isLowEndDevice();
    const isMobile = DeviceCapabilities.isMobile();
    const hasSlowConnection = DeviceCapabilities.hasSlowConnection();

    return {
      // Reduce particle count on low-end devices
      particleCount: isLowEnd ? 20 : isMobile ? 30 : 50,
      
      // Simplify animations on low-end devices
      complexAnimations: !isLowEnd && !hasSlowConnection,
      
      // Reduce animation duration on slow connections
      animationDuration: hasSlowConnection ? 0.5 : 1,
      
      // Disable heavy effects on low-end devices
      enableParallax: !isLowEnd,
      enableParticles: !isLowEnd || !isMobile,
      enableBlur: !isLowEnd,
      
      // Frame rate target
      targetFPS: isLowEnd ? 30 : 60,
      
      // Use transform3d for hardware acceleration
      use3D: DeviceCapabilities.hasHardwareAcceleration(),
      
      // Stagger delays
      staggerDelay: isLowEnd ? 0.05 : 0.1
    };
  }
};

// Memory management for animations
export class AnimationMemoryManager {
  private static activeAnimations: Set<any> = new Set();
  private static cleanupInterval: number;

  public static addAnimation(animation: any): void {
    this.activeAnimations.add(animation);
  }

  public static removeAnimation(animation: any): void {
    this.activeAnimations.delete(animation);
  }

  public static startCleanup(): void {
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup();
    }, 30000); // Clean up every 30 seconds
  }

  public static stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  private static cleanup(): void {
    // Force garbage collection if available (Chrome DevTools)
    if ((window as any).gc) {
      (window as any).gc();
    }

    // Clean up completed animations
    this.activeAnimations.forEach(animation => {
      if (animation && typeof animation.kill === 'function' && animation.progress() === 1) {
        animation.kill();
        this.activeAnimations.delete(animation);
      }
    });

    console.log(`Active animations: ${this.activeAnimations.size}`);
  }

  public static getActiveCount(): number {
    return this.activeAnimations.size;
  }
}

// Performance-aware scroll throttling
export const createPerformanceAwareScrollHandler = (
  callback: (event: Event) => void,
  threshold: number = 16 // ~60fps
) => {
  let lastCall = 0;
  let timeoutId: number;

  return (event: Event) => {
    const now = performance.now();
    
    if (now - lastCall >= threshold) {
      lastCall = now;
      callback(event);
    } else {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(event);
        lastCall = performance.now();
      }, threshold);
    }
  };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (import.meta.env.DEV) {
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring();
    
    // Log device capabilities
    console.log('Device Capabilities:', {
      isLowEnd: DeviceCapabilities.isLowEndDevice(),
      isMobile: DeviceCapabilities.isMobile(),
      hasHardwareAcceleration: DeviceCapabilities.hasHardwareAcceleration(),
      hasSlowConnection: DeviceCapabilities.hasSlowConnection(),
      optimizedConfig: OptimizedAnimationConfig.getConfig()
    });
    
    // Start memory management
    AnimationMemoryManager.startCleanup();
  }
};