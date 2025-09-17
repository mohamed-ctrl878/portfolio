// Performance Profiler for detailed browser-based analysis
// Run this in the browser console to collect performance metrics

export interface PerformanceProfile {
  timestamp: string;
  scrollMetrics: ScrollMetrics;
  renderMetrics: RenderMetrics;
  memoryMetrics: MemoryMetrics;
  domMetrics: DOMMetrics;
  reactMetrics: ReactMetrics;
  animationMetrics: AnimationMetrics;
  issues: PerformanceIssue[];
}

export interface ScrollMetrics {
  fps: number[];
  jank: number;
  smoothness: number;
  paintCount: number;
  layoutCount: number;
  compositeCount: number;
}

export interface RenderMetrics {
  paintTimes: { name: string; time: number }[];
  layoutShifts: { value: number; time: number }[];
  longTasks: { duration: number; time: number }[];
  renderBlocking: number;
}

export interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  domNodes: number;
  eventListeners: number;
  detachedNodes: number;
}

export interface DOMMetrics {
  totalNodes: number;
  deepestNesting: number;
  inlineStyles: number;
  largeStyleSheets: number;
  totalStyleRules: number;
}

export interface ReactMetrics {
  componentCount: number;
  renderCount: Map<string, number>;
  slowComponents: string[];
  unnecessaryRenders: string[];
}

export interface AnimationMetrics {
  activeAnimations: number;
  gsapTimelines: number;
  scrollTriggers: number;
  willChangeElements: number;
  transformElements: number;
}

export interface PerformanceIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  impact: string;
  recommendation: string;
}

export class PerformanceProfiler {
  private static instance: PerformanceProfiler;
  private frameTimings: number[] = [];
  private paintObserver?: PerformanceObserver;
  private layoutObserver?: PerformanceObserver;
  private startTime: number = 0;

  public static getInstance(): PerformanceProfiler {
    if (!PerformanceProfiler.instance) {
      PerformanceProfiler.instance = new PerformanceProfiler();
    }
    return PerformanceProfiler.instance;
  }

  public async runFullAudit(): Promise<PerformanceProfile> {
    console.log('🔍 Starting comprehensive performance audit...');
    this.startTime = performance.now();

    // Collect all metrics
    const [
      scrollMetrics,
      renderMetrics,
      memoryMetrics,
      domMetrics,
      reactMetrics,
      animationMetrics
    ] = await Promise.all([
      this.measureScrollPerformance(),
      this.measureRenderPerformance(),
      this.measureMemoryUsage(),
      this.analyzeDOMComplexity(),
      this.analyzeReactComponents(),
      this.analyzeAnimations()
    ]);

    // Identify issues
    const issues = this.identifyPerformanceIssues({
      scrollMetrics,
      renderMetrics,
      memoryMetrics,
      domMetrics,
      reactMetrics,
      animationMetrics
    });

    const profile: PerformanceProfile = {
      timestamp: new Date().toISOString(),
      scrollMetrics,
      renderMetrics,
      memoryMetrics,
      domMetrics,
      reactMetrics,
      animationMetrics,
      issues
    };

    console.log('✅ Performance audit complete!');
    console.log(profile);

    // Save to window for easy access
    (window as any).__performanceProfile = profile;
    console.log('Profile saved to window.__performanceProfile');

    return profile;
  }

  private async measureScrollPerformance(): Promise<ScrollMetrics> {
    console.log('📊 Measuring scroll performance...');

    const fps: number[] = [];
    let paintCount = 0;
    let layoutCount = 0;
    let lastFrameTime = performance.now();
    let jankCount = 0;

    // Monitor FPS during scroll
    const measureFrame = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      const currentFPS = Math.round(1000 / deltaTime);

      fps.push(currentFPS);

      if (deltaTime > 16.67) { // Frame took longer than 60fps threshold
        jankCount++;
      }

      lastFrameTime = currentTime;
    };

