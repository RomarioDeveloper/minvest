import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://minvest.kz";
  const lastModified = new Date();

  return [
    {
      url: `${base}/ru`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          ru: `${base}/ru`,
          kk: `${base}/kk`,
        },
      },
    },
    {
      url: `${base}/kk`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          ru: `${base}/ru`,
          kk: `${base}/kk`,
        },
      },
    },
  ];
}
