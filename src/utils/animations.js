import { gsap, ScrollTrigger } from './gsapConfig';
// Simple animation utilities that don't require React hooks
export const AnimationHelpers = {
    // Fade in animation
    fadeIn(element, delay = 0) {
        return gsap.fromTo(element, { opacity: 0, y: 30 }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: 'power2.out'
        });
    },
    // Stagger animation for multiple elements
    staggerIn(elements, stagger = 0.1) {
        return gsap.fromTo(elements, { opacity: 0, y: 50 }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger,
            ease: 'back.out(1.7)'
        });
    },
    // Scale animation on hover
    addHoverScale(element, scale = 1.05) {
        const onEnter = () => gsap.to(element, { scale, duration: 0.3 });
        const onLeave = () => gsap.to(element, { scale: 1, duration: 0.3 });
        element.addEventListener('mouseenter', onEnter);
        element.addEventListener('mouseleave', onLeave);
        return () => {
            element.removeEventListener('mouseenter', onEnter);
            element.removeEventListener('mouseleave', onLeave);
        };
    },
    // Simple parallax effect
    addParallax(element, speed = 0.5) {
        return ScrollTrigger.create({
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            animation: gsap.fromTo(element, { y: -50 * speed }, { y: 50 * speed })
        });
    },
    // Reveal on scroll
    revealOnScroll(element, options = {}) {
        const { start = 'top 80%', end = 'bottom 20%', y = 60, duration = 1 } = options;
        gsap.set(element, { opacity: 0, y });
        return ScrollTrigger.create({
            trigger: element,
            start,
            end,
            animation: gsap.to(element, {
                opacity: 1,
                y: 0,
                duration,
                ease: 'power2.out'
            }),
            toggleActions: 'play none none reverse'
        });
    },
    // Simple typewriter effect
    typewriter(element, text, speed = 80) {
        let currentIndex = 0;
        const type = () => {
            if (currentIndex < text.length) {
                element.textContent = text.slice(0, currentIndex + 1);
                currentIndex++;
                setTimeout(type, speed);
            }
        };
        element.textContent = '';
        type();
    }
};
