import React, { Dispatch, JSX,RefObject,SetStateAction,useEffect } from 'react'
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
type UseProjectScrollableParams = {
  projectsContainerRef: RefObject<HTMLDivElement | null>;
  projectsWrapperRef: RefObject<HTMLDivElement | null>;
  setProjectsProgress: Dispatch<SetStateAction<number>>;
  setIsProjectsActive: Dispatch<SetStateAction<boolean>>;
};
const useProjectScrollable = ({projectsContainerRef,projectsWrapperRef,setProjectsProgress
,setIsProjectsActive}:UseProjectScrollableParams) :void=> {
    useEffect(() => {
  const container = projectsContainerRef.current;
  const wrapper = projectsWrapperRef.current;
  if (!container || !wrapper) return;

  const nodeList = wrapper.querySelectorAll(".project-outer");
  const cards = Array.from(nodeList) as HTMLElement[];
  if (!cards.length) return;
  const total = cards.length;

  // مركز العناصر
  gsap.set(cards, { xPercent: -50, yPercent: -50, left: "50%", top: "50%", position: "absolute" });

  const spacing = 28;
  const scaleStep = 0.06;

  // إعداد أولي
  cards.forEach((card, i) => {
    card.style.display = "";
    card.style.pointerEvents = "none";
    gsap.set(card, {
      zIndex: total - i,
      scale: 1 - i * scaleStep,
      y: i * spacing,
      autoAlpha: i === 0 ? 1 : 0.95,
      willChange: "transform, opacity"
    });
  });

  const scrollLength = window.innerHeight * total;

  // ref لتخزين آخر active index لتفادي تكرار الأنيميشن
  const prevActiveRef = { current: -1 };

  const hideDuration = 0.12; // سرعة إخفاء العنصر السابق (اضبط لو تحب)
  const showDuration = 0.28; // مدة اظهار البطاقة الحالية
  const backDuration = 0.28; // مدة إعادة ترتيب البطاقات الخلفية

  const st = ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: `+=${scrollLength}`,
    scrub: 0.6,
    pin: container,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    // markers: true, // فعلها مؤقتاً لو حبيت تشوف نقاط البداية والنهاية
    onUpdate(self) {
      const raw = self.progress * (total - 1);
      const activeIndex = Math.round(raw);

      // لو لم يتغير الفهرس الفعّال، لا نفعل أي شيء (نتجنّب إطلاق الأنيمشن في كل إطار)
      if (prevActiveRef.current === activeIndex) {
        // لكن نحدّث الـ progress/state إن احتجت
        try {
          setProjectsProgress(self.progress);
          setIsProjectsActive(self.isActive);
        } catch (e) {}
        return;
      }

      // تحفظ الفهرس الجديد
      prevActiveRef.current = activeIndex;

      // حدث الـ progress & active state
      try {
        setProjectsProgress(self.progress);
        setIsProjectsActive(self.isActive);
      } catch (e) {}

      // نطبّق تغييرات مرة واحدة على كل بطاقة (نلغى أي tweens سابقة عليها)
      cards.forEach((card, i) => {
        gsap.killTweensOf(card); // يزيل tweens المتبقية لمنع التراكب

        if (i < activeIndex) {
          // بطاقات انتهى عرضها -> اختفاء سريع ثم حذف من الـ flow عبر display:none
          gsap.to(card, {
            autoAlpha: 0,
            scale: 0.84,
            y: -60,
            duration: hideDuration,
            ease: "power2.in",
            overwrite: true,
            onComplete() {
              // إخفاء DOM نهائياً لتفادي أي تراكب بصري
              card.style.display = "none";
              card.style.pointerEvents = "none";
            }
          });
        } else if (i === activeIndex) {
          // البطاقة الحالية -> أظهرها (قد تكون مخفية سابقًا)
          if (card.style.display === "none") card.style.display = "";
          card.style.pointerEvents = "auto";
          gsap.to(card, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: showDuration,
            ease: "power3.out",
            zIndex: total + 2,
            overwrite: true
          });
        } else {
          // بطاقات في الخلف -> أعِدها لحالة stack (ظاهرة ومصغرة)
          if (card.style.display === "none") card.style.display = "";
          card.style.pointerEvents = "none";
          const targetScale = 1 - i * scaleStep;
          const targetY = i * spacing;
          gsap.to(card, {
            autoAlpha: 0.95,
            scale: targetScale,
            y: targetY,
            duration: backDuration,
            ease: "power2.out",
            zIndex: Math.max(1, total - i),
            overwrite: true
          });
        }
      });
    }
  });

  const handleResize = () => ScrollTrigger.refresh();
  window.addEventListener("resize", handleResize);

  return () => {
    try { st.kill(); } catch (e) {}
    ScrollTrigger.getAll().forEach(s => s.kill());
    window.removeEventListener("resize", handleResize);
    // تنظيف نهائي
    cards.forEach(card => {
      gsap.killTweensOf(card);
      card.style.display = "";
      card.style.pointerEvents = "";
      gsap.set(card, { clearProps: "all" });
    });
  };
}, []);
}
export default useProjectScrollable
