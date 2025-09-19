import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../utils/gsapConfig";
import { ExternalLink, Github, Linkedin, ArrowDown } from "lucide-react";
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  SPACING,
  TYPOGRAPHY,
  ANIMATION_CONFIG,
} from "../utils/responsive";

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLSpanElement>(null);

  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const typewriter = typewriterRef.current;

    if (
      !hero ||
      !title ||
      !subtitle ||
      !description ||
      !cta ||
      !scrollIndicator
    )
      return;

    // Initial setup
    gsap.set([title, subtitle, description, cta, scrollIndicator], {
      opacity: 0,
      y: 50,
      clearProps: "all",
    });

    // Typewriter effect - responsive text
    const text = "FrontEnd Developer & scalable web apps builder.";
    let currentText = "";
    let charIndex = 0;

    const typewriterAnimation = () => {
      if (charIndex < text.length && typewriter) {
        currentText += text[charIndex];
        typewriter.textContent = currentText;
        charIndex++;
        setTimeout(typewriterAnimation, 80);
      }
    };

    // Master timeline
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(title.children, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(title, {
          textShadow:
            "2px 0px 0px rgba(255,0,150,0.8), -2px 0px 0px rgba(0,255,255,0.8)",
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          delay: 1,
        });
      },
    })
      .to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            setTimeout(typewriterAnimation, 500);
          },
        },
        "-=0.6"
      )
      .to(
        description, // ✅ الوصف يدخل هنا بعد subtitle
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        cta.children,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .to(
        scrollIndicator,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // Floating animation
    gsap.to(scrollIndicator, {
      y: -15,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Parallax
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      animation: gsap.to([title, subtitle, description, cta], {
        y: -100,
        opacity: 0.3,
      }),
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleScrollDown = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: window.innerHeight, autoKill: false },
      ease: "power2.inOut",
    });
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)
          `,
        }}
      >
        {/* Main content */}
        <div className={`relative z-10 ${SPACING[breakpoint].container}`}>
          <div ref={titleRef} className={SPACING[breakpoint].margin}>
            <h1
              className={`${TYPOGRAPHY[breakpoint].hero} text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 leading-tight`}
            >
              <span className="block animate-pulse">Mohamed Mahmoud</span>
              <span className={`block ${isMobile ? "mt-1" : "mt-2"}`}>
                Mohamed Mahmoud
              </span>
            </h1>
            <div
              className={`${
                isMobile
                  ? "mt-2 h-0.5 w-16"
                  : isTablet
                  ? "mt-3 h-0.5 w-24"
                  : "mt-4 h-1 w-32"
              } bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto`}
            ></div>
          </div>

          {/* Typewriter subtitle */}
          <p
            ref={subtitleRef}
            className={`${TYPOGRAPHY[breakpoint].h2} text-gray-300 ${
              isMobile ? "mb-2" : "mb-4"
            } font-light`}
          >
            <span
              ref={typewriterRef}
              className={`inline-block ${
                isMobile ? "min-h-[1.2em]" : "min-h-[1.5em]"
              }`}
            ></span>
          </p>

          <p
            ref={descriptionRef}
            className={`${TYPOGRAPHY[breakpoint].body} text-gray-400 ${
              isMobile ? "mb-8" : "mb-12"
            } max-w-2xl mx-auto leading-relaxed`}
          >
            {isMobile
              ? "Creating digital experiences with modern tech and clean design."
              : "Crafting digital experiences with cutting-edge technology, clean architecture, and pixel-perfect design."}
          </p>

          {/* CTA */}
          <div
            ref={ctaRef}
            className={`flex ${
              isMobile ? "flex-col gap-4" : "flex-col sm:flex-row gap-6"
            } justify-center items-center`}
          >
            <a
              href="https://github.com/mohamed-ctrl878"
              className={`group relative ${
                isMobile ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
              } bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center ${
                isMobile ? "gap-2" : "gap-3"
              } overflow-hidden w-full sm:w-auto justify-center`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span
                className={`relative z-10 flex items-center ${
                  isMobile ? "gap-2" : "gap-3"
                }`}
              >
                <Github className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                {isMobile ? "My Work" : "View My Work"}
                <ExternalLink
                  className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                />
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/mohamed-el-eskanderany/"
              className={`group ${
                isMobile ? "px-6 py-3 text-base" : "px-8 py-4 text-lg"
              } border-2 border-gray-600 rounded-xl font-semibold text-gray-300 hover:border-blue-400 hover:text-white hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 flex items-center ${
                isMobile ? "gap-2" : "gap-3"
              } backdrop-blur-sm w-full sm:w-auto justify-center`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
              {isMobile ? "Connect" : "Let's Connect"}
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          onClick={handleScrollDown}
          className={`absolute ${
            isMobile ? "bottom-4" : "bottom-8"
          } left-1/2 -translate-x-1/2 cursor-pointer group`}
        >
          <div
            className={`flex flex-col items-center ${
              isMobile ? "gap-1" : "gap-2"
            } text-gray-400 hover:text-white transition-colors duration-300`}
          >
            <span
              className={`${isMobile ? "text-xs" : "text-sm"} font-medium ${
                isMobile ? "hidden" : "block"
              }`}
            >
              Scroll to explore
            </span>
            <ArrowDown
              className={`${
                isMobile ? "w-5 h-5" : "w-6 h-6"
              } group-hover:translate-y-1 transition-transform duration-300`}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
