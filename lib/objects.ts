import type { ObjectLayout } from "./layouts";
import { LAYOUTS_BY_SLUG } from "./layouts.generated";

export type { ObjectLayout, LayoutKind } from "./layouts";

export type ObjectStatus = "sales" | "soon" | "done";

export type RealtyObject = {
  slug: string;
  name: string;
  district: string;
  status: ObjectStatus;
  tagline: string;
  image: string;
  /** Gallery slides shown in the modal */
  gallery: string[];
  /** Optional video clips shown in the modal */
  videos?: string[];
  /** Optional layouts/floorplans shown in the modal */
  layouts?: ObjectLayout[];
  floors: number;
  apartments: number;
  priceFrom: string;
  deadline: string;
  rooms: string;
  flagship?: boolean;
  /** Горящий бейдж на карточке (например «Последние две квартиры») */
  badgeLabel?: string;
  description?: string;
};

export const STATUS_LABEL: Record<ObjectStatus, string> = {
  sales: "Идут продажи",
  soon: "Скоро старт",
  done: "Сдан",
};

const OBJECTS_RAW: Omit<RealtyObject, "layouts">[] = [
  {
    slug: "dyusenova-304",
    name: "Дюсенова, 304",
    district: "ул. Дюсенова",
    status: "done",
    tagline: "Сдан, свободных квартир нет.",
    description: "Флагманский объект Malaysary Invest — шестиэтажный кирпичный дом с закрытой территорией, собственными гаражами и благоустроенным двором. Стены 62 см, пятикамерные окна, бесшумные лифты.",
    image: `/${encodeURIComponent("Дюсенова 304.webp")}`,
    gallery: [
      `/${encodeURIComponent("Дюсенова 304.webp")}`,
      ...["IMG_1324", "IMG_1325", "IMG_1326", "IMG_1327", "IMG_1328", "IMG_1334", "IMG_1335", "IMG_1338", "IMG_1339"].map(
        (name) => `/${encodeURIComponent("Дюсенова 304")}/${name}.webp`
      ),
    ],
    floors: 6,
    apartments: 40,
    priceFrom: "",
    deadline: "IV кв. 2026",
    rooms: "1–3 комнаты",
    flagship: true,
  },
  {
    slug: "dyusenova-306",
    name: "Дюсенова, 306",
    district: "ул. Дюсенова",
    status: "done",
    tagline: "Сдан, свободных квартир нет.",
    description: "Семиэтажный комплекс с просторными планировками, панорамными окнами и закрытой территорией. Отдельный паркинг на каждую квартиру.",
    image: `/${encodeURIComponent("Дюсенова 306.webp")}`,
    gallery: [
      `/${encodeURIComponent("Дюсенова 306.webp")}`,
      ...["IMG_1329", "IMG_1330", "IMG_1331", "IMG_1332", "IMG_1333", "IMG_1336", "IMG_1337"].map(
        (name) => `/${encodeURIComponent("Дюсенова 306")}/${name}.webp`
      ),
    ],
    floors: 7,
    apartments: 58,
    priceFrom: "",
    deadline: "II кв. 2027",
    rooms: "1–4 комнаты",
  },
  {
    slug: "gorkogo-46",
    name: "Горького, 46",
    district: "ул. Горького",
    status: "sales",
    badgeLabel: "Последние две квартиры",
    tagline: "5-ти этажный дом бизнес класса.",
    description: "В свободной планировке 2-х и 3-х комнатные квартиры. Цена: 500 тысяч за кв.м.",
    image: `/${encodeURIComponent("Горького.webp")}`,
    gallery: [
      `/gorgogo47/${encodeURIComponent("Полный фасад территории")}/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.png`,
      `/gorgogo47/${encodeURIComponent("Полный фасад территории")}/884b9cde6abe5acff6acdca51ff98611_01bb4eba-a93d-4e21-b418-5b7cc51b79ab.png`,
      `/gorgogo47/${encodeURIComponent("Полный фасад территории")}/19086718317f3e5a196967033b163ebf_27ece1ff-b826-4aa3-9941-763ce558d334.png`,
      `/gorgogo47/${encodeURIComponent("Полный фасад территории")}/5b43565591a74ce208225cb74fbb6926_470adef1-f7ee-44e0-b9e5-db7788e4f2fc.png`,
      `/gorgogo47/${encodeURIComponent("Полный фасад территории")}/7b3aef5a98199018116dfc82b023f7da_930f09ae-5722-462a-8880-2d498132476d.png`,
      `/gorgogo47/${encodeURIComponent("Полный фасад территории")}/88b321f5ceeecb55f2d35ed2598c3e2f_65567578-29b5-45e8-8456-a1ea24bed0e0.png`,
      `/gorgogo47/${encodeURIComponent("Входная дверь, внутрянка")}/124ff09e7dc6c177fbe814461e08cdf1_db043c37-390e-4974-9f33-d8e943653299.png`,
      `/gorgogo47/${encodeURIComponent("Входная дверь, внутрянка")}/4adedb6da6327883ce2ea4f732eb86fd_6a83d1d0-68a8-4c80-833c-98dfff0b3088.png`,
      `/gorgogo47/${encodeURIComponent("Входная дверь, внутрянка")}/a1363237a0b8e8b582fb3403ecdb66ff_3ea6281a-adc0-4b89-841f-70f6c62204d0.png`,
      `/gorgogo47/${encodeURIComponent("Гаражи")}/3af31198-00f7-4aae-96c6-180b7fef755e.png`,
      `/gorgogo47/${encodeURIComponent("Гаражи")}/add4057e-4477-40dd-8129-be50c97bb335.png`,
      `/gorgogo47/${encodeURIComponent("Детская площадка")}/298ff71b-9791-4543-b9ba-5d14ff3673e5.png`,
      `/gorgogo47/${encodeURIComponent("Детская площадка")}/7fb8c7fc7dfcce22f1016d28564b9403_80a5003a-f79f-4372-acd2-039bc6caeaaa.png`,
    ],
    videos: [
      "/gorgogo47/Video/20ccb794aeb21275b8d983568c44db6f_4b08d00e-d854-4fc9-9e76-9307d767f9df.mp4",
      "/gorgogo47/Video/6a5922b7df7d8dd64b6d999a1af6a1a8_33eb0e04-68e5-4d3b-907e-c07ab5e89392.mp4",
      "/gorgogo47/Video/7cbc54e11cdc649419b66c9ec647ce4d_0342ec69-5c9f-4a10-8d95-0db641b803c5.mp4",
      "/gorgogo47/Video/8e979b8925467381f0e1b5eaa82a9948_0a55c949-cf63-4bb5-b0a8-589300d6ed64.mp4",
    ],
    floors: 5,
    apartments: 32,
    priceFrom: "500 000 ₸/м²",
    deadline: "III кв. 2026",
    rooms: "52–57 м²",
  },
  {
    slug: "estaya-90",
    name: "Естая, 90",
    district: "ул. Естая",
    status: "sales",
    tagline: "6-ти этажный дом бизнес класса.",
    description: "Коммерческие помещения: цокольный и первый этаж (цена: 550 тысяч за кв.м). Квартиры в планировках 2-х комнатные (цена: 450 тыс за кв.м).",
    image: `/${encodeURIComponent("Естая 90 (2).webp")}`,
    gallery: [
      `/${encodeURIComponent("Естая 90 (2).webp")}`,
    ],
    floors: 6,
    apartments: 84,
    priceFrom: "от 450 000 ₸/м²",
    deadline: "IV кв. 2026",
    rooms: "65–84 м²",
  },
  {
    slug: "bekturova-348",
    name: "Бектурова, 348",
    district: "ул. Бектурова",
    status: "sales",
    tagline: "12-ти этажный дом комфорт класса, 1-но подъездный.",
    description: "Цена: 350 тысяч тенге за кв.м. Коммерческие помещения на первом и втором этажах (цена: 400 тысяч за кв.м).",
    image: `/${encodeURIComponent("Бектурова 348.webp")}`,
    gallery: [
      `/${encodeURIComponent("Бектурова 348.webp")}`,
      `/${encodeURIComponent("348 бектурова")}/44.png`,
      `/${encodeURIComponent("348 бектурова")}/55.png`,
      `/${encodeURIComponent("348 бектурова")}/6.png`,
      `/${encodeURIComponent("348 бектурова")}/7.png`,
    ],
    videos: [
      `/${encodeURIComponent("348 бектурова")}/2.mp4`,
      `/${encodeURIComponent("348 бектурова")}/4.mp4`,
      `/${encodeURIComponent("348 бектурова")}/5.mp4`,
    ],
    floors: 12,
    apartments: 46,
    priceFrom: "от 350 000 ₸/м²",
    deadline: "IV кв. 2026",
    rooms: "35–44 м²",
  },
  {
    slug: "bekturova-356",
    name: "Бектурова, 356",
    district: "ул. Бектурова",
    status: "sales",
    tagline: "П-образный 5-ти подъездный 9-ти этажный дом комфорт класса.",
    description: "Цена: 300 тысяч за кв.м.",
    image: `/${encodeURIComponent("Бектурова 356.webp")}`,
    gallery: [
      `/${encodeURIComponent("Бектурова 356.webp")}`,
      `/${encodeURIComponent("Бектурова 356")}/10.png`,
      `/${encodeURIComponent("Бектурова 356")}/15.png`,
      `/${encodeURIComponent("Бектурова 356")}/18.png`,
      `/${encodeURIComponent("Бектурова 356")}/20.png`,
      `/${encodeURIComponent("Бектурова 356")}/24.png`,
      `/${encodeURIComponent("Бектурова 356")}/hf_20260616_163945_a4602a1f-ca26-4d7c-a86f-48d1d2629e77.png`,
    ],
    floors: 9,
    apartments: 72,
    priceFrom: "300 000 ₸/м²",
    deadline: "IV кв. 2027",
    rooms: "38–89 м²",
  },
];

export const OBJECTS = (t: (key: string) => string): RealtyObject[] => OBJECTS_RAW.map((obj) => {
  // Translate the data
  const i18nKey = obj.slug.replace("-", "_");
  return {
    ...obj,
    district: t(`obj.${i18nKey}.district`) || obj.district,
    tagline: t(`obj.${i18nKey}.tagline`) || obj.tagline,
    description: t(`obj.${i18nKey}.description`) || obj.description,
    badgeLabel: obj.badgeLabel ? (t(`obj.${i18nKey}.badge`) || obj.badgeLabel) : undefined,
    rooms: t(`obj.${i18nKey}.rooms`) || obj.rooms,
    layouts: LAYOUTS_BY_SLUG[obj.slug],
  };
});
