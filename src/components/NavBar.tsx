import React, { JSX, useEffect, useRef, useState } from "react";
import { Home, User, Code, Briefcase, Mail } from "lucide-react";
import { gsap } from "../utils/gsapConfig";
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
} from "../utils/responsive";

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  { name: "Home", href: "#home", icon: <Home className="w-4 h-4" /> },
  { name: "About", href: "#about", icon: <User className="w-4 h-4" /> },
  { name: "Skills", href: "#skills", icon: <Code className="w-4 h-4" /> },
  {
    name: "Projects",
    href: "#projects",
    icon: <Briefcase className="w-4 h-4" />,
  },
  { name: "Contact", href: "#contact", icon: <Mail className="w-4 h-4" /> },
];

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const navRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // refs to avoid re-creating things
  const tlRef = useRef<any>(null);
  const isScrolledRef = useRef<boolean>(false);
  const tickingRef = useRef<boolean>(false);
  const indicatorAnimationsRef = useRef<any[]>([]);
  const sectionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeSectionRef = useRef<string>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // ---------- 1) Entrance animation (run once) ----------
  useEffect(() => {
    const logo = logoRef.current;
    const menu = menuRef.current;
    if (!logo || !menu) return;

    // prepare children array safely
    const menuChildren = Array.from(menu.children) as HTMLElement[];

    gsap.set([logo, ...menuChildren], { y: -50, opacity: 0 });

    tlRef.current = gsap
      .timeline({ delay: 0.2 })
      .to(logo, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" })
      .to(
        menuChildren,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );

    return () => {
      tlRef.current?.kill?.();
      // Cleanup indicator animations
      indicatorAnimationsRef.current.forEach((tween) => {
        if (tween && tween.kill) {
          tween.kill();
        }
      });
      indicatorAnimationsRef.current = [];
    };
  }, []); // run only once

  // ---------- 2) Scroll listener: update isScrolled (throttled with rAF) ----------
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const doScrollWork = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const shouldBeScrolled = scrollY > 100;

      if (shouldBeScrolled !== isScrolledRef.current) {
        isScrolledRef.current = shouldBeScrolled;
        setIsScrolled(shouldBeScrolled);

        if (shouldBeScrolled) {
          gsap.to(nav, {
            y: 0,
            scale: isMobile ? 0.98 : 0.95,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(10, 10, 26, 0.8)",
            borderRadius: isMobile ? "16px" : "20px",
            padding: isMobile
              ? "8px 16px"
              : isTablet
              ? "10px 20px"
              : "12px 24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            duration: 0.5,
            ease: "power2.out",
          });
        } else {
          gsap.to(nav, {
            scale: 1,
            backgroundColor: "transparent",
            borderRadius: "0px",
            padding: isMobile
              ? "16px 20px"
              : isTablet
              ? "20px 28px"
              : "24px 32px",
            boxShadow: "none",
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }

      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(doScrollWork);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // call once to sync initial state
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile, isTablet]); // ensure nav style changes when breakpoints change

  // ---------- 3) Section detection: combined logic (original observer + detectActive you liked) ----------
  useEffect(() => {
    const sectionIds = ["home", "about", "skills", "projects", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const getNavHeight = () => navRef.current?.offsetHeight ?? 0;

    // parameters (tweak if needed)
    const HOME_TOP_TOLERANCE = 150; // px from top to still count as home
    const HOME_VISIBILITY_RATIO = 0.25; // fraction of home visible to count as home

    const detectActive = () => {
      // prefer Home if near top OR sufficiently visible
      const homeEl = document.getElementById("home");
      if (homeEl) {
        const rect = homeEl.getBoundingClientRect();
        const homeHeight = rect.height || homeEl.offsetHeight || 1;

        const visibleHeight =
          Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        const visibleRatio = visibleHeight / homeHeight;

        if (window.scrollY <= HOME_TOP_TOLERANCE || visibleRatio >= HOME_VISIBILITY_RATIO) {
          if (activeSectionRef.current !== "home") {
            debouncedSectionChange("home");
          } else {
            animateActiveIndicator("home");
          }
          return;
        }
      }

      // otherwise pick section whose center is closest to viewport center
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestId = sections[0].id;
      let minDist = Infinity;

      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        const sTop = window.scrollY + rect.top;
        const sCenter = sTop + rect.height / 2;
        const dist = Math.abs(sCenter - viewportCenter);
        if (dist < minDist) {
          minDist = dist;
          closestId = s.id;
        }
      });

      if (closestId !== activeSectionRef.current) {
        debouncedSectionChange(closestId);
      } else {
        animateActiveIndicator(closestId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // original behavior: when intersection thresholds change, run detectActive
        detectActive();
      },
      {
        root: null,
        rootMargin: `-${getNavHeight()}px 0px 0px 0px`,
        threshold: [0, 0.15, 0.35, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));

    // run immediately to set initial state (important on load / refresh)
    detectActive();

    const onResize = () => detectActive();
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (sectionChangeTimeoutRef.current) {
        clearTimeout(sectionChangeTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- animate indicator safely with cleanup ----------
  const animateActiveIndicator = (section: string) => {
    // Kill any existing indicator animations to prevent conflicts
    indicatorAnimationsRef.current.forEach((tween) => {
      try {
        if (tween && typeof tween.kill === "function") tween.kill();
      } catch (e) {
        /* ignore */
      }
    });
    indicatorAnimationsRef.current = [];

    // Get all indicators at once to avoid multiple DOM queries
    const allIndicators = document.querySelectorAll(".nav-indicator");
    if (!allIndicators.length) return;

    allIndicators.forEach((indicator) => {
      const parent = indicator.parentElement;
      const isActive = parent?.getAttribute("data-section") === section;

      // Create the animation and store reference for cleanup
      const tween = gsap.to(indicator, {
        scaleX: isActive ? 1 : 0,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });

      indicatorAnimationsRef.current.push(tween);
    });
  };

  // ---------- debounced section change (fixed: optimistic ref update to avoid race) ----------
  const debouncedSectionChange = (newSection: string) => {
    // clear any pending change
    if (sectionChangeTimeoutRef.current) {
      clearTimeout(sectionChangeTimeoutRef.current);
      sectionChangeTimeoutRef.current = null;
    }

    // if already the same as current ref, just animate to ensure visual sync
    if (newSection === activeSectionRef.current) {
      animateActiveIndicator(newSection);
      return;
    }

    // optimistic update to the ref so subsequent checks see the new value immediately
    activeSectionRef.current = newSection;

    // schedule the actual state update (debounced) to avoid rapid re-renders
    sectionChangeTimeoutRef.current = setTimeout(() => {
      // only call setState if it's truly different from the current state (guard)
      setActiveSection((prev) => {
        if (prev === newSection) return prev;
        return newSection;
      });

      // ensure visual indicator updated when the state finally settles
      animateActiveIndicator(newSection);

      sectionChangeTimeoutRef.current = null;
    }, 50); // you can tweak 50ms sensitivity
  };

  // ---------- mobile toggle animation (kept simple & safe) ----------
  const toggleMobileMenu = () => {
    const mobileMenu = mobileMenuRef.current;
    if (!mobileMenu) return;

    if (!isOpen) {
      setIsOpen(true);
      gsap.set(mobileMenu, { display: "block", opacity: 0, y: -20 });
      gsap.to(mobileMenu, {
        opacity: 1,
        y: 0,
        duration: 0.28,
        ease: "power2.out",
      });

      const menuItems = Array.from(mobileMenu.querySelectorAll("li"));
      gsap.set(menuItems, { opacity: 0, y: 20 });
      gsap.to(menuItems, {
        opacity: 1,
        y: 0,
        duration: 0.36,
        stagger: 0.08,
        ease: "back.out(1.7)",
      });
    } else {
      gsap.to(mobileMenu, {
        opacity: 0,
        y: -20,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
          gsap.set(mobileMenu, { display: "none" });
        },
      });
    }
  };

  // ---------- smooth scroll to section using GSAP's ScrollTo (assume plugin registered in utils) ----------
  const handleNavClick = (href: string) => {
    const sectionId = href.substring(1);

    // Immediately update active section for responsiveness
    if (sectionChangeTimeoutRef.current) {
      clearTimeout(sectionChangeTimeoutRef.current);
    }
    setActiveSection(sectionId);
    animateActiveIndicator(sectionId);

    // Then smooth scroll to target
    const target = document.querySelector(href) as HTMLElement | null;
    if (target) {
      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: target, autoKill: false },
        ease: "power2.inOut",
      });
    }
    if (isOpen) toggleMobileMenu();
  };

  return (
    <>
      {/* Main Navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center ${
          isMobile ? "pt-2" : "pt-4"
        }`}
      >
        <nav
          ref={navRef}
          className={`
            flex justify-between items-center 
            ${
              isMobile
                ? "max-w-full mx-2"
                : isTablet
                ? "max-w-4xl mx-auto"
                : "max-w-6xl mx-auto"
            } 
            ${isMobile ? "px-4 py-3" : isTablet ? "px-6 py-3" : "px-8 py-4"}
            transition-all duration-500
            ${
              isScrolled
                ? `bg-black/80 backdrop-blur-xl ${
                    isMobile ? "rounded-xl" : "rounded-2xl"
                  } shadow-2xl border border-white/10`
                : "bg-transparent"
            }
          `}
          style={{ width: isScrolled ? (isMobile ? "95%" : "90%") : "100%" }}
        >
          {/* Logo */}
          <div ref={logoRef} className="cursor-pointer">
            <h1
              className={`${
                isMobile ? "text-lg" : isTablet ? "text-xl" : "text-2xl"
              } font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent`}
            >
              {isMobile ? "M.M" : "M.Mahmoud"}
            </h1>
            <div
              className={`${
                isMobile ? "h-0.5" : "h-0.5"
              } bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-1 animate-pulse`}
            ></div>
          </div>

          {/* Desktop Menu */}
          <ul
            ref={menuRef}
            className={`hidden md:flex items-center ${
              isTablet ? "gap-4" : "gap-8"
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <li
                  key={item.name}
                  data-section={item.href.substring(1)}
                  className="relative group cursor-pointer transform-gpu"
                  onClick={() => handleNavClick(item.href)}
                >
                  <div
                    className={`flex items-center ${
                      isTablet ? "gap-1 px-2 py-1" : "gap-2 px-4 py-2"
                    } rounded-lg transition-all duration-300 ease-out hover:bg-white/5 hover:scale-105 transform`}
                  >
                    <span
                      className={`transition-colors duration-300 ${
                        isActive ? "text-blue-400" : "text-gray-400"
                      } group-hover:text-white`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`${
                        isTablet ? "text-sm" : "text-base"
                      } font-medium transition-colors duration-300 ${
                        isActive ? "text-white" : "text-gray-300"
                      } group-hover:text-white`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Active indicator */}
                  <div
                    className="nav-indicator absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform origin-left scale-x-0 transition-transform duration-300 ease-out"
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                      transform: "translate3d(0,0,0)",
                    }}
                  ></div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            ref={toggleRef}
            onClick={toggleMobileMenu}
            className={`md:hidden relative ${
              isMobile ? "w-8 h-8" : "w-10 h-10"
            } flex items-center justify-center rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-110`}
            aria-label="Toggle menu"
          >
            <div
              className={`relative flex items-center justify-center ${
                isMobile ? "w-4 h-4" : "w-5 h-5"
              }`}
            >
              <span
                className={`absolute w-full h-0.5 bg-white rounded transition-all duration-300 ${
                  isOpen ? "rotate-45 top-2" : "top-1"
                }`}
              ></span>
              <span
                className={`absolute w-full h-0.5 bg-white rounded top-2 transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`absolute w-full h-0.5 bg-white rounded transition-all duration-300 ${
                  isOpen ? "-rotate-45 top-2" : "top-3"
                }`}
              ></span>
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed ${
          isMobile ? "top-16 left-2 right-2" : "top-20 left-4 right-4"
        } z-40 md:hidden`}
        style={{ display: "none" }}
      >
        <div
          className={`bg-black/90 backdrop-blur-xl ${
            isMobile ? "rounded-xl" : "rounded-2xl"
          } border border-white/10 shadow-2xl ${isMobile ? "p-4" : "p-6"}`}
        >
          <ul className={`${isMobile ? "space-y-2" : "space-y-4"}`}>
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`w-full flex items-center ${
                      isMobile ? "gap-2 px-3 py-2" : "gap-3 px-4 py-3"
                    } rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`${
                        isActive ? "text-blue-400" : "text-gray-400"
                      } ${isMobile ? "text-sm" : ""}`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`font-medium ${isMobile ? "text-sm" : ""}`}
                    >
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
