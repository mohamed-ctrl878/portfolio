import React, { useState, useEffect } from "react";
import { initSmoothScroll } from "./utils/gsapConfig";
import { initPerformanceMonitoring } from "./utils/performance";
import { PerformanceProfiler } from "./utils/performanceProfiler";
import { PerformanceTestSuite } from "./tests/performance.test";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/NavBar";
import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
// Use performance optimized components (same visuals)
import ContactSection from "./components/ContactSection";
import "./App.css";
import ProjectSection from "./components/ProjectSection";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize smooth scrolling and performance monitoring
    initSmoothScroll();
    initPerformanceMonitoring();

    // Make profiler and test suite available in development
    if (import.meta.env.DEV) {
      (window as any).performanceProfiler = PerformanceProfiler.getInstance();
      (window as any).performanceTest = new PerformanceTestSuite();
      console.log("🎯 Performance tools ready!");
      console.log("  • Profiler: performanceProfiler.runFullAudit()");
      console.log("  • Test: performanceTest.runAutomatedTest()");
    }

    // Simulate loading time for initial assets
    const minLoadingTime = 1500; // 1.5 seconds minimum

    const startTime = Date.now();

    const handleLoadingComplete = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    // Start loading completion after a short delay
    setTimeout(handleLoadingComplete, 500);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <ErrorBoundary>
      <Analytics />
      <div className="relative min-h-screen text-white bg-black overflow-x-hidden">
        {/* Global Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="relative">
          {/* Hero Section with ID for navigation */}
          <div id="home">
            <Hero />
          </div>

          {/* About Section */}
          <About />

          {/* Tech Stack Section */}
          <TechStack />

          {/* Projects Section */}
          <ProjectSection />
          {/* Contact Section */}
          <ContactSection />
        </main>

        {/* Page Transition Overlay */}
        <div
          className="page-transition fixed inset-0 bg-black z-50 origin-bottom scale-y-0"
          style={{ pointerEvents: "none" }}
        ></div>
      </div>
    </ErrorBoundary>
  );
}
