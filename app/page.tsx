import BrandFilm from "@/components/BrandFilm";
import Gorkogo46 from "@/components/Gorkogo46";
import MalaysaryMap from "@/components/MalaysaryMap";
import CompanyAdvantages from "@/components/CompanyAdvantages";
import ConstructionSpec from "@/components/ConstructionSpec";
import EditorialSpread from "@/components/EditorialSpread";
import HeroVideo from "@/components/HeroVideo";
import HorizontalAdvantages from "@/components/HorizontalAdvantages";
import ObjectsCatalog from "@/components/ObjectsCatalog";
import PurchaseTerms from "@/components/PurchaseTerms";
import RevealOnView from "@/components/RevealOnView";
import ScrollHouseAnimation from "@/components/ScrollHouseAnimation";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import StatsCountUp from "@/components/StatsCountUp";
import TradeIn from "@/components/TradeIn";
import TwoUpFeature from "@/components/TwoUpFeature";
import TwoUpVideo from "@/components/TwoUpVideo";

export default function HomePage() {
  return (
    <main className="relative bg-ink text-bone">
      <ScrollProgressBar />

      {/* ---------- NAV ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-[2px] sm:px-10">
        <a href="#top" className="flex items-center gap-3 font-display text-sm font-semibold tracking-tightest text-bone">
          <img src="/logo-mark.webp" alt="" aria-hidden className="h-8 w-auto" />
          <span className="hidden sm:inline">MALAYSARY INVEST</span>
          <span className="sm:hidden">MALAYSARY</span>
        </a>
        <nav className="hidden gap-7 text-eyebrow uppercase text-bone-soft lg:flex">
          <a className="transition hover:text-bone" href="#objects">Объекты</a>
          <a className="transition hover:text-bone" href="#advantages">Преимущества</a>
          <a className="transition hover:text-bone" href="#construction">Конструктив</a>
          <a className="transition hover:text-bone" href="#terms">Условия</a>
          <a className="transition hover:text-bone" href="#company">О компании</a>
          <a className="transition hover:text-bone" href="#contact">Контакты</a>
        </nav>
        <a
          href="#contact"
          className="border border-bone/20 px-4 py-2 text-eyebrow uppercase text-bone transition hover:border-bone hover:bg-bone hover:text-ink"
        >
          Бронь
        </a>
      </header>

      {/* ---------- SCROLL-DRIVEN 3D TOUR (fullscreen, pinned) ---------- */}
      <div id="top">
        <ScrollHouseAnimation />
      </div>

      {/* ---------- BRAND FILM (scroll-scrubbed, desktop only) ---------- */}
      <BrandFilm scrubSrc="/video/brand-scrub.mp4" poster="/video/brand.jpg" />

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
      <section className="relative border-y border-bone/10 bg-ink-deep px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <RevealOnView className="text-eyebrow uppercase text-bone-mute">
            Знакомство
          </RevealOnView>
          <RevealOnView
            as="div"
            delay={120}
            className="mt-6 max-w-4xl font-display font-semibold tracking-tightest text-balance text-bone"
          >
            <h2 style={{ fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 0.98 }}>
              Архитектура без лишнего.
              <br />
              Двор без посторонних.
              <br />
              <span className="text-bone-mute">Жильё без компромиссов.</span>
            </h2>
          </RevealOnView>

          <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <RevealOnView delay={200} className="border-t border-bone/15 pt-4">
              <StatsCountUp
                to={6}
                className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl"
              />
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">этажей</div>
            </RevealOnView>
            <RevealOnView delay={280} className="border-t border-bone/15 pt-4">
              <span className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl">
                ≈ <StatsCountUp to={40} />
              </span>
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">квартир</div>
            </RevealOnView>
            <RevealOnView delay={360} className="border-t border-bone/15 pt-4">
              <StatsCountUp
                to={100}
                suffix="%"
                className="font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl"
              />
              <div className="mt-2 text-eyebrow uppercase text-bone-dim">закрытая территория</div>
            </RevealOnView>
            <RevealOnView delay={440} className="border-t border-bone/15 pt-4">
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

      {/* ---------- OBJECTS CATALOG ---------- */}
      <ObjectsCatalog />

      {/* ---------- ГОРЬКОГО 46 SHOWCASE ---------- */}
      <Gorkogo46 />

      {/* ---------- FLAGSHIP SHOWCASE INTRO ---------- */}
      <section className="relative bg-ink px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <RevealOnView className="text-eyebrow uppercase text-bone-mute">
            Флагман · Корпус 1
          </RevealOnView>
          <RevealOnView
            as="div"
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
      <div id="facade">
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
      </div>

      {/* ---------- EDITORIAL: YARD / AERIAL ---------- */}
      <div id="yard">
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
      </div>

      {/* ---------- TWO-UP: GARAGES + PLAYGROUND ---------- */}
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

      {/* ---------- LIVING YARD (looped videos) ---------- */}
      <TwoUpVideo
        left={{
          src: "/video/yard-day",
          eyebrow: "Двор днём",
          title: <>Вода, игры и солнце.</>,
          body: (
            <>
              Сухой фонтан, игровые формы и навесы от солнца. Двор, в котором
              дети проводят весь день — на виду у родителей.
            </>
          ),
        }}
        right={{
          src: "/video/yard-evening",
          eyebrow: "Двор вечером",
          title: <>Тёплый свет после заката.</>,
          body: (
            <>
              Вечером двор подсвечивается мягким светом: дорожки, зелень и
              площадка видны с каждого балкона.
            </>
          ),
        }}
      />

      {/* ---------- CONSTRUCTION SPEC ---------- */}
      <ConstructionSpec />

      {/* ---------- PURCHASE TERMS ---------- */}
      <PurchaseTerms />

      {/* ---------- TRADE-IN ---------- */}
      <TradeIn />

      {/* ---------- COMPANY ADVANTAGES + INFOGRAPHICS ---------- */}
      <CompanyAdvantages />

      {/* ---------- CLOSING SPREAD ---------- */}
      <EditorialSpread
        imageSrc="/photos/exterior/d8acdf54501cf768e20eb02848d822ff_12e5751c-a425-49cf-87ad-b55f03a90aca.webp"
        imageAlt="Жилой дом и территория на закате"
        eyebrow="Дом — это решение надолго"
        title={
          <>
            Приезжайте посмотреть
            <br />
            <span className="text-bone-mute">в любой день недели.</span>
          </>
        }
        body={
          <>
            Менеджер встретит на территории, проведёт по этажам, покажет планировки и
            свободные квартиры. Без скриптов и без давления.
          </>
        }
        placement="bottom-left"
        height="tall"
      />

      {/* ---------- CONTACT ---------- */}
      <section
        id="contact"
        className="relative border-t border-bone/10 bg-ink-deep px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <RevealOnView className="text-eyebrow uppercase text-bone-mute">
            Контакты
          </RevealOnView>
          <RevealOnView
            as="div"
            delay={120}
            className="mt-6 max-w-3xl font-display font-semibold tracking-tightest text-balance text-bone"
          >
            <h2 style={{ fontSize: "clamp(38px, 6.5vw, 92px)", lineHeight: 0.95 }}>
              Запишитесь
              <br />
              на показ.
            </h2>
          </RevealOnView>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <RevealOnView delay={200} className="border-t border-bone/15 pt-5">
              <div className="text-eyebrow uppercase text-bone-dim">Телефон</div>
              <a
                href="tel:+77072343333"
                className="mt-2 block font-display text-2xl font-semibold tracking-tightest text-bone transition hover:text-bone-mute"
              >
                8 707 234 33 33
              </a>
            </RevealOnView>
            <RevealOnView delay={280} className="border-t border-bone/15 pt-5">
              <div className="text-eyebrow uppercase text-bone-dim">Instagram</div>
              <a
                href="https://instagram.com/malaysary_invest"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-display text-2xl font-semibold tracking-tightest text-bone transition hover:text-bone-mute"
              >
                @malaysary_invest
              </a>
            </RevealOnView>
            <RevealOnView delay={360} className="border-t border-bone/15 pt-5">
              <div className="text-eyebrow uppercase text-bone-dim">Офис продаж</div>
              <div className="mt-2 font-display text-xl font-semibold leading-snug tracking-tightest text-bone">
                г. Павлодар,<br />
                ул. Луначарского, 10<br />
                <span className="text-bone-mute">2 этаж, кабинет 2</span>
              </div>
            </RevealOnView>
          </div>

          <RevealOnView delay={440} className="mt-16 flex flex-wrap items-center gap-4">
            <a
              href="tel:+77072343333"
              className="inline-flex items-center gap-3 bg-bone px-7 py-4 text-eyebrow uppercase text-ink transition hover:bg-bone-soft"
            >
              Позвонить сейчас →
            </a>
            <a
              href="https://instagram.com/malaysary_invest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-bone/25 px-7 py-4 text-eyebrow uppercase text-bone transition hover:border-bone hover:bg-bone hover:text-ink"
            >
              Instagram →
            </a>
          </RevealOnView>

          {/* Sales office map */}
          <RevealOnView delay={200} className="mt-16">
            <div className="text-eyebrow uppercase text-bone-dim">Наши объекты на карте</div>
            <div className="mt-5 overflow-hidden border border-bone/15">
              <MalaysaryMap />
            </div>
          </RevealOnView>
        </div>
      </section>

      <footer className="border-t border-bone/10 bg-ink-deep px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            {/* Logo + tagline */}
            <div>
              <img
                src="/logo-light.webp"
                alt="Malaysary Invest"
                className="h-16 w-auto opacity-90"
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-dim">
                Застройщик комфортной среды для жизни в Павлодаре.
              </p>
            </div>

            {/* Contacts */}
            <div className="grid gap-6 sm:grid-cols-3 sm:gap-10">
              <div>
                <div className="text-eyebrow uppercase text-bone-dim">Телефон</div>
                <a href="tel:+77072343333" className="mt-2 block text-bone transition hover:text-bone-mute">
                  8 707 234 33 33
                </a>
              </div>
              <div>
                <div className="text-eyebrow uppercase text-bone-dim">Instagram</div>
                <a
                  href="https://instagram.com/malaysary_invest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-bone transition hover:text-bone-mute"
                >
                  @malaysary_invest
                </a>
              </div>
              <div>
                <div className="text-eyebrow uppercase text-bone-dim">Офис</div>
                <div className="mt-2 text-bone leading-relaxed">
                  г. Павлодар<br />
                  ул. Луначарского, 10<br />
                  <span className="text-bone-mute">2 этаж, каб. 2</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-bone/10 pt-6 text-eyebrow uppercase text-bone-dim sm:flex-row sm:items-center">
            <div>© {new Date().getFullYear()} MALAYSARY INVEST</div>
            <div className="text-bone-dim/60">Изображения — визуализация проекта.</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
