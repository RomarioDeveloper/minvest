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
  layouts?: string[];
  floors: number;
  apartments: number;
  priceFrom: number;
  deadline: string;
  rooms: string;
  flagship?: boolean;
  description?: string;
};

export const STATUS_LABEL: Record<ObjectStatus, string> = {
  sales: "Идут продажи",
  soon: "Скоро старт",
  done: "Сдан",
};

export const OBJECTS: RealtyObject[] = [
  {
    slug: "dyusenova-304",
    name: "Дюсенова, 304",
    district: "ул. Дюсенова",
    status: "sales",
    tagline: "Закрытый двор, гаражи и детская площадка.",
    description: "Флагманский объект Malaysary Invest — шестиэтажный кирпичный дом с закрытой территорией, собственными гаражами и благоустроенным двором. Стены 62 см, трёхкамерные окна, бесшумные лифты.",
    image: "/photos/exterior/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.webp",
    gallery: [
      "/photos/exterior/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.webp",
      "/photos/exterior/884b9cde6abe5acff6acdca51ff98611_01bb4eba-a93d-4e21-b418-5b7cc51b79ab.webp",
      "/photos/exterior/19086718317f3e5a196967033b163ebf_27ece1ff-b826-4aa3-9941-763ce558d334.webp",
      "/photos/entrance/4adedb6da6327883ce2ea4f732eb86fd_6a83d1d0-68a8-4c80-833c-98dfff0b3088.webp",
      "/photos/entrance/a1363237a0b8e8b582fb3403ecdb66ff_3ea6281a-adc0-4b89-841f-70f6c62204d0.webp",
    ],
    floors: 6,
    apartments: 40,
    priceFrom: 18,
    deadline: "IV кв. 2026",
    rooms: "1–3 комнаты",
    flagship: true,
    layouts: [
      "/photos/exterior/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.webp",
      "/photos/exterior/884b9cde6abe5acff6acdca51ff98611_01bb4eba-a93d-4e21-b418-5b7cc51b79ab.webp"
    ]
  },
  {
    slug: "dyusenova-306",
    name: "Дюсенова, 306",
    district: "ул. Дюсенова",
    status: "sales",
    tagline: "Кирпичные секции у городского парка.",
    description: "Семиэтажный комплекс с просторными планировками, панорамными окнами и закрытой территорией. Отдельный паркинг на каждую квартиру.",
    image: "/photos/exterior/19086718317f3e5a196967033b163ebf_27ece1ff-b826-4aa3-9941-763ce558d334.webp",
    gallery: [
      "/photos/exterior/19086718317f3e5a196967033b163ebf_27ece1ff-b826-4aa3-9941-763ce558d334.webp",
      "/photos/exterior/d8acdf54501cf768e20eb02848d822ff_12e5751c-a425-49cf-87ad-b55f03a90aca.webp",
      "/photos/exterior/9e27ad1b2a6e559311e9cd2f31399cf3_b0eec14a-5300-487a-9855-d69b9226e8a6.webp",
      "/photos/entrance/124ff09e7dc6c177fbe814461e08cdf1_db043c37-390e-4974-9f33-d8e943653299.webp",
    ],
    floors: 7,
    apartments: 58,
    priceFrom: 21,
    deadline: "II кв. 2027",
    rooms: "1–4 комнаты",
  },
  {
    slug: "gorkogo-46",
    name: "Горького, 46",
    district: "ул. Горького",
    status: "soon",
    tagline: "5-ти этажный дом бизнес класса.",
    description: "В свободной планировке 2-х и 3-х комнатные квартиры. Цена: 500 тысяч за кв.м.",
    image: `/gorgogo47/${encodeURIComponent("Полный фасад территории")}/41b6768d010586018f82b0599388ee87_f00633db-fee7-4294-afb1-8f5249c41033.png`,
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
    priceFrom: 26,
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
    image: "/photos/exterior/9e27ad1b2a6e559311e9cd2f31399cf3_b0eec14a-5300-487a-9855-d69b9226e8a6.webp",
    gallery: [
      "/photos/exterior/9e27ad1b2a6e559311e9cd2f31399cf3_b0eec14a-5300-487a-9855-d69b9226e8a6.webp",
      "/photos/exterior/88b321f5ceeecb55f2d35ed2598c3e2f_65567578-29b5-45e8-8456-a1ea24bed0e0.webp",
      "/photos/exterior/7b3aef5a98199018116dfc82b023f7da_930f09ae-5722-462a-8880-2d498132476d.webp",
      "/photos/entrance/2291e420cae69caf3fb8d5c47741aa85_a6f3a6e6-6c07-4834-9010-0d98b177e589.webp",
    ],
    floors: 6,
    apartments: 84,
    priceFrom: 29.25,
    deadline: "IV кв. 2026",
    rooms: "65–84 м²",
  },
  {
    slug: "bekturova-348",
    name: "Бектурова, 348",
    district: "ул. Бектурова",
    status: "done",
    tagline: "12-ти этажный дом комфорт класса, 1-но подъездный.",
    description: "Цена: 350 тысяч тенге за кв.м. Коммерческие помещения на первом и втором этажах (цена: 400 тысяч за кв.м).",
    image: "/photos/exterior/da54d15b01f2b830a33dabea43642029_7cbfc151-4e98-4a94-953b-af8989eb8808.webp",
    gallery: [
      "/photos/exterior/da54d15b01f2b830a33dabea43642029_7cbfc151-4e98-4a94-953b-af8989eb8808.webp",
      "/photos/exterior/e23826c868683d844315d08a53909223_83fd141d-ecd7-429b-a381-4be2128c94c5.webp",
      "/photos/exterior/a0bdbfa78d0e9e9bce4ba5c27047fa61_8f7602db-e457-4bc3-896b-ce929391456f.webp",
      "/photos/entrance/d6587687f251d8f849ca3ba835a3222a_d52a0412-7d34-4a89-bce4-e879edc3176f.webp",
    ],
    floors: 12,
    apartments: 46,
    priceFrom: 12.25,
    deadline: "IV кв. 2026",
    rooms: "35–44 м²",
  },
  {
    slug: "bekturova-356",
    name: "Бектурова, 356",
    district: "ул. Бектурова",
    status: "soon",
    tagline: "П-образный 5-ти подъездный 9-ти этажный дом комфорт класса.",
    description: "Цена: 300 тысяч за кв.м.",
    image: "/photos/exterior/dd54c08850a98fb706a805585bb226ca_591ee229-3407-4d4a-a44e-e3e9afb8ac00.webp",
    gallery: [
      "/photos/exterior/dd54c08850a98fb706a805585bb226ca_591ee229-3407-4d4a-a44e-e3e9afb8ac00.webp",
      "/photos/exterior/34e8b126450f03bc75749cc86655fcde_349e2f67-d696-46a3-bc65-64445557ea36.webp",
      "/photos/exterior/d35e2dd9ea5b85af4ae941f145210ab0_e67ec5ac-c3ee-4941-b36f-1902f98521b0.webp",
      "/photos/entrance/422c2379d3a72933141ee994111a4737_f4686fd9-d09d-4c10-9247-7df1ea38d088.webp",
    ],
    floors: 9,
    apartments: 72,
    priceFrom: 11.4,
    deadline: "IV кв. 2027",
    rooms: "38–89 м²",
  },
];
