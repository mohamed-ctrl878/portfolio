import React, { JSX, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../utils/gsapConfig";
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  SPACING,
  TYPOGRAPHY,
} from "../utils/responsive";
import { Download, MapPin, Calendar, Coffee, Code2, Zap } from "lucide-react";
import mohamedName from "../assets/other/WhatsApp Image 2025-07-10 at 08.47.19_247438f4.jpg";
const About = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const skillsHighlightRef = useRef<HTMLDivElement | null>(null);

  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(
        [
          titleRef.current,
          contentRef.current,
          imageRef.current,
          statsRef.current,
          skillsHighlightRef.current,
        ],
        {
          opacity: 0,
          y: 50,
        }
      );

      // Main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      })
        .to(
          imageRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          skillsHighlightRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // Floating animation for profile image (disabled on mobile)
      if (!isMobile) {
        gsap.to(imageRef.current, {
          y: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Counter animations
      const counters = containerRef.current.querySelectorAll(".counter");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0");
        const obj = { value: 0 };

        ScrollTrigger.create({
          trigger: counter,
          start: "top 80%",
          onEnter: () => {
            gsap.to(obj, {
              value: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = Math.ceil(obj.value).toString();
              },
            });
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [breakpoint, isMobile]);

  const handleDownloadCV = () => {
    // Add your CV download logic here
    console.log("Download CV clicked");
  };

  // Get responsive classes
  const sectionClasses = `min-h-screen relative overflow-hidden flex items-center justify-center ${SPACING[breakpoint].section}`;
  const containerClasses = `relative z-10 ${SPACING[breakpoint].container}`;

  const stats = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Years Experience",
      value: 3,
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      label: "Cups of Coffee",
      value: 500,
    },
  ];

  const highlights = [
    "FrontEnd Development",
    "SaaS Platforms",
    "Web Platforms",
    "Performance Optimization",
    "Responsive Design",
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      className={sectionClasses}
      style={{
        background: `
          radial-gradient(circle at 70% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-64 right-24 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-48 left-24 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-32 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className={containerClasses}>
        {/* Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className={`${TYPOGRAPHY[breakpoint].hero} ${SPACING[breakpoint].margin}`}
          >
            <span className="text-white">About</span>
            <span className="mx-2 sm:mx-4 bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
        </div>

        <div
          className={`grid gap-8 lg:gap-16 items-center ${
            isMobile ? "grid-cols-1" : "lg:grid-cols-2"
          }`}
        >
          {/* Profile Image */}
          <div
            ref={imageRef}
            className={`${
              isMobile ? "order-1" : "order-1 lg:order-2"
            } flex justify-center`}
          >
            <div className="relative">
              {/* Main profile container */}
              <div
                className={`
                relative ${
                  isMobile ? "w-48 h-48" : isTablet ? "w-64 h-64" : "w-80 h-80"
                } 
                rounded-3xl overflow-hidden border border-white/10 
                bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-sm
              `}
              >
                {/* Profile image placeholder - replace with actual image */}
                {/* <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <div className={`${isMobile ? "text-6xl" : "text-8xl"}`}>
                    👨‍💻
                  </div>
                </div> */}
                <img src={mohamedName} alt="me" />

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full blur-sm opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full blur-sm opacity-60"></div>
              </div>

              {/* Floating badge */}
              <div
                className={`
                absolute ${isMobile ? "-top-2 -right-2" : "-top-4 -right-4"} 
                ${
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                } bg-gradient-to-br from-green-400 to-cyan-500 
                rounded-full flex items-center justify-center border-4 border-black/20
              `}
              >
                <span className={`${isMobile ? "text-lg" : "text-2xl"}`}>
                  ✨
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className={`${
              isMobile ? "order-2" : "order-2 lg:order-1"
            } space-y-6`}
          >
            <div className="space-y-4">
              <h3
                className={`${TYPOGRAPHY[breakpoint].heading} text-white font-bold`}
              >
                Hi, I'm Mohamed 👋
              </h3>

              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className={TYPOGRAPHY[breakpoint].caption}>
                  Based in Egypt
                </span>
              </div>

              <div
                className={`${TYPOGRAPHY[breakpoint].body} text-gray-300 leading-relaxed space-y-4`}
              >
                <p>
                  I am a{" "}
                  <span className="text-blue-400 font-semibold">
                    Frontend Developer
                  </span>{" "}
                  passionate about building scalable web applications and SaaS
                  platforms with a focus on performance, clean code, and user
                  experience.
                </p>

                <p>
                  With strong expertise in JavaScript (ES6+), React.js, Redux
                  Toolkit, and Jest, I apply Clean Architecture principles to
                  deliver maintainable, reliable, and{" "}
                  <span className="text-purple-400 font-semibold">
                    testable applications.
                  </span>{" "}
                  💡 My main interest lies in developing EdTech solutions and
                  modern platforms that enhance digital learning and
                  collaboration. I enjoy turning complex requirements into
                  elegant, user-friendly interfaces.
                </p>

                <p>🔹 Technical Skills:</p>
                <p>
                  Frontend: React.js, Redux Toolkit, JavaScript (ES6+), Jest
                  Architecture: Clean Architecture, modular design Tools: Git,
                  GitHub, REST APIs, Vite 📂 Check my projects and contributions
                  on{" "}
                  <a
                    className="text-purple-400 font-semibold"
                    href="https://github.com/mohamed-ctrl878."
                  >
                    My github profile
                  </a>{" "}
                  🚀 Always eager to learn, grow, and contribute to innovative
                  teams working on impactful products. Currently open to
                  opportunities as a Frontend Developer in SaaS, EdTech, and Web
                  Platforms.
                </p>
              </div>

              {/* Download CV Button */}
              <div className="pt-4">
                <button
                  onClick={handleDownloadCV}
                  className={`
                    inline-flex items-center gap-2 ${
                      isMobile ? "px-6 py-3 text-sm" : "px-8 py-4 text-base"
                    }
                    bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold 
                    rounded-xl hover:from-blue-700 hover:to-purple-700 
                    transform hover:scale-105 transition-all duration-300 
                    shadow-lg hover:shadow-xl
                  `}
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="mt-16">
          <div
            className={`grid gap-4 ${
              isMobile
                ? "grid-cols-2"
                : isTablet
                ? "grid-cols-2"
                : "grid-cols-4"
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`
                  ${isMobile ? "w-16 h-16" : "w-20 h-20"} mx-auto mb-3 
                  bg-gradient-to-br from-blue-500/20 to-purple-600/20 
                  rounded-2xl border border-white/10 backdrop-blur-sm 
                  flex items-center justify-center text-blue-400
                `}
                >
                  {stat.icon}
                </div>
                <div
                  className={`${TYPOGRAPHY[breakpoint].heading} font-bold text-white counter`}
                  data-target={stat.value}
                >
                  0
                </div>
                <div
                  className={`${TYPOGRAPHY[breakpoint].caption} text-gray-400 mt-1`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Highlight */}
        <div ref={skillsHighlightRef} className="mt-16">
          <h4
            className={`${TYPOGRAPHY[breakpoint].subheading} text-center text-white font-semibold mb-8`}
          >
            What I Do Best
          </h4>
          <div
            className={`grid gap-3 ${
              isMobile
                ? "grid-cols-1"
                : isTablet
                ? "grid-cols-2"
                : "grid-cols-4"
            }`}
          >
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className={`
                ${isMobile ? "p-4" : "p-6"} text-center 
                bg-gradient-to-br from-white/5 to-white/0 
                border border-white/10 rounded-2xl backdrop-blur-sm
                hover:border-blue-400/30 hover:from-blue-500/10 hover:to-purple-500/10
                transition-all duration-300 group cursor-pointer
              `}
              >
                <div
                  className={`${TYPOGRAPHY[breakpoint].body} text-gray-300 group-hover:text-white transition-colors duration-300`}
                >
                  {highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
