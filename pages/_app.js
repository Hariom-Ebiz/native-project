import "@/styles/globals.css";
import "react-circular-progressbar/dist/styles.css";
import { useSelector, useDispatch } from "react-redux";
import { wrapper } from "../store/store";
import useRequest from "@/hooks/useRequest";
import { useCallback, useEffect, useRef } from "react";
import { updateSetting } from "@/store/siteSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/loading/loading";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";

// styles >>>>>>>>>>>
import "@/public/css/bootstrap.min.css";
import "@/public/css/font-awesome.min.css";
import "@/public/css/ionicons.min.css";
import "@/public/css/animation.css";
import "@/public/css/style.css";
import "@/public/css/dashboard.css";
import "@/public/css/responsive.min.css";
import "@/public/css/responsive.css";
import "@/public/css/dashboard-responsive.css";

import useParallel from "@/hooks/useParallel";
import { useRouter } from "next/router";
import GlobalModal from "@/components/modal/GlobalModal";
import AlertModel from "@/components/modal/AlertModal";
import { appWithTranslation } from 'next-i18next';

const App = ({ Component, pageProps }) => {
  const { asPath } = useRouter();
  const router = useRouter();

  const { authenticate, getSettings } = useParallel();
  const { loggedIn, role } = useSelector((store) => store.auth);
  const { loading, modalData } = useSelector((store) => store.site);

  const scrollPositions = useRef({});
  // const isBack = useRef(false);

  useEffect(() => {
    getSettings();
    authenticate();
  }, []);

  // useEffect(() => {
  // window.scrollTo(0, 0);
  // }, [asPath]);

  useEffect(() => {
    // router.beforePopState(() => {
    //   isBack.current = true;
    //   return true;
    // });

    const onRouteChangeStart = () => {
      //   console.log("in");
      if (router.pathname == "/course") {
        const url = router.pathname;

        scrollPositions.current[url] = window.scrollY;
      }
    };

    const onRouteChangeComplete = (url) => {
      if (true && scrollPositions.current[url]) {
        window.scroll({
          top: scrollPositions.current[url],
          behavior: "auto",
        });
      }

      // isBack.current = false;
    };

    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router]);

  const navigateAfterLogin = useCallback(
    (isProtected) => {
      if (loggedIn && isProtected === false) {
        if (role === 1) {
          router.replace("/job-seeker/edit-cv/step1");
        }
      }
    },
    [loggedIn, role]
  );

  if (loggedIn === null) {
    return;
  }

  if (loggedIn && pageProps.isProtected === false) {
    if (role === 1) {
      router.replace("/job-seeker/dashboard");
    } else if(role === 2) {
      router.replace("/employer/dashboard");
    } else {
      return;
    }
  }

  if (loggedIn === false && pageProps.isProtected === true) {
    router.replace("/login");
    return;
  }

  return (
    <>
      <Head>
        <title>Native</title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URI}${asPath}`}
        />
      </Head>
      {loading && <Loading />}
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
      <GlobalModal />
      <AlertModel />
    </>
  );
};


export default wrapper.withRedux(appWithTranslation(App));
