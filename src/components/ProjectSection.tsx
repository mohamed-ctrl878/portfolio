import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, Code2, Eye, Github } from "lucide-react";
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  SPACING,
  TYPOGRAPHY,
} from "../utils/responsive";
import { projects } from "../contants/projects";
interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
  end: string;
  source: string;
  demo: string;
  img: string[];
}

export default function ProjectSlider(): React.JSX.Element {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [activeThumbIndex, setActiveThumbIndex] = useState<
    Record<number, number>
  >({});

  const getProjectGradient = (color: string) => {
    const gradientMap: { [key: string]: string } = {
      "from-blue-500 to-purple-600": "from-blue-500/20 to-purple-600/20",
      "from-green-400 to-emerald-600": "from-green-400/20 to-emerald-600/20",
      "from-green-500 to-teal-600": "from-green-500/20 to-teal-600/20",
      "from-orange-500 to-red-600": "from-orange-500/20 to-red-600/20",
      "from-cyan-500 to-blue-600": "from-cyan-500/20 to-blue-600/20",
      "from-pink-500 to-rose-600": "from-pink-500/20 to-rose-600/20",
    };
    return gradientMap[color] || "from-gray-500/20 to-gray-600/20";
  };

  return (
    <>
      <div className="text-center mb-16">
        <h2
          className={`${TYPOGRAPHY[breakpoint].hero} ${SPACING[breakpoint].margin}`}
        >
          <span className="mx-2 sm:mx-4 bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Projects
          </span>
        </h2>
      </div>
      <div
        id="projects"
        className="flex gap-6 h-screen overflow-x-auto no-scrollbar py-6 px-4 snap-x snap-mandatory"
      >
        {projects.map((project: Project, index: number) => {
          const imgs =
            project.img && project.img.length
              ? project.img
              : ["/images/placeholder.png"];
          const selectedIdx = activeThumbIndex[index] ?? 0;
          const selectedSrc = imgs[selectedIdx];

          return (
            <div
              key={index}
              data-project={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`project-card justify-between flex flex-col flex-shrink-0 
    ${isMobile ? "w-[90%]" : isTablet ? "w-[420px]" : "w-[500px]"} 
    bg-black/70 ${isMobile ? "rounded-xl" : "rounded-2xl"} 
    border border-white/10 overflow-hidden snap-center`}
            >
              {/* === IMAGE AREA === */}
              <div>
                <div
                  className={`project-image relative w-full 
      ${isMobile ? "h-56" : isTablet ? "h-64" : "h-80"} 
      overflow-hidden bg-gray-800`}
                  style={{
                    clipPath: "inset(0 round 1rem)",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src={selectedSrc}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />

                  {/* overlay gradient */}
                  <div
                    className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${getProjectGradient(
                      project.color
                    )} opacity-60`}
                  />

                  {/* thumbnails */}
                  <div className="absolute left-3 right-3 bottom-3">
                    <div className="flex gap-2 items-center overflow-x-auto no-scrollbar">
                      {imgs.map((src, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() =>
                            setActiveThumbIndex((prev) => ({
                              ...prev,
                              [index]: tIdx,
                            }))
                          }
                          className={`flex-none rounded-md overflow-hidden border ${
                            selectedIdx === tIdx
                              ? "border-white/80 scale-110"
                              : "border-white/10"
                          } transition-all duration-200`}
                          style={{
                            width: isMobile ? 56 : 72,
                            height: isMobile ? 40 : 48,
                          }}
                        >
                          <img
                            src={src}
                            alt={`${project.title} thumb ${tIdx + 1}`}
                            className="w-full h-full object-cover object-center"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* info box */}
                <div className="p-4">
                  <h3
                    className={`${
                      isMobile ? "text-lg" : "text-xl"
                    } font-bold text-white mb-2 leading-tight`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`text-gray-400 ${
                      isMobile ? "text-sm" : "text-base"
                    } mb-4 leading-relaxed line-clamp-3`}
                  >
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  <div
                    className={`flex flex-wrap ${
                      isMobile ? "gap-1" : "gap-2"
                    } mb-4`}
                  >
                    {project.tech
                      .slice(0, isMobile ? 3 : 5)
                      .map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`tech-tag ${
                            isMobile ? "px-2 py-0.5" : "px-3 py-1"
                          } bg-white/5 rounded-full text-xs text-gray-300 border border-white/10 flex items-center`}
                        >
                          <Code2
                            className={`inline ${
                              isMobile ? "w-3 h-3 mr-1" : "w-4 h-4 mr-1.5"
                            }`}
                          />
                          {tech}
                        </span>
                      ))}
                    {project.tech.length > (isMobile ? 3 : 5) && (
                      <span
                        className={`${
                          isMobile ? "px-2 py-0.5" : "px-3 py-1"
                        } bg-white/5 rounded-full text-xs text-gray-500`}
                      >
                        +{project.tech.length - (isMobile ? 3 : 5)} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* === CONTENT === */}
              <div className={`${isMobile ? "p-4" : isTablet ? "p-5" : "p-6"}`}>
                {/* Buttons */}
                <div className={`flex ${isMobile ? "gap-2" : "gap-3"}`}>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center ${
                        isMobile ? "gap-1 py-2" : "gap-2 py-3"
                      } bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium transition-all duration-300 group`}
                    >
                      <Eye className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />
                      <span className={isMobile ? "text-xs" : "text-sm"}>
                        Demo
                      </span>
                      {!isMobile && (
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      )}
                    </a>
                  )}
                  {project.source && (
                    <a
                      href={project.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center ${
                        isMobile ? "gap-1 px-3 py-2" : "gap-2 px-4 py-3"
                      } border border-white/20 rounded-lg text-gray-300 hover:text-white transition-all duration-300`}
                    >
                      <Github
                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
                      />
                      <span className={isMobile ? "text-xs" : "text-sm"}>
                        Code
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
