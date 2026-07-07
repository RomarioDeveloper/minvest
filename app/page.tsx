import BrandFilm from "@/components/BrandFilm";
import LayoutScrollBlock from "@/components/LayoutScrollBlock";
import CompanyAdvantages from "@/components/CompanyAdvantages";
import EditorialSpread from "@/components/EditorialSpread";
import HeroVideo from "@/components/HeroVideo";
import HorizontalAdvantages from "@/components/HorizontalAdvantages";
import VideoFeatureBlocks from "@/components/VideoFeatureBlocks";
import MalaysaryMap from "@/components/MalaysaryMap";
import ObjectsCatalog from "@/components/ObjectsCatalog";
import RevealOnView from "@/components/RevealOnView";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import StatsCountUp from "@/components/StatsCountUp";
import TradeIn from "@/components/TradeIn";
import TwoUpFeature from "@/components/TwoUpFeature";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <main className="relative w-full max-w-full bg-ink text-bone">
      <ScrollProgressBar />

      {/* ---------- NAV ---------- */}
      <Header />

      {/* ---------- SCROLL-DRIVEN VIDEO (fullscreen, pinned) ---------- */}
      <div id="top">
        <BrandFilm
          frameBase="/hero-desktop-frames"
          frameBaseMobile="/hero-mobile-frames"
          frameCount={300}
          frameCountMobile={181}
          poster="/hero-scrub-temp.jpg"
          posterMobile="/hero-scrub-mobile-temp.jpg"
        />
      </div>

      {/* ---------- HERO ---------- */}
      <div>
        <HeroVideo
          src="/video/1"
          eyebrow="Старт продаж · 2026"
          title={
            <>
              Дом,
              <br />
              который видно.
            </>
          }
          subtitle="Шестиэтажный жилой комплекс с закрытой территорией, гаражами и собственной детской площадкой. Изучите его со всех сторон."
        />
      </div>

      {/* ---------- INTRO STATS ---------- */}
      <section className="relative overflow-x-clip border-y border-bone/10 bg-ink-deep px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <RevealOnView variant="block" delay={150} className="border-t border-bone/15 bg-ink-panel p-5 -mx-5 sm:mx-0 sm:p-6 sm:-mt-6">
              <StatsCountUp
                to={6}
                className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl"
              />
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">этажей</div>
            </RevealOnView>
            <RevealOnView variant="block" delay={300} className="border-t border-bone/15 bg-ink-panel p-5 -mx-5 sm:mx-0 sm:p-6 sm:-mt-6">
              <span className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl">
                ≈ <StatsCountUp to={40} />
              </span>
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">квартир</div>
            </RevealOnView>
            <RevealOnView variant="block" delay={450} className="border-t border-bone/15 bg-ink-panel p-5 -mx-5 sm:mx-0 sm:p-6 sm:-mt-6">
              <StatsCountUp
                to={100}
                suffix="%"
                className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl"
              />
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">закрытая территория</div>
            </RevealOnView>
            <RevealOnView variant="block" delay={600} className="border-t border-bone/15 bg-ink-panel p-5 -mx-5 sm:mx-0 sm:p-6 sm:-mt-6">
              <div className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl">
                24 / 7
              </div>
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">видеонаблюдение</div>
            </RevealOnView>
          </div>
        </div>
      </section>

      {/* ---------- ADVANTAGES (horizontal scroll) ---------- */}
      <HorizontalAdvantages />

      {/* ---------- WIDE VIDEO BLOCKS ---------- */}
      <VideoFeatureBlocks />

      {/* ---------- LAYOUTS SCROLL ---------- */}
      <LayoutScrollBlock
        frameBase="/layout-frames"
        frameBaseMobile="/layout-frames-mobile"
        frameCount={300}
        poster="/layout-scroll-poster.jpg"
      />

      {/* ---------- OBJECTS CATALOG ---------- */}
      <ObjectsCatalog />

      {/* ---------- FLAGSHIP SHOWCASE INTRO ---------- */}
      <section className="relative bg-ink px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
            Флагман · Корпус 1
          </RevealOnView>
          <RevealOnView
            as="div"
            variant="blur"
            delay={120}
            className="mt-6 max-w-4xl font-display font-semibold tracking-tightest text-balance text-bone"
          >
            <h2 style={{ fontSize: "clamp(30px, 4.8vw, 64px)", lineHeight: 0.98 }}>
              Загляните внутрь дома,
              <br />
              <span className="text-bone-mute">который уже строится.</span>
            </h2>
          </RevealOnView>
        </div>
      </section>

      {/* ---------- EDITORIAL: NIGHT FACADE ---------- */}
      <div id="facade" className="relative">
        <RevealOnView variant="shutter" offset={0} as="div">
          <EditorialSpread
            imageSrc="/photos/exterior/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.webp"
            imageAlt="Ночной вид жилого дома с подсветкой"
            eyebrow="Архитектура"
            title={
              <>
                Тёплый свет
                <br />
                в каждом окне.
              </>
            }
            body={
              <>
                Вентилируемый фасад с крупноформатными плитами, контрастные тёмные углы и
                вертикальная шахта остекления. Архитектурная подсветка фасада и пешеходных
                дорожек включается с наступлением сумерек.
              </>
            }
            placement="bottom-left"
            height="screen"
            meta={[
              { label: "Высота", value: "6 этажей" },
              { label: "Фасад", value: "HPL-панели" },
              { label: "Остекление", value: "2-камерное" },
              { label: "Освещение", value: "Архитектурное" },
            ]}
          />
        </RevealOnView>
      </div>

      {/* ---------- EDITORIAL: YARD / AERIAL ---------- */}
      <div id="yard" className="relative">
        <RevealOnView variant="shutter-left" offset={0} as="div">
          <EditorialSpread
            imageSrc="/photos/exterior/19086718317f3e5a196967033b163ebf_27ece1ff-b826-4aa3-9941-763ce558d334.webp"
            imageAlt="Аэросъёмка двора и закрытой территории"
            eyebrow="Закрытый двор"
            title={
              <>
                Только для тех,
                <br />
                кто здесь живёт.
              </>
            }
            body={
              <>
                Единственный въезд — через шлагбаум. Гости проходят по приглашению. Внутри
                периметра — газон, дорожки, ландшафтное озеленение и тишина, которой не
                бывает у дома без забора.
              </>
            }
            placement="bottom-right"
            height="tall"
          />
        </RevealOnView>
      </div>

      {/* ---------- TWO-UP: GARAGES + PLAYGROUND ---------- */}
      <div className="relative border-t border-bone/10 bg-ink-deep">
        <RevealOnView variant="shutter-right" offset={0} as="div">
          <TwoUpFeature
            left={{
              imageSrc: "/photos/garages/3af31198-00f7-4aae-96c6-180b7fef755e.webp",
              imageAlt: "Капитальные кирпичные гаражи во дворе",
              eyebrow: "Гаражи",
              title: <>Капитальный кирпич. Свой бокс на машину.</>,
              body: (
                <>
                  Отдельные секции внутри двора, тёплая отделка кирпичом, антивандальные
                  ворота. Можно оставлять без присмотра.
                </>
              ),
            }}
            right={{
              imageSrc: "/photos/playground/298ff71b-9791-4543-b9ba-5d14ff3673e5.webp",
              imageAlt: "Детская площадка во дворе",
              eyebrow: "Детская площадка",
              title: <>Безопасное покрытие. Тёплый свет вечером.</>,
              body: (
                <>
                  Прорезиненное покрытие, современные игровые формы, прямой обзор с балконов
                  и от подъезда.
                </>
              ),
            }}
          />
        </RevealOnView>
      </div>

      {/* ---------- TRADE-IN ---------- */}
      <TradeIn />

      {/* ---------- COMPANY ADVANTAGES + INFOGRAPHICS ---------- */}
      <CompanyAdvantages />

      {/* ---------- CONTACT ---------- */}
      <section
        id="contact"
        className="relative overflow-hidden border-t border-bone/10 bg-ink-deep px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
      >
        {/* Мягкое свечение за заголовком — блок перестаёт быть плоско-чёрным */}
        <div className="pointer-events-none absolute -top-48 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-bone/[0.05] blur-[140px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <RevealOnView variant="wipe" className="text-eyebrow uppercase text-bone-mute">
                Контакты
              </RevealOnView>
              <RevealOnView
                as="div"
                variant="blur"
                delay={120}
                className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
              >
                <h2 style={{ fontSize: "clamp(38px, 6.5vw, 92px)", lineHeight: 0.95 }}>
                  Запишитесь
                  <br />
                  <span className="text-bone-mute">на показ.</span>
                </h2>
              </RevealOnView>
              <RevealOnView delay={220} className="mt-6 max-w-md text-pretty leading-relaxed text-bone-soft">
                Проведём по дому и двору, покажем планировки вживую и ответим на
                вопросы по ипотеке, рассрочке и trade-in.
              </RevealOnView>
            </div>

            <RevealOnView delay={320} className="flex flex-wrap items-center gap-3 lg:pb-2">
              <a
                href="tel:+77072343333"
                className="group inline-flex items-center gap-3 rounded-full bg-bone py-4 pl-7 pr-6 text-[13px] font-semibold tracking-[0.04em] text-ink transition-colors duration-300 hover:bg-bone-soft"
              >
                Позвонить сейчас
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="https://wa.me/77072343333"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-bone/25 py-4 pl-7 pr-6 text-[13px] font-semibold tracking-[0.04em] text-bone transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink"
              >
                WhatsApp
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </RevealOnView>
          </div>

          {/* Контактные карточки */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "tel:+77072343333",
                external: false,
                label: "Телефон",
                value: "8 707 234 33 33",
                note: "пн-пт с 09:00 до 18:00",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                href: "https://instagram.com/malaysary_invest",
                external: true,
                label: "Instagram",
                value: "@malaysary_invest",
                note: "репортажи со строек",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                href: "https://2gis.kz/pavlodar/search/%D0%9B%D1%83%D0%BD%D0%B0%D1%87%D0%B0%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%2010",
                external: true,
                label: "Офис продаж",
                value: "ул. Луначарского, 10",
                note: "г. Павлодар · 2 этаж, кабинет 2",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
            ].map((c, i) => (
              <RevealOnView
                key={c.label}
                variant="block"
                delay={160 + i * 100}
                className="group relative overflow-hidden rounded-2xl border border-bone/10 bg-ink-panel transition-colors duration-500 hover:border-bone/25"
              >
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block p-6 sm:p-7"
                >
                  {/* Свечение сверху при наведении */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(244,244,245,0.07),rgba(244,244,245,0)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/15 text-bone-soft transition-colors duration-500 group-hover:border-bone/40 group-hover:text-bone">
                      {c.icon}
                    </span>
                    <span className="text-bone-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone">
                      ↗
                    </span>
                  </div>

                  <div className="mt-8 font-display text-xl font-semibold tracking-tightest text-bone sm:text-2xl">
                    {c.value}
                  </div>
                  <div className="mt-2 border-t border-bone/10 pt-3">
                    <span className="text-[13px] font-semibold text-bone-soft">{c.label}</span>
                    <span className="ml-2 text-[12px] text-bone-dim">{c.note}</span>
                  </div>
                </a>
              </RevealOnView>
            ))}
          </div>

          {/* Sales office map */}
          <RevealOnView variant="zoom" delay={200} className="mt-16">
            <div className="text-eyebrow uppercase text-bone-dim">Наши объекты на карте</div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-bone/15">
              <MalaysaryMap />
            </div>
          </RevealOnView>
        </div>
      </section>

      <footer className="border-t border-bone/10 bg-ink-deep px-6 py-12 md:py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl flex flex-col justify-between min-h-[240px]">
          
          {/* Top/Middle Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 flex-1 pb-16">
            
            {/* Left Column - Socials & Legal */}
            <div className="flex flex-col justify-between items-start">
              <div className="flex gap-8 text-[10px] font-semibold tracking-widest uppercase text-bone-soft">
                <a
                  href="https://instagram.com/malaysary_invest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-transparent transition hover:border-bone hover:text-bone pb-1"
                >
                  Instagram
                </a>
                <a
                  href="https://wa.me/77072343333"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-transparent transition hover:border-bone hover:text-bone pb-1"
                >
                  WhatsApp
                </a>
              </div>
              <div className="mt-16 md:mt-0 text-[10px] leading-[1.6] text-bone-dim/60 max-w-[280px]">
                <p>Материалы, представленные на сайте,<br />не являются публичной офертой.</p>
                <p className="mt-3">Изображения — визуализация проекта.</p>
              </div>
            </div>

            {/* Center Column - Logo */}
            <div className="flex flex-col items-center justify-start md:justify-center pt-2 md:pt-0">
              <img
                src="/logo-light.webp"
                alt="Malaysary Invest"
                className="h-14 md:h-[68px] w-auto opacity-90"
              />
              <div className="mt-6 text-[9px] uppercase tracking-[0.2em] text-bone-dim/50 text-center">
                Застройщик комфортной среды
              </div>
            </div>

            {/* Right Column - Contacts */}
            <div className="flex flex-col justify-between items-start md:items-end text-left md:text-right">
              <a
                href="tel:+77072343333"
                className="font-display text-2xl md:text-[26px] font-light tracking-wide text-bone transition hover:text-bone-mute"
              >
                +7 (707) 234-33-33
              </a>
              <div className="mt-10 md:mt-0 text-[10px] leading-[1.6] text-bone-dim/80">
                <p>
                  Офис продаж:<br />
                  г. Павлодар, ул. Луначарского, 10
                </p>
                <p className="mt-3 text-bone-dim/60">
                  пн-пт: 09:00–18:00, сб-вс: выходной
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-start justify-between gap-5 border-t border-bone/10 pt-6 text-[9px] uppercase tracking-wider text-bone-dim/50 sm:flex-row sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
              <span>© {new Date().getFullYear()} «MALAYSARY INVEST». Все права защищены.</span>
              <a href="#" className="border-b border-bone-dim/30 transition hover:text-bone-dim hover:border-bone-dim pb-0.5">
                Правовая информация
              </a>
            </div>
            <div>Сделано в IGLOBAL</div>
          </div>
          
        </div>
      </footer>
    </main>
  );
}
