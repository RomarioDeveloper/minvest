export type ObjectStatus = "sales" | "soon" | "done";

export type RealtyObject = {
  slug: string;
  name: string;
  district: string;
  status: ObjectStatus;
  /** Short pitch line. */
  tagline: string;
  /** Cover image (webp in /public/photos/...). */
  image: string;
  floors: number;
  apartments: number;
  /** Price "from", in millions ₸ — placeholder. */
  priceFrom: number;
  /** Handover quarter/year. */
  deadline: string;
  /** Plan types available. */
  rooms: string;
  /** Flagship object gets the full on-page tour. */
  flagship?: boolean;
};

export const STATUS_LABEL: Record<ObjectStatus, string> = {
  sales: "Идут продажи",
  soon: "Скоро старт",
  done: "Сдан",
};

/**
 * Placeholder catalog — replace names, prices and deadlines with real data.
 * Images reuse the available renders so every card looks complete.
 */
export const OBJECTS: RealtyObject[] = [
  {
    slug: "minvest-1",
    name: "Minvest · Корпус 1",
    district: "мкр. Центральный",
    status: "sales",
    tagline: "Закрытый двор, гаражи и детская площадка.",
    image: "/photos/exterior/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.webp",
    floors: 6,
    apartments: 40,
    priceFrom: 18,
    deadline: "IV кв. 2026",
    rooms: "1–3 комнаты",
    flagship: true,
  },
  {
    slug: "minvest-park",
    name: "Minvest Park",
    district: "ул. Парковая",
    status: "sales",
    tagline: "Кирпичные секции у городского парка.",
    image: "/photos/exterior/19086718317f3e5a196967033b163ebf_27ece1ff-b826-4aa3-9941-763ce558d334.webp",
    floors: 7,
    apartments: 58,
    priceFrom: 21,
    deadline: "II кв. 2027",
    rooms: "1–4 комнаты",
  },
  {
    slug: "minvest-garden",
    name: "Minvest Garden",
    district: "мкр. Садовый",
    status: "soon",
    tagline: "Малоэтажный квартал с приватными дворами.",
    image: "/photos/exterior/d8acdf54501cf768e20eb02848d822ff_12e5751c-a425-49cf-87ad-b55f03a90aca.webp",
    floors: 5,
    apartments: 32,
    priceFrom: 16,
    deadline: "IV кв. 2027",
    rooms: "студии – 3 комнаты",
  },
  {
    slug: "minvest-sky",
    name: "Minvest Sky",
    district: "пр. Абая",
    status: "sales",
    tagline: "Видовые этажи и панорамное остекление.",
    image: "/photos/exterior/9e27ad1b2a6e559311e9cd2f31399cf3_b0eec14a-5300-487a-9855-d69b9226e8a6.webp",
    floors: 9,
    apartments: 84,
    priceFrom: 24,
    deadline: "III кв. 2027",
    rooms: "1–4 комнаты",
  },
  {
    slug: "minvest-loft",
    name: "Minvest Loft",
    district: "ул. Заводская",
    status: "done",
    tagline: "Сданный дом с заселёнными квартирами.",
    image: "/photos/exterior/da54d15b01f2b830a33dabea43642029_7cbfc151-4e98-4a94-953b-af8989eb8808.webp",
    floors: 6,
    apartments: 46,
    priceFrom: 19,
    deadline: "Сдан, 2025",
    rooms: "1–3 комнаты",
  },
  {
    slug: "minvest-terra",
    name: "Minvest Terra",
    district: "мкр. Восточный",
    status: "soon",
    tagline: "Новый квартал на старте проектирования.",
    image: "/photos/exterior/dd54c08850a98fb706a805585bb226ca_591ee229-3407-4d4a-a44e-e3e9afb8ac00.webp",
    floors: 8,
    apartments: 72,
    priceFrom: 17,
    deadline: "2028",
    rooms: "студии – 4 комнаты",
  },
];
