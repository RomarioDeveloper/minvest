"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CatalogEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects inside the image
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden pt-28 sm:pt-40 pb-20 sm:pb-28 bg-ink">
      {/* 
        The split background.
        We animate the beige background dropping down from the top on scroll.
      */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <motion.div 
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="h-[55%] w-full bg-[#e3dfd7] origin-top" 
        />
        {/* Bottom dark section remains inherited from bg-ink */}
      </div>

      <div className="relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="flex w-full items-center justify-center">
          
          <div className="relative flex w-full max-w-[1500px] items-center justify-center gap-6 xl:gap-12">
            
            {/* Left Button */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-10%" }}
              className="hidden lg:flex flex-1 justify-end"
            >
              <a 
                href="#objects" 
                className="whitespace-nowrap border border-bone/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-bone transition hover:border-bone hover:bg-bone hover:text-ink backdrop-blur-sm"
                style={{ marginTop: '20%' }}
              >
                Подбор по параметрам
              </a>
            </motion.div>

            {/* Central Image Container - Expands from a horizontal slit */}
            <motion.div 
              initial={{ clipPath: "inset(50% 0 50% 0)", scale: 0.95 }}
              whileInView={{ clipPath: "inset(0% 0 0% 0)", scale: 1 }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
              viewport={{ once: true, margin: "-10%" }}
              className="relative aspect-[4/3] sm:aspect-[21/9] w-full max-w-[1000px] overflow-hidden shrink-0"
            >
              <motion.img 
                src="/photos/exterior/d8acdf54501cf768e20eb02848d822ff_12e5751c-a425-49cf-87ad-b55f03a90aca.webp" 
                alt="Интерьер" 
                className="absolute inset-0 h-full w-full object-cover"
                style={{ scale: imageScale, y: imageY }}
              />
              <div className="absolute inset-0 bg-black/25 transition-opacity hover:bg-black/10" /> 
              
              {/* Overlay Text */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-10%" }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-center"
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
            </motion.div>

            {/* Right Button */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-10%" }}
              className="hidden lg:flex flex-1 justify-start"
            >
              <a 
                href="#objects" 
                className="whitespace-nowrap border border-bone/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-bone transition hover:border-bone hover:bg-bone hover:text-ink backdrop-blur-sm"
                style={{ marginTop: '20%' }}
              >
                Выбор на генплане
              </a>
            </motion.div>

          </div>
        </div>

        {/* Mobile & Tablet Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-10%" }}
          className="mt-12 flex w-full flex-col sm:flex-row justify-center gap-3 lg:hidden relative z-10"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
