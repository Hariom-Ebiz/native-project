import React from "react";
import fs from "fs";

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const BASE_URL = {
    development: "http://192.168.235.245:4073",
    production: process.env.NEXT_PUBLIC_SITE_URI,
  }[process.env.NODE_ENV];

  const staticPages = fs
    .readdirSync("pages")
    .filter((staticPage) => {
      return ![
        "_app.js",
        "_document.js",
        "_error.js",
        "sitemap.xml.js",
        "index.js",
        "404.js",
        "email-send.js",
        "verify-email",
        "api",
        "employer",
        "job-seeker",
        "reset-password",
        "~gvf8AtP.tmp",
        
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${BASE_URL}/${staticPagePath}`;
    });


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        <url>
            <loc>https://nativessr.stage04.obdemo.com</loc>
            <lastmod>2023-09-12T14:34:22.194Z</lastmod>
        </url>
    
      ${staticPages
        .map((url) => {
          return `<url>
              <loc>${url.replace(".js", "")}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
            </url>`;
        })
        .join("")}
       
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
