import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Code2, Eye, Github } from 'lucide-react';
import { useBreakpoint, useIsMobile, useIsTablet } from '../utils/responsive';

interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
  end: string;
  source: string;
  demo: string;
  img: string[]; // <-- array of image URLs
}

interface CardProjectProps {
  projects: Project[];
  displayActiveProject: number;
}

const CardProject: React.FC<CardProjectProps> = ({ projects }) => {
  // array of refs for each project card
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Lightbox / image state (shared for all cards)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>('');
  const [activeThumbIndex, setActiveThumbIndex] = useState<Record<number, number>>({}); 
  // activeThumbIndex maps projectIndex -> selected image index

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const openLightbox = (src: string, alt = '') => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
    setLightboxOpen(true);
    // prevent background scroll
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxSrc(null);
    document.body.style.overflow = '';
  };

  const handleProjectHover = (index: number, isEntering: boolean) => {
    const card = cardRefs.current[index];
    if (!card) return;

    if (isEntering) {
      // apply transform and transition
      card.style.transition = 'transform 0.18s ease, filter 0.18s ease';
      card.style.transform = 'scale(1.02) translateY(-4px)';
      card.style.filter = 'brightness(1.06)';
      card.style.willChange = 'transform, filter';
    } else {
      card.style.transform = 'scale(1) translateY(0)';
      card.style.filter = 'brightness(1)';
    }
  };

  const getProjectGradient = (color: string) => {
    const gradientMap: { [key: string]: string } = {
      'from-blue-500 to-purple-600': 'from-blue-500/20 to-purple-600/20',
      'from-green-400 to-emerald-600': 'from-green-400/20 to-emerald-600/20',
      'from-green-500 to-teal-600': 'from-green-500/20 to-teal-600/20',
      'from-orange-500 to-red-600': 'from-orange-500/20 to-red-600/20',
      'from-cyan-500 to-blue-600': 'from-cyan-500/20 to-blue-600/20',
      'from-pink-500 to-rose-600': 'from-pink-500/20 to-rose-600/20'
    };
    return gradientMap[color] || 'from-gray-500/20 to-gray-600/20';
  };

  return (
    <>
      {projects.map((project: Project, index: number) => {
        const isActive = displayActiveProject === index;
        const imgs = project.img && project.img.length ? project.img : ['/images/placeholder.png'];
        const selectedIdx = activeThumbIndex[index] ?? 0;
        const selectedSrc = imgs[selectedIdx];

        return (
          <div
            key={index}
            data-project={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`project-card flex-shrink-0 ${isMobile ? 'w-80' : isTablet ? 'w-88' : 'w-96'} bg-black/70 ${isMobile ? 'rounded-xl' : 'rounded-2xl'} border border-white/10 overflow-hidden ${isActive ? 'ring-2 ring-purple-500/50' : ''}`}
            onMouseEnter={() => !isMobile && handleProjectHover(index, true)}
            onMouseLeave={() => !isMobile && handleProjectHover(index, false)}
            style={{
              transform: isActive ? (isMobile ? 'scale(1.01)' : 'scale(1.02)') : 'scale(1)',
              filter: isActive ? 'brightness(1.06)' : 'brightness(1)',
              willChange: 'transform,filter'
            }}
          >
            {/* === IMAGE AREA (fixed) === */}
            <div
              className={`project-image relative w-full ${isMobile ? 'h-40' : isTablet ? 'h-44' : 'h-48'} overflow-hidden rounded-2xl bg-gray-800`}
              style={{ clipPath: 'inset(0 round 1rem)', boxSizing: 'border-box' }}
            >
              {/* clickable full-size image (block to avoid inline gaps) */}
              <button
                onClick={() => openLightbox(selectedSrc, project.title)}
                aria-label={`Open ${project.title} image`}
                className="w-full h-full block focus:outline-none"
                style={{ display: 'block' }}
              >
                <img
                  src={selectedSrc}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full block object-cover object-center transition-transform duration-500"
                  style={{ transformOrigin: 'center center', display: 'block', maxWidth: '100%' }}
                />
              </button>

              {/* overlay (keeps color but won't affect clipping) */}
              <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${getProjectGradient(project.color)} opacity-60`} />

              {/* index badge */}
              <div className={`absolute ${isMobile ? 'top-3 right-3 w-6 h-6' : 'top-4 right-4 w-8 h-8'} bg-black/60 rounded-full flex items-center justify-center ${isMobile ? 'text-xs' : 'text-sm'} font-bold text-white`}>
                {selectedIdx + 1}/{imgs.length}
              </div>

              {/* thumbnails strip (kept inside using padding and no negative margins) */}
              <div className="absolute left-3 right-3 bottom-3">
                <div className="thumbnails flex gap-2 items-center overflow-x-auto no-scrollbar" role="list" style={{ paddingBottom: 4 }}>
                  {imgs.map((src, tIdx) => (
                    <button
                      key={tIdx}
                      onClick={() => setActiveThumbIndex((prev) => ({ ...prev, [index]: tIdx }))}
                      className={`flex-none rounded-md overflow-hidden border ${selectedIdx === tIdx ? 'border-white/80 scale-105' : 'border-white/10'} transition-all duration-200 focus:outline-none`}
                      aria-label={`Show image ${tIdx + 1} of ${project.title}`}
                      style={{ width: isMobile ? 48 : 64, height: isMobile ? 32 : 40 }}
                    >
                      <img src={src} alt={`${project.title} thumb ${tIdx + 1}`} loading="lazy" className="w-full h-full object-cover object-center block" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className={`project-content ${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'}`}>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white ${isMobile ? 'mb-2' : 'mb-3'} leading-tight`}>{project.title}</h3>
              <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} ${isMobile ? 'mb-3' : 'mb-4'} leading-relaxed line-clamp-3`}>{project.description}</p>

              <div className={`flex flex-wrap ${isMobile ? 'gap-1' : 'gap-2'} ${isMobile ? 'mb-4' : 'mb-6'}`}>
                {project.tech.slice(0, isMobile ? 3 : 4).map((tech, techIndex) => (
                  <span key={techIndex} className={`tech-tag ${isMobile ? 'px-2 py-0.5' : 'px-3 py-1'} bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-300 border border-white/10 transition-all duration-200 flex items-center`}>
                    <Code2 className={`inline ${isMobile ? 'w-2.5 h-2.5 mr-0.5' : 'w-3 h-3 mr-1'}`} />
                    {tech}
                  </span>
                ))}
                {project.tech.length > (isMobile ? 3 : 4) && (
                  <span className={`${isMobile ? 'px-2 py-0.5' : 'px-3 py-1'} bg-white/5 rounded-full text-xs text-gray-500`}>+{project.tech.length - (isMobile ? 3 : 4)} more</span>
                )}
              </div>

              <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'}`}>
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`flex-1 flex items-center justify-center ${isMobile ? 'gap-1 py-2' : 'gap-2 py-3'} bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all duration-300 ${!isMobile ? 'hover:scale-105' : ''} group`}>
                    <Eye className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    <span className={isMobile ? 'text-xs' : ''}>{isMobile ? 'Demo' : 'View Demo'}</span>
                    {!isMobile && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </a>
                )}
                {project.source && (
                  <a href={project.source} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center ${isMobile ? 'gap-1 px-3 py-2' : 'gap-2 px-4 py-3'} border border-white/20 hover:border-white/30 rounded-lg text-gray-300 hover:text-white transition-all duration-300 ${!isMobile ? 'hover:scale-105' : ''}`}>
                    <Github className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    <span className={isMobile ? 'text-xs' : ''}>Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* LIGHTBOX */}
      {lightboxOpen && lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // close when clicking backdrop
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="relative max-w-[95%] max-h-[95%]">
            <button
              onClick={closeLightbox}
              aria-label="Close image"
              className="absolute top-2 right-2 z-50 bg-black/60 rounded-full p-2 text-white"
            >
              ✕
            </button>
            <img
              src={lightboxSrc}
              alt={lightboxAlt}
              className="max-w-full max-h-[80vh] rounded-md shadow-lg object-contain"
            />
            <div className="mt-2 text-center text-sm text-gray-300">{lightboxAlt}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CardProject);
