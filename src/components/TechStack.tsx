import { skills } from "../contants/skills";
import React, { JSX, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../utils/gsapConfig";
import { Code } from "lucide-react";
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  SPACING,
  TYPOGRAPHY,
} from "../utils/responsive";

const TechStack = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const skillsContainerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    const container = containerRef.current;
    const skillsContainer = skillsContainerRef.current;
    const title = titleRef.current;
    const progressBar = progressBarRef.current;

    if (!container || !skillsContainer || !title || !progressBar) return;

    // Initial animations
    gsap.set([title, skillsContainer], { opacity: 0, y: 50 });

    const tl = gsap.timeline();
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)",
    }).to(
      skillsContainer,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // Animate skills entrance only (no infinite "floating" animation)
    const skillElements = skillsContainer.querySelectorAll(
      ".skill-item .skill-card"
    );
    gsap.set(skillElements, { opacity: 0, scale: 0.98, y: 12 });
    gsap.to(skillElements, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "back.out(1.3)",
      delay: 0.2,
    });

    // Scroll-triggered progress bar animation
    ScrollTrigger.create({
      trigger: container,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => {
        gsap.to(progressBar, {
          width: "100%",
          duration: 2,
          ease: "power2.out",
        });
      },
      onLeave: () => {
        gsap.to(progressBar, {
          width: "0%",
          duration: 1,
          ease: "power2.out",
        });
      },
      onEnterBack: () => {
        gsap.to(progressBar, {
          width: "100%",
          duration: 1,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(progressBar, {
          width: "0%",
          duration: 1,
          ease: "power2.out",
        });
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleSkillHover = (skillName: string, isEntering: boolean) => {
    if (isMobile) return; // Disable hover on mobile

    setHoveredSkill(isEntering ? skillName : null);
    const skillElement = document.querySelector(
      `[data-skill="${skillName}"] .skill-card`
    );
    if (!skillElement) return;

    if (isEntering) {
      gsap.to(skillElement, {
        scale: 1.06,
        y: -6,
        duration: 0.28,
        ease: "power2.out",
      });
    } else {
      gsap.to(skillElement, {
        scale: 1,
        y: 0,
        duration: 0.28,
        ease: "power2.out",
      });
    }
  };

  const handleSkillClick = (skill: any) => {
    setSelectedSkill(skill);
    const skillElement = document.querySelector(
      `[data-skill="${skill.name}"] .skill-card`
    );
    if (skillElement) {
      gsap.fromTo(
        skillElement,
        { scale: 1 },
        {
          scale: 1.12,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );
    }
  };

  // Get responsive classes
  const sectionClasses = `min-h-screen relative overflow-hidden flex items-center justify-center ${SPACING[breakpoint].section}`;
  const containerClasses = `relative z-10 text-center ${SPACING[breakpoint].container}`;

  return (
    <section
      id="skills"
      ref={containerRef}
      className={sectionClasses}
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className={containerClasses}>
        {/* Title */}
        <div className={SPACING[breakpoint].margin}>
          <h2
            ref={titleRef}
            className={`${TYPOGRAPHY[breakpoint].hero} ${SPACING[breakpoint].margin}`}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              {isMobile ? "My" : "Tech"}
            </span>
            {!isMobile && <span className="text-red-700">& Science</span>}
            <span className="text-white mx-2 sm:mx-4">Stack</span>
          </h2>

          <p
            className={`${
              TYPOGRAPHY[breakpoint].body
            } text-gray-400 max-w-2xl mx-auto leading-relaxed ${
              isMobile ? "mb-8" : "mb-16"
            }`}
          >
            {isMobile
              ? "Modern tech stack for digital experiences"
              : "Crafting digital experiences with modern technologies and clean architecture"}
          </p>
        </div>

        {/* Skills Grid - fixed rows and alignment */}
        <div
          ref={skillsContainerRef}
          className={`
            grid auto-rows-fr justify-items-center items-stretch gap-4 max-w-5xl mx-auto
            ${
              isMobile
                ? "grid-cols-3 gap-3 px-4"
                : isTablet
                ? "grid-cols-4 gap-4 px-6"
                : "grid-cols-6 gap-6 px-8"
            }
          `}
        >
          {skills.map((skill, index) => {
            const isHovered = hoveredSkill === skill.name;

            return (
              <div
                key={index}
                data-skill={skill.name}
                className="skill-item w-full cursor-pointer"
                onMouseEnter={() => handleSkillHover(skill.name, true)}
                onMouseLeave={() => handleSkillHover(skill.name, false)}
                onClick={() => handleSkillClick(skill)}
              >
                {/* skill-card fills the grid cell and has consistent height */}
                <div
                  className={`skill-card relative w-full h-full ${
                    isMobile ? "min-h-16" : isTablet ? "min-h-20" : "min-h-24"
                  }
                    ${
                      isMobile ? "rounded-lg" : "rounded-xl"
                    } backdrop-blur-sm border transition-all duration-300
                    flex flex-col items-center justify-center p-2 overflow-hidden
                    ${
                      isHovered
                        ? "border-blue-400 bg-blue-500/18 shadow-lg shadow-blue-500/20"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }
                  `}
                >
                  <div
                    className={`absolute inset-0 ${
                      isMobile ? "rounded-lg" : "rounded-xl"
                    } bg-gradient-to-br from-white/5 to-transparent pointer-events-none`}
                  ></div>

                  <div
                    className={`relative ${
                      isMobile ? "w-6 h-6" : isTablet ? "w-8 h-8" : "w-10 h-10"
                    } mb-2 flex items-center justify-center z-10`}
                  >
                    {skill.icon}
                  </div>

                  <div
                    className={`relative text-center z-10 ${
                      isMobile ? "text-xs" : isTablet ? "text-sm" : "text-sm"
                    } text-white font-medium`}
                  >
                    {isMobile
                      ? skill.name.split(" ")[0] // First word only on mobile
                      : skill.name.length > 12
                      ? skill.name.split(" ")[0] // Truncate long names
                      : skill.name}
                  </div>

                  {/* Glow effect - visual only, doesn't affect layout */}
                  <div
                    className={`absolute inset-0 ${
                      isMobile ? "rounded-lg" : "rounded-xl"
                    } 
                    bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                  `}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className={`${isMobile ? "mt-8" : "mt-16"} max-w-md mx-auto`}>
          <div
            className={`${
              isMobile ? "h-0.5" : "h-1"
            } bg-gray-800 rounded-full overflow-hidden`}
          >
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform origin-left scale-x-0"
              style={{ width: "0%" }}
            ></div>
          </div>
        </div>

        {/* Skill Details */}
        {selectedSkill && (
          <div
            className={`${
              isMobile ? "mt-8 p-4" : "mt-16 p-6"
            } bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 ${
              isMobile ? "max-w-xs" : "max-w-md"
            } mx-auto relative z-50`}
          >
            <div
              className={`flex items-center ${
                isMobile ? "gap-2 mb-2" : "gap-4 mb-4"
              }`}
            >
              <div
                className={`${
                  isMobile ? "w-8 h-8" : "w-12 h-12"
                } rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center`}
              >
                {selectedSkill.icon}
              </div>
              <div>
                <h3
                  className={`${
                    isMobile ? "text-lg" : "text-xl"
                  } font-bold text-white`}
                >
                  {selectedSkill.name}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className={`text-gray-400 hover:text-white transition-colors duration-300 ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechStack;
