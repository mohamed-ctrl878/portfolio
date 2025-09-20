import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, customEases } from '../utils/gsapConfig';
// Hook for basic GSAP animations
export const useGSAP = (callback, dependencies = []) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const context = { gsap, timeline: gsap.timeline() };
        const cleanup = callback(context);
        return () => {
            if (typeof cleanup === 'function') {
                cleanup();
            }
            context.timeline.kill();
        };
    }, dependencies);
    return ref;
};
// Hook for scroll-triggered animations
export const useScrollTrigger = (animation, options = {}) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const trigger = ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            animation: animation(element),
            toggleActions: "play none none reverse",
            ...options
        });
        return () => trigger.kill();
    }, []);
    return ref;
};
// Hook for stagger animations
export const useStagger = (selector, options = {}) => {
    const containerRef = useRef(null);
    useLayoutEffect(() => {
        if (!containerRef.current)
            return;
        const elements = containerRef.current.querySelectorAll(selector);
        if (elements.length === 0)
            return;
        const { y = 50, x = 0, opacity = 0, stagger = 0.1, duration = 0.8, ease = customEases.bounce } = options;
        gsap.set(elements, { y, x, opacity });
        const animation = gsap.to(elements, {
            y: 0,
            x: 0,
            opacity: 1,
            duration,
            stagger,
            ease
        });
        return () => {
            animation.kill();
        };
    }, [selector]);
    return containerRef;
};
// Hook for reveal animations on scroll
export const useRevealOnScroll = (options = {}) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const { y = 100, x = 0, opacity = 0, duration = 1, ease = customEases.smooth, start = "top 80%", end = "bottom 20%" } = options;
        gsap.set(element, { y, x, opacity });
        const trigger = ScrollTrigger.create({
            trigger: element,
            start,
            end,
            animation: gsap.to(element, {
                y: 0,
                x: 0,
                opacity: 1,
                duration,
                ease
            }),
            toggleActions: "play none none reverse"
        });
        return () => {
            trigger.kill();
        };
    }, []);
    return ref;
};
// Hook for parallax effects
export const useParallax = (speed = 0.5, direction = 'vertical') => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const trigger = ScrollTrigger.create({
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            animation: gsap.fromTo(element, direction === 'vertical'
                ? { y: -100 * speed }
                : { x: -100 * speed }, direction === 'vertical'
                ? { y: 100 * speed }
                : { x: 100 * speed })
        });
        return () => trigger.kill();
    }, [speed, direction]);
    return ref;
};
// Hook for magnetic hover effects
export const useMagnetic = (strength = 0.3) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        let hover = gsap.quickTo(element, "scale", { duration: 0.3, ease: customEases.smooth });
        let move = gsap.quickTo(element, "x,y", { duration: 0.6, ease: customEases.smooth });
        const handleMouseEnter = () => hover(1.1);
        const handleMouseLeave = () => {
            hover(1);
            move(0, 0);
        };
        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            move(x * strength, y * strength);
        };
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
        element.addEventListener("mousemove", handleMouseMove);
        return () => {
            element.removeEventListener("mouseenter", handleMouseEnter);
            element.removeEventListener("mouseleave", handleMouseLeave);
            element.removeEventListener("mousemove", handleMouseMove);
        };
    }, [strength]);
    return ref;
};
// Hook for typewriter effect
export const useTypewriter = (text, options = {}) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const { speed = 50, delay = 0, cursor = true } = options;
        const tl = gsap.timeline({ delay });
        if (cursor) {
            element.innerHTML = '|';
            tl.to(element, {
                duration: 0.5,
                opacity: 0,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        }
        tl.to(element, {
            duration: text.length * (speed / 1000),
            text: text,
            ease: "none",
            onComplete: () => {
                if (cursor) {
                    element.innerHTML += '|';
                }
            }
        });
        return () => {
            tl.kill();
        };
    }, [text]);
    return ref;
};
// Hook for floating animation
export const useFloating = (options = {}) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const { y = 20, duration = 3, ease = "sine.inOut", delay = 0 } = options;
        const animation = gsap.to(element, {
            y: -y,
            duration,
            ease,
            repeat: -1,
            yoyo: true,
            delay
        });
        return () => {
            animation.kill();
        };
    }, []);
    return ref;
};
