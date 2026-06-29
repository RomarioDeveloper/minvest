"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CatalogEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden pt-28 sm:pt-40 pb-20 sm:pb-28">
      {/* 
        The split background: 
        Top half is a light beige/bone color, bottom half is dark ink.
        The horizon line is positioned so it crosses the middle of the image.
      */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        {/* Top light section */}
        <div className="h-[55%] w-full bg-[#e3dfd7]" />
        {/* Bottom dark section */}
        <div className="h-[45%] w-full bg-ink" />
      </div>

      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="flex w-full items-center justify-center">
          
          <div className="relative flex w-full max-w-[1500px] items-center justify-center gap-6 xl:gap-12">
            
            {/* Left Button (Hidden on mobile & small tablets) */}
            <div className="hidden lg:flex flex-1 justify-end">
              <a 
                href="#objects" 
                className="whitespace-nowrap border border-bone/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-bone transition hover:border-bone hover:bg-bone hover:text-ink"
                style={{ marginTop: '20%' }} // Pushes the button down into the black area
              >
                Подбор по параметрам
              </a>
            </div>

            {/* Central Image Container */}
            <div className="relative aspect-[4/3] sm:aspect-[21/9] w-full max-w-[1000px] overflow-hidden shrink-0">
              <motion.img 
                src="/photos/exterior/d8acdf54501cf768e20eb02848d822ff_12e5751c-a425-49cf-87ad-b55f03a90aca.webp" 
                alt="Интерьер" 
                className="absolute inset-0 h-full w-full object-cover"
                style={{ scale: imageScale, y: imageY }}
              />
              <div className="absolute inset-0 bg-black/25 transition-opacity hover:bg-black/10" /> 
              
              {/* Overlay Text */}
              <motion.div 
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-center"
                style={{ y: textY }}
              >
                <h2 
                  className="font-display font-semibold uppercase tracking-tight text-bone drop-shadow-lg"
                  style={{ fontSize: "clamp(30px, 5vw, 84px)", lineHeight: 0.95 }}
                >
                  Выберите свою
                  <br />
                  квартиру
                </h2>
              </motion.div>
            </div>

            {/* Right Button (Hidden on mobile & small tablets) */}
            <div className="hidden lg:flex flex-1 justify-start">
              <a 
                href="#objects" 
                className="whitespace-nowrap border border-bone/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-bone transition hover:border-bone hover:bg-bone hover:text-ink"
                style={{ marginTop: '20%' }} // Pushes the button down into the black area
              >
                Выбор на генплане
              </a>
            </div>

          </div>
        </div>

        {/* Mobile & Tablet Buttons */}
        <div className="mt-12 flex w-full flex-col sm:flex-row justify-center gap-3 lg:hidden relative z-10">
          <a 
            href="#objects" 
            className="flex w-full sm:w-auto items-center justify-center border border-bone/20 bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-bone transition hover:bg-bone hover:text-ink"
          >
            Подбор по параметрам
          </a>
          <a 
            href="#objects" 
            className="flex w-full sm:w-auto items-center justify-center border border-bone/20 bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-bone transition hover:bg-bone hover:text-ink"
          >
            Выбор на генплане
          </a>
        </div>
      </div>
    </section>
  );
}
