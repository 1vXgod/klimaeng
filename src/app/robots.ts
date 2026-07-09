import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/llogaria", "/api", "/porosia"],
    },
    sitemap: "https://klimaeng.vercel.app/sitemap.xml",
  };
}
