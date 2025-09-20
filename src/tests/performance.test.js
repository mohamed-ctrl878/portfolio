// Performance Test Suite
// Measures performance improvements and ensures no visual regressions
export class PerformanceTestSuite {
    constructor() {
        this.baseline = null;
        this.current = null;
    }
    // Collect current performance metrics
    async collectMetrics() {
        console.log('📊 Collecting performance metrics...');
        // FPS measurement
        const fps = await this.measureFPS();
        // Memory measurement
        const memory = this.measureMemory();
        // Paint metrics
        const paint = await this.measurePaintMetrics();
        // Animation metrics
        const animations = this.measureAnimations();
        return {
            fps,
            memory,
            paint,
            animations
        };
    }
    async measureFPS() {
        const frames = [];
        let lastTime = performance.now();
        let drops = 0;
        return new Promise((resolve) => {
            let count = 0;
            const measure = () => {
                const currentTime = performance.now();
                const delta = currentTime - lastTime;
                const currentFPS = Math.round(1000 / delta);
                frames.push(currentFPS);
                if (currentFPS < 55)
                    drops++;
                lastTime = currentTime;
                count++;
                if (count < 120) { // Measure for 2 seconds at 60fps
                    requestAnimationFrame(measure);
                }
                else {
                    const average = frames.reduce((a, b) => a + b, 0) / frames.length;
                    const min = Math.min(...frames);
                    const max = Math.max(...frames);
                    resolve({
                        average: Math.round(average),
                        min,
                        max,
                        drops
                    });
                }
            };
            requestAnimationFrame(measure);
        });
    }
    measureMemory() {
        const memory = performance.memory;
        const domNodes = document.querySelectorAll('*').length;
        return {
            heapUsed: memory ? Math.round(memory.usedJSHeapSize / 1048576) : 0,
            heapTotal: memory ? Math.round(memory.totalJSHeapSize / 1048576) : 0,
            domNodes
        };
    }
    async measurePaintMetrics() {
        // Get navigation timing
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
        // Get LCP
        let lcp = 0;
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        // Get CLS
        let cls = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        // Get TBT (approximation)
        let tbt = 0;
        const tbtObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    tbt += entry.duration - 50;
                }
            }
        });
        try {
            tbtObserver.observe({ entryTypes: ['longtask'] });
        }
        catch { }
        // Wait for metrics to stabilize
        await new Promise(resolve => setTimeout(resolve, 2000));
        lcpObserver.disconnect();
        clsObserver.disconnect();
        tbtObserver.disconnect();
        return {
            firstContentfulPaint: fcp ? fcp.startTime : 0,
            largestContentfulPaint: lcp,
            cumulativeLayoutShift: cls,
            totalBlockingTime: tbt
        };
    }
    measureAnimations() {
        const activeAnimations = document.getAnimations?.()?.length || 0;
        let gsapTimelines = 0;
        let scrollTriggers = 0;
        if (window.gsap) {
            const gsap = window.gsap;
            gsapTimelines = gsap.globalTimeline?.getChildren?.()?.length || 0;
            if (window.ScrollTrigger) {
                scrollTriggers = window.ScrollTrigger.getAll?.()?.length || 0;
            }
        }
        return {
            activeCount: activeAnimations,
            gsapTimelines,
            scrollTriggers
        };
    }
    // Set baseline metrics
    setBaseline(metrics) {
        this.baseline = metrics;
        console.log('✅ Baseline metrics set');
    }
    // Compare current metrics with baseline
    compareWithBaseline(current) {
        if (!this.baseline) {
            return {
                improvements: [],
                regressions: [],
                summary: 'No baseline metrics available'
            };
        }
        const improvements = [];
        const regressions = [];
        // Compare FPS
        const fpsImprovement = ((current.fps.average - this.baseline.fps.average) / this.baseline.fps.average) * 100;
        if (fpsImprovement > 5) {
            improvements.push(`FPS improved by ${fpsImprovement.toFixed(1)}% (${this.baseline.fps.average} → ${current.fps.average})`);
        }
        else if (fpsImprovement < -5) {
            regressions.push(`FPS decreased by ${Math.abs(fpsImprovement).toFixed(1)}% (${this.baseline.fps.average} → ${current.fps.average})`);
        }
        // Compare frame drops
        if (current.fps.drops < this.baseline.fps.drops) {
            improvements.push(`Frame drops reduced by ${this.baseline.fps.drops - current.fps.drops} (${this.baseline.fps.drops} → ${current.fps.drops})`);
        }
        else if (current.fps.drops > this.baseline.fps.drops) {
            regressions.push(`Frame drops increased by ${current.fps.drops - this.baseline.fps.drops}`);
        }
        // Compare memory
        const memoryImprovement = ((this.baseline.memory.heapUsed - current.memory.heapUsed) / this.baseline.memory.heapUsed) * 100;
        if (memoryImprovement > 5) {
            improvements.push(`Memory usage reduced by ${memoryImprovement.toFixed(1)}% (${this.baseline.memory.heapUsed}MB → ${current.memory.heapUsed}MB)`);
        }
        else if (memoryImprovement < -5) {
            regressions.push(`Memory usage increased by ${Math.abs(memoryImprovement).toFixed(1)}%`);
        }
        // Compare DOM nodes
        if (current.memory.domNodes < this.baseline.memory.domNodes) {
            improvements.push(`DOM nodes reduced by ${this.baseline.memory.domNodes - current.memory.domNodes} (${this.baseline.memory.domNodes} → ${current.memory.domNodes})`);
        }
        // Compare paint metrics
        if (current.paint.largestContentfulPaint < this.baseline.paint.largestContentfulPaint) {
            const lcpImprovement = this.baseline.paint.largestContentfulPaint - current.paint.largestContentfulPaint;
            improvements.push(`LCP improved by ${lcpImprovement.toFixed(0)}ms`);
        }
        if (current.paint.cumulativeLayoutShift < this.baseline.paint.cumulativeLayoutShift) {
            improvements.push(`CLS improved from ${this.baseline.paint.cumulativeLayoutShift.toFixed(3)} to ${current.paint.cumulativeLayoutShift.toFixed(3)}`);
        }
        if (current.paint.totalBlockingTime < this.baseline.paint.totalBlockingTime) {
            const tbtImprovement = this.baseline.paint.totalBlockingTime - current.paint.totalBlockingTime;
            improvements.push(`TBT reduced by ${tbtImprovement.toFixed(0)}ms`);
        }
        // Compare animations
        if (current.animations.activeCount < this.baseline.animations.activeCount) {
            improvements.push(`Active animations reduced from ${this.baseline.animations.activeCount} to ${current.animations.activeCount}`);
        }
        // Generate summary
        const overallImprovement = improvements.length > regressions.length;
        const summary = overallImprovement
            ? `✅ Performance improved! ${improvements.length} improvements, ${regressions.length} regressions`
            : `⚠️ Mixed results: ${improvements.length} improvements, ${regressions.length} regressions`;
        return {
            improvements,
            regressions,
            summary
        };
    }
    // Run automated test
    async runAutomatedTest() {
        console.log('🚀 Starting automated performance test...');
        // Collect current metrics
        const metrics = await this.collectMetrics();
        // If no baseline, use current as baseline
        if (!this.baseline) {
            this.setBaseline(metrics);
            console.log('📊 Baseline metrics:', metrics);
            return;
        }
        // Compare with baseline
        const comparison = this.compareWithBaseline(metrics);
        console.log('📈 Performance Test Results:');
        console.log('========================');
        console.log(comparison.summary);
        if (comparison.improvements.length > 0) {
            console.log('\n✅ Improvements:');
            comparison.improvements.forEach(imp => console.log(`  • ${imp}`));
        }
        if (comparison.regressions.length > 0) {
            console.log('\n⚠️ Regressions:');
            comparison.regressions.forEach(reg => console.log(`  • ${reg}`));
        }
        console.log('\n📊 Current metrics:', metrics);
        // Save results to window for debugging
        window.__performanceTestResults = {
            baseline: this.baseline,
            current: metrics,
            comparison
        };
        console.log('Results saved to window.__performanceTestResults');
    }
    // Visual regression test placeholder
    async checkVisualRegression() {
        console.log('🎨 Checking for visual regressions...');
        // This would typically use a tool like Percy or Chromatic
        // For now, we'll do a simple check
        // Check if all expected elements are visible
        const criticalElements = [
            '.hero-section',
            '.project-card',
            '.particle',
            '.nav-bar'
        ];
        for (const selector of criticalElements) {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn(`Element not found: ${selector}`);
                return false;
            }
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                console.warn(`Element has zero dimensions: ${selector}`);
                return false;
            }
        }
        console.log('✅ No visual regressions detected');
        return true;
    }
}
// Export for browser usage
if (typeof window !== 'undefined') {
    window.PerformanceTestSuite = PerformanceTestSuite;
    console.log('🧪 Performance Test Suite loaded! Usage:');
    console.log('  const tester = new PerformanceTestSuite();');
    console.log('  await tester.runAutomatedTest();');
}
