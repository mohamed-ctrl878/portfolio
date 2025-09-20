import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

// Set global GSAP defaults for performance
gsap.defaults({
  ease: "power2.out",
  duration: 1,
  force3D: true, // Force hardware acceleration
  transformOrigin: "center center"
});

// Performance optimizations
gsap.config({
  force3D: true, // Hardware acceleration
  nullTargetWarn: false, // Reduce console warnings
  autoSleep: 60, // Auto-sleep inactive timelines
});

// Set up performance-optimized refresh
if (typeof window !== 'undefined') {
  // Throttle scroll events for better performance
  let scrollTimeout: number;
  const originalScrollTriggerRefresh = ScrollTrigger.refresh;

  ScrollTrigger.refresh = function (...args) {
    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      originalScrollTriggerRefresh.apply(this, args);
    }, 100);
  };
}

// Custom easing curves
export const customEases = {
  smooth: "power2.inOut",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  expo: "expo.out"
};

// Animation utilities
export class AnimationUtils {
  // Stagger text animation
  static staggerText(selector: string, delay: number = 0.1) {
    const elements = gsap.utils.toArray(selector);

    gsap.set(elements, {
      y: 100,
      opacity: 0,
      rotationX: 90
    });

    return gsap.to(elements, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 0.8,
      stagger: delay,
      ease: customEases.bounce
    });
  }

  // Reveal on scroll animation
  static revealOnScroll(selector: string, options: any = {}) {
    const defaults = {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: customEases.smooth
    };

    const config = { ...defaults, ...options };

    gsap.set(selector, {
      y: config.y,
      opacity: config.opacity
    });

    return ScrollTrigger.create({
      trigger: selector,
      start: "top 80%",
      end: "bottom 20%",
      animation: gsap.to(selector, {
        y: 0,
        opacity: 1,
        duration: config.duration,
        ease: config.ease
      }),
      toggleActions: "play none none reverse"
    });
  }

  // Parallax effect
  static parallax(selector: string, speed: number = 0.5) {
    return ScrollTrigger.create({
      trigger: selector,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      animation: gsap.fromTo(selector,
        { y: -100 * speed },
        { y: 100 * speed }
      )
    });
  }

  // Magnetic hover effect
  static magnetic(selector: string, strength: number = 0.3) {
    const elements = gsap.utils.toArray<HTMLElement>(selector);

    elements.forEach(element => {
      let hover = gsap.quickTo(element, "scale", { duration: 0.3, ease: customEases.smooth });
      let move = gsap.quickTo(element, "x,y", { duration: 0.6, ease: customEases.smooth });

      element.addEventListener("mouseenter", () => hover(1.1));
      element.addEventListener("mouseleave", () => {
        hover(1);
        move(0, 0);
      });

      element.addEventListener("mousemove", (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        move(x * strength, y * strength);
      });
    });
  }

  // Smooth page transition
  static pageTransition(onComplete?: () => void) {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    tl.to(".page-transition", {
      scaleY: 1,
      duration: 0.5,
      ease: customEases.expo,
      transformOrigin: "bottom"
    })
      .to(".page-transition", {
        scaleY: 0,
        duration: 0.5,
        ease: customEases.expo,
        transformOrigin: "top",
        delay: 0.2
      });

    return tl;
  }

  // Loading animation
  static loadingAnimation() {
    const tl = gsap.timeline();

    tl.to(".loader-text", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: customEases.bounce
    })
      .to(".loader-progress", {
        width: "100%",
        duration: 2,
        ease: customEases.smooth
      }, "-=0.3")
      .to(".loader", {
        opacity: 0,
        y: -100,
        duration: 0.8,
        ease: customEases.expo
      }, "+=0.5");

    return tl;
  }
}

// Smooth scrolling setup
export const initSmoothScroll = () => {
  gsap.registerPlugin(ScrollTrigger);

  // Refresh ScrollTrigger on window resize
  ScrollTrigger.addEventListener("refresh", () => {
    ScrollTrigger.refresh();
  });

  // Update ScrollTrigger on route changes
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });
};

export { gsap, ScrollTrigger };