    // Set up performance observer
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') paintCount++;
        if (entry.entryType === 'layout') layoutCount++;
      }
    });

    observer.observe({ entryTypes: ['paint', 'layout', 'measure'] });

    // Simulate scroll
    const scrollHeight = document.body.scrollHeight;
    const steps = 20;
    const stepSize = scrollHeight / steps;

    for (let i = 0; i < steps; i++) {
      window.scrollTo(0, i * stepSize);
      measureFrame();
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Scroll back to top
    window.scrollTo(0, 0);

    observer.disconnect();

    const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;
    const smoothness = 1 - (jankCount / fps.length);

    return {
      fps,
      jank: jankCount,
      smoothness: smoothness * 100,
      paintCount,
      layoutCount,
      compositeCount: paintCount // Approximation
    };
  }

  private async measureRenderPerformance(): Promise<RenderMetrics> {
    console.log('🎨 Measuring render performance...');

    const paintTimes: { name: string; time: number }[] = [];
    const layoutShifts: { value: number; time: number }[] = [];
    const longTasks: { duration: number; time: number }[] = [];

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      paintTimes.push({
        name: entry.name,
        time: entry.startTime
      });
    });

    // Monitor layout shifts and long tasks
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          layoutShifts.push({
            value: (entry as any).value,
            time: entry.startTime
          });
        }
        if (entry.entryType === 'longtask') {
          longTasks.push({
            duration: entry.duration,
            time: entry.startTime
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift', 'longtask'] });

      // Wait to collect some data
      await new Promise(resolve => setTimeout(resolve, 2000));

      observer.disconnect();
    } catch (e) {
      console.warn('Some performance metrics not available:', e);
    }

    // Count render-blocking resources
    const renderBlocking = Array.from(document.querySelectorAll('link[rel="stylesheet"], script:not([async]):not([defer])')).length;

    return {
      paintTimes,
      layoutShifts,
      longTasks,
      renderBlocking
    };
  }

  private measureMemoryUsage(): MemoryMetrics {
    console.log('💾 Measuring memory usage...');

    const memory = (performance as any).memory;
    const heapUsed = memory ? memory.usedJSHeapSize : 0;
    const heapTotal = memory ? memory.totalJSHeapSize : 0;

    // Count DOM nodes
    const domNodes = document.querySelectorAll('*').length;

    // Estimate event listeners (this is an approximation)
    let eventListeners = 0;
    const allElements = document.querySelectorAll('*');

    // Common event types to check
    const eventTypes = ['click', 'scroll', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'focus', 'blur'];

    allElements.forEach(element => {
      eventTypes.forEach(type => {
        // This is a heuristic - we can't directly count listeners without Chrome DevTools
        if (element.getAttribute(`on${type}`)) {
          eventListeners++;
        }
      });
    });

    // Try to detect detached nodes (approximation)
    const detachedNodes = 0; // This requires Chrome DevTools Protocol

    return {
      heapUsed: Math.round(heapUsed / 1048576), // Convert to MB
      heapTotal: Math.round(heapTotal / 1048576), // Convert to MB
      domNodes,
      eventListeners,
      detachedNodes
    };
  }

  private analyzeDOMComplexity(): DOMMetrics {
    console.log('🌳 Analyzing DOM complexity...');

    const allElements = document.querySelectorAll('*');
    let deepestNesting = 0;
    let inlineStyles = 0;

    allElements.forEach(element => {
      // Check nesting depth
      let depth = 0;
      let current = element;
      while (current.parentElement) {
        depth++;
        current = current.parentElement;
      }
      deepestNesting = Math.max(deepestNesting, depth);

      // Count inline styles
      if (element.getAttribute('style')) {
        inlineStyles++;
      }
    });

    // Count stylesheets and rules
    const styleSheets = Array.from(document.styleSheets);
    const largeStyleSheets = styleSheets.filter(sheet => {
      try {
        return sheet.cssRules && sheet.cssRules.length > 1000;
      } catch {
        return false;
      }
    }).length;

    let totalStyleRules = 0;
    styleSheets.forEach(sheet => {
      try {
        totalStyleRules += sheet.cssRules ? sheet.cssRules.length : 0;
      } catch {
        // Cross-origin stylesheets will throw
      }
    });

    return {
      totalNodes: allElements.length,
      deepestNesting,
      inlineStyles,
      largeStyleSheets,
      totalStyleRules
    };
  }

  private analyzeReactComponents(): ReactMetrics {
    console.log('⚛️ Analyzing React components...');

    // Try to access React DevTools global hook
    const reactDevTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    let componentCount = 0;
    const renderCount = new Map<string, number>();
    const slowComponents: string[] = [];
    const unnecessaryRenders: string[] = [];

    if (reactDevTools && reactDevTools.renderers && reactDevTools.renderers.size > 0) {
      // React DevTools is available
      try {
        const renderer = reactDevTools.renderers.values().next().value;
        const fiber = renderer?.getCurrentFiber?.();

        if (fiber) {
          // Traverse fiber tree
          const traverseFiber = (node: any) => {
            if (!node) return;

            componentCount++;

            const name = node.type?.name || node.type?.displayName || 'Anonymous';

            // Track render counts (this is an approximation)
            if (node.memoizedProps) {
              const count = renderCount.get(name) || 0;
              renderCount.set(name, count + 1);

              if (count > 5) {
                unnecessaryRenders.push(name);
              }
            }

            // Check for slow components (heuristic based on depth)
            if (node.treeBaseDuration > 16) {
              slowComponents.push(name);
            }

            if (node.child) traverseFiber(node.child);
            if (node.sibling) traverseFiber(node.sibling);
          };

          traverseFiber(fiber);
        }
      } catch (e) {
        console.warn('Could not analyze React components:', e);
      }
    }

    // Fallback: count components by className
    if (componentCount === 0) {
      componentCount = document.querySelectorAll('[class*="Component"], [class*="component"]').length;
    }

    return {
      componentCount,
      renderCount,
      slowComponents,
      unnecessaryRenders
    };
  }

  private analyzeAnimations(): AnimationMetrics {
    console.log('🎬 Analyzing animations...');

    // Count GSAP animations
    let gsapTimelines = 0;
    let scrollTriggers = 0;

    if ((window as any).gsap) {
      const gsap = (window as any).gsap;
      gsapTimelines = gsap.globalTimeline?.getChildren?.()?.length || 0;

      if ((window as any).ScrollTrigger) {
        scrollTriggers = (window as any).ScrollTrigger.getAll?.()?.length || 0;
      }
    }

    // Count will-change elements
    const willChangeElements = document.querySelectorAll('[style*="will-change"]').length;

    // Count transform elements
    const transformElements = document.querySelectorAll('[style*="transform"]').length;

    // Get active animations
    const activeAnimations = document.getAnimations?.()?.length || 0;

    return {
      activeAnimations,
      gsapTimelines,
      scrollTriggers,
      willChangeElements,
      transformElements
    };
  }

  private identifyPerformanceIssues(metrics: Omit<PerformanceProfile, 'timestamp' | 'issues'>): PerformanceIssue[] {
    console.log('🔍 Identifying performance issues...');

    const issues: PerformanceIssue[] = [];

    // Check FPS issues
    const avgFPS = metrics.scrollMetrics.fps.reduce((a, b) => a + b, 0) / metrics.scrollMetrics.fps.length;
    if (avgFPS < 30) {
      issues.push({
        severity: 'critical',
        category: 'Scrolling Performance',
        description: `Average FPS during scroll is ${avgFPS.toFixed(1)}, which is below 30 FPS`,
        impact: 'Users experience janky, stuttering scroll',
        recommendation: 'Reduce paint complexity, optimize animations, and minimize layout recalculations'
      });
    } else if (avgFPS < 50) {
      issues.push({
        severity: 'high',
        category: 'Scrolling Performance',
        description: `Average FPS during scroll is ${avgFPS.toFixed(1)}, which is below optimal 60 FPS`,
        impact: 'Scrolling may feel less smooth',
        recommendation: 'Optimize scroll event handlers and reduce paint operations'
      });
    }

    // Check DOM complexity
    if (metrics.domMetrics.totalNodes > 1500) {
      issues.push({
        severity: 'high',
        category: 'DOM Complexity',
        description: `DOM has ${metrics.domMetrics.totalNodes} nodes, exceeding recommended 1500`,
        impact: 'Increased memory usage and slower DOM operations',
        recommendation: 'Implement virtual scrolling for lists, lazy-load off-screen content'
      });
    }

    // Check memory usage
    if (metrics.memoryMetrics.heapUsed > 50) {
      issues.push({
        severity: 'medium',
        category: 'Memory Usage',
        description: `JavaScript heap is using ${metrics.memoryMetrics.heapUsed}MB`,
        impact: 'Higher memory consumption may cause performance issues on low-end devices',
        recommendation: 'Remove memory leaks, clean up event listeners, and optimize data structures'
      });
    }

    // Check layout shifts
    const totalLayoutShift = metrics.renderMetrics.layoutShifts.reduce((sum, shift) => sum + shift.value, 0);
    if (totalLayoutShift > 0.1) {
      issues.push({
        severity: 'high',
        category: 'Layout Stability',
        description: `Cumulative Layout Shift is ${totalLayoutShift.toFixed(3)}, exceeding good threshold of 0.1`,
        impact: 'Content jumps around as the page loads, causing poor user experience',
        recommendation: 'Set explicit dimensions for images/videos, avoid inserting content above existing content'
      });
    }

    // Check long tasks
    if (metrics.renderMetrics.longTasks.length > 0) {
      const longestTask = Math.max(...metrics.renderMetrics.longTasks.map(t => t.duration));
      issues.push({
        severity: longestTask > 100 ? 'high' : 'medium',
        category: 'JavaScript Execution',
        description: `${metrics.renderMetrics.longTasks.length} long tasks detected, longest: ${longestTask.toFixed(0)}ms`,
        impact: 'Main thread blocked, causing unresponsive UI',
        recommendation: 'Break up long tasks, use requestIdleCallback for non-critical work'
      });
    }

    // Check inline styles
    if (metrics.domMetrics.inlineStyles > 100) {
      issues.push({
        severity: 'medium',
        category: 'Style Performance',
        description: `${metrics.domMetrics.inlineStyles} elements have inline styles`,
        impact: 'Harder to cache styles, more frequent style recalculations',
        recommendation: 'Move inline styles to CSS classes, use CSS-in-JS solutions efficiently'
      });
    }

    // Check React performance
    if (metrics.reactMetrics.unnecessaryRenders.length > 0) {
      issues.push({
        severity: 'high',
        category: 'React Performance',
        description: `${metrics.reactMetrics.unnecessaryRenders.length} components are re-rendering excessively`,
        impact: 'Wasted CPU cycles on unnecessary virtual DOM diffs',
        recommendation: `Implement React.memo, useCallback, and useMemo for these components: ${metrics.reactMetrics.unnecessaryRenders.slice(0, 3).join(', ')}`
      });
    }

    // Check animation performance
    if (metrics.animationMetrics.scrollTriggers > 10) {
      issues.push({
        severity: 'medium',
        category: 'Animation Performance',
        description: `${metrics.animationMetrics.scrollTriggers} ScrollTrigger instances active`,
        impact: 'Multiple scroll listeners may cause performance issues',
        recommendation: 'Consolidate scroll triggers, use batch processing for scroll events'
      });
    }

    if (metrics.animationMetrics.willChangeElements > 10) {
      issues.push({
        severity: 'low',
        category: 'CSS Performance',
        description: `${metrics.animationMetrics.willChangeElements} elements using will-change`,
        impact: 'Excessive will-change usage increases memory consumption',
        recommendation: 'Only use will-change during actual animations, remove when animation completes'
      });
    }

    // Sort issues by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return issues;
  }

  public exportProfile(): string {
    const profile = (window as any).__performanceProfile;
    if (!profile) {
      console.error('No performance profile found. Run audit first.');
      return '';
    }

    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-profile-${Date.now()}.json`;
    a.click();

    return 'Profile exported successfully';
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).PerformanceProfiler = PerformanceProfiler;
  console.log('🚀 PerformanceProfiler loaded! Run: new PerformanceProfiler().runFullAudit()');
}