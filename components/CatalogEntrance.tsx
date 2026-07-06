"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import LayoutScrollBlock from "./LayoutScrollBlock";

export default function CatalogEntrance() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 65%", "end 65%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsLight(latest > 0.05 && latest < 0.95);
  });

  // Parallax effects inside the image
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div 
      ref={wrapperRef}
      className={`relative w-full transition-colors duration-1000 ${
        isLight ? "bg-[#efeae3] text-ink" : "bg-ink text-bone"
      }`}
    >
      <section data-scroll-snap className="relative w-full overflow-hidden pt-28 sm:pt-40 pb-20 sm:pb-28">
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
                  className={`whitespace-nowrap border px-8 py-4 text-[11px] font-semibold uppercase tracking-widest transition duration-700 backdrop-blur-sm ${
                    isLight 
                      ? "border-ink/30 text-ink hover:bg-ink hover:text-bone" 
                      : "border-bone/30 text-bone hover:bg-bone hover:text-ink"
                  }`}
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
                <div className={`absolute inset-0 transition-colors duration-1000 ${isLight ? "bg-white/30" : "bg-black/25 hover:bg-black/10"}`} /> 
                
                {/* Overlay Text */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-10%" }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center text-center"
                >
                  <h2 
                    className={`font-display font-semibold uppercase tracking-tight transition-colors duration-1000 ${
                      isLight ? "text-ink drop-shadow-md" : "text-bone drop-shadow-lg"
                    }`}
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
                  className={`whitespace-nowrap border px-8 py-4 text-[11px] font-semibold uppercase tracking-widest transition duration-700 backdrop-blur-sm ${
                    isLight 
                      ? "border-ink/30 text-ink hover:bg-ink hover:text-bone" 
                      : "border-bone/30 text-bone hover:bg-bone hover:text-ink"
                  }`}
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
              className={`flex w-full sm:w-auto items-center justify-center border px-8 py-4 text-[11px] font-semibold uppercase tracking-widest transition duration-700 ${
                isLight
                  ? "border-ink/20 bg-[#efeae3] text-ink hover:bg-ink hover:text-bone"
                  : "border-bone/20 bg-ink text-bone hover:bg-bone hover:text-ink"
              }`}
            >
              Подбор по параметрам
            </a>
            <a 
              href="#objects" 
              className={`flex w-full sm:w-auto items-center justify-center border px-8 py-4 text-[11px] font-semibold uppercase tracking-widest transition duration-700 ${
                isLight
                  ? "border-ink/20 bg-[#efeae3] text-ink hover:bg-ink hover:text-bone"
                  : "border-bone/20 bg-ink text-bone hover:bg-bone hover:text-ink"
              }`}
            >
              Выбор на генплане
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- LAYOUTS SCROLL (wide format) ---------- */}
      <LayoutScrollBlock
        frameBase="/layout-frames"
        frameBaseMobile="/layout-frames-mobile"
        frameCount={300}
        poster="/layout-scroll-poster.jpg"
      />
    </div>
  );
}
