import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../utils/gsapConfig";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  SPACING,
  TYPOGRAPHY,
} from "../utils/responsive";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Responsive hooks
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const form = formRef.current;

    if (!container || !title || !form) return;

    // Initial setup
    gsap.set([title, form], { opacity: 0, y: 50 });

    const tl = gsap.timeline();
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)",
    }).to(
      form,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5"
    );

    // Animate form fields on scroll
    const formFields = form.querySelectorAll(".form-field");
    gsap.set(formFields, { opacity: 0, x: -30 });

    ScrollTrigger.create({
      trigger: form,
      start: "top 80%",
      onEnter: () => {
        gsap.to(formFields, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);

    // Animate error fields
    Object.keys(newErrors).forEach((field) => {
      const fieldElement = document.querySelector(`[data-field="${field}"]`);
      if (fieldElement) {
        gsap.to(fieldElement, {
          keyframes: {
            "0%": { x: 0 },
            "10%": { x: -10 },
            "30%": { x: 10 },
            "50%": { x: -5 },
            "70%": { x: 5 },
            "100%": { x: 0 },
          },
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Animate submit button
    const submitButton = document.querySelector(".submit-button");
    if (submitButton) {
      gsap.to(submitButton, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);

      // Show success animation
      const success = successRef.current;
      if (success) {
        gsap.set(success, { scale: 0, opacity: 0 });
        gsap.to(success, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      }

      // Reset form after delay
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFieldFocus = (field: string) => {
    const fieldElement = document.querySelector(`[data-field="${field}"]`);
    if (fieldElement) {
      gsap.to(fieldElement, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleFieldBlur = (field: string) => {
    const fieldElement = document.querySelector(`[data-field="${field}"]`);
    if (fieldElement) {
      gsap.to(fieldElement, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className={`${isMobile ? "w-4 h-4" : "w-6 h-6"}`} />,
      title: "Email",
      value: "mohamedeleskanderwow@gmail.com",
      href: "mailto:mohamedeleskanderwow@gmail.com",
    },
    {
      icon: <Linkedin className={`${isMobile ? "w-4 h-4" : "w-6 h-6"}`} />,
      title: "LinkedIn",
      value: "Mohamed Mahmoud",
      href: "https://www.linkedin.com/in/mohamed-el-eskanderany/",
    },
  ];

  const socialLinks = [
    {
      icon: <Github className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />,
      href: "https://github.com/mohamed-ctrl878",
      label: "GitHub",
    },
    {
      icon: <Linkedin className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`} />,
      href: "https://www.linkedin.com/in/mohamed-el-eskanderany/",
      label: "LinkedIn",
    },
  ];

  return (
    <section
      id="contact"
      ref={containerRef}
      className={`min-h-screen flex justify-center items-center relative overflow-hidden ${SPACING[breakpoint].section}`}
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className={`relative z-10 ${SPACING[breakpoint].container}`}>
        {/* Header */}
        <div className={`text-center ${isMobile ? "mb-8" : "mb-16"}`}>
          <h2
            ref={titleRef}
            className={`${TYPOGRAPHY[breakpoint].hero} ${SPACING[breakpoint].margin}`}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Let's
            </span>
            <span className={`text-white ${isMobile ? "mx-2" : "mx-4"}`}>
              Connect
            </span>
          </h2>

          <p
            className={`${TYPOGRAPHY[breakpoint].body} text-gray-400 max-w-2xl mx-auto leading-relaxed`}
          >
            {isMobile
              ? "Ready to discuss your project? Let's connect and create something amazing."
              : "Ready to bring your ideas to life? Let's discuss your next project and create something amazing together."}
          </p>
        </div>

        <div className={`flex items-center justify-center`}>
          {/* Contact Information */}
          <div className={`${isMobile ? "space-y-4" : "space-y-8"}`}>
            <div>
              <h3
                className={`${
                  isMobile ? "text-xl" : "text-2xl"
                } font-bold text-white ${isMobile ? "mb-4" : "mb-6"}`}
              >
                Get in Touch
              </h3>
              <p
                className={`text-gray-400 ${
                  isMobile ? "mb-4 text-sm" : "mb-8"
                } leading-relaxed`}
              >
                {isMobile
                  ? "Let's discuss opportunities, projects, or technology."
                  : "I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and development."}
              </p>
            </div>

            {/* Contact Details */}
            <div className={`${isMobile ? "space-y-3" : "space-y-6"}`}>
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center ${
                    isMobile ? "gap-3 p-3" : "gap-4 p-4"
                  } bg-white/5 backdrop-blur-sm ${
                    isMobile ? "rounded-lg" : "rounded-xl"
                  } border border-white/10 hover:border-white/20 transition-all duration-300 ${
                    !isMobile ? "hover:scale-105" : ""
                  } group`}
                >
                  <div
                    className={`${
                      isMobile ? "w-8 h-8" : "w-12 h-12"
                    } bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:text-white transition-colors duration-300`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-gray-500 mb-1`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-white font-medium ${
                        isMobile ? "text-sm" : ""
                      }`}
                    >
                      {isMobile && item.title === "Email"
                        ? "mohamedmahmoudeleskanderwow@gmail.com"
                        : item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4
                className={`${
                  isMobile ? "text-base" : "text-lg"
                } font-semibold text-white ${isMobile ? "mb-2" : "mb-4"}`}
              >
                Follow Me
              </h4>
              <div className={`flex ${isMobile ? "gap-2" : "gap-4"}`}>
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      isMobile ? "w-9 h-9" : "w-12 h-12"
                    } bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-blue-400 flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300 ${
                      !isMobile ? "hover:scale-110" : ""
                    }`}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
