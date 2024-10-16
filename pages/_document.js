'use client'
import { Html, Head, Main, NextScript } from "next/document";
import { useEffect } from "react"

export default function Document() {
  return (
    <Html id="lang_dir">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Native is a job portal website." />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/logo.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Karla:ital,wght@0,200..800;1,200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

        <script src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>

        {/* <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/> */}

        {/* Styles and fonts  */}
        {/* <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
        <link rel="stylesheet" href="css/font-awesome.css" />
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        <link rel="stylesheet" type="text/css" href="css/dashboard.min.css" />
        <link rel="stylesheet" type="text/css" href="css/dashboard.css" />
        <link rel="stylesheet" type="text/css" href="css/dashboard-responsive.css" />
        <link rel="stylesheet" type="text/css" href="css/responsive.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
        <link href="css/font-awesome.css" rel="stylesheet" />
        <link href="css/animation.css" rel="stylesheet" /> */}
      </Head>
      <body className="body_bg_color" id="body_lang_css" style={{overflowX: "hidden"}}>
        <Main />
        <NextScript />

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script defer src="/js/script.min.js"></script>

        <script defer src="/js/jquery-3.3.1.min.js"></script>
        <script defer src="/js/popper.min.js"></script>
        {/* <script defer src="/js/moment.min.js"></script> */}
        {/* <script src="/js/script.js"></script> */}

        <script defer src="/js/bootstrap.min.js"></script>
        <script defer src="/js/wow.min.js"></script>
      </body>
    </Html>
  );
}
