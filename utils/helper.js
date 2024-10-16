import moment from "moment";
import { useState } from "react";
import { useRouter } from "next/router";

export const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
// const router = useRouter();

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const getTimeGap = (start, end) => {
  let month = moment(end).diff(moment(start), "month");
  let year = moment(end).diff(moment(start), "year");
  month = month - year * 12;
  return {
    month,
    year,
  };
};

export const timeGapYearMonth = (start, end) => {
  let obj = getTimeGap(start, end);
  let str = "";
  if (obj.year === 0 && obj.month === 0) {
    return "less than 1 month";
  }
  if (obj.year > 0) {
    if (obj.year > 1) {
      str += obj.year + " years";
    } else {
      str += obj.year + " year";
    }
    if (obj.month > 0) {
      str += ", ";
    }
  }
  if (obj.month > 0) {
    if (obj.month > 1) {
      str += obj.month + " months";
    } else {
      str += obj.month + " month";
    }
  }
  return str;
};

export const getLatestCompany = (list = []) => {
  let latest = {};

  for (let i = 0; i < list.length; i++) {
    console.log(">>>>>Asddd", list[i].job_title);
    let elem = list[i];
    if (elem?.is_currently_working == 1) {
      latest = elem;
      break;
    }
    if (moment(elem.end_date).valueOf() > moment(latest.end_date).valueOf()) {
      latest = elem;
    }
  }

  return latest;
};

export const getFirstLetterCapital = (str) => {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const scrollToThis = (id) => {
  let ele = document.getElementById(id);
  if (!ele) return;
  window.scrollTo(ele.offsetLeft, ele.offsetTop - 150);
};

export const getScreenWidth = () => {
  let width = window.screen.width;
  console.log("screen width = ", width);
  return width;
};

export const getShortText = (text) => {
  let width = getScreenWidth();
  if (width <= 575) {
    return text.split("-")[1] || text;
  } else {
    return text;
  }
};

export const routeChange = () => {
  const onRouteChangeStart = () => {
    const url = router.pathname;
    scrollPositions.current[url] = window.scrollY;
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
};

const freeEmailDomains = [
  "gmail.com", "yahoo.com", "hotmail.com", "aol.com", "hotmail.co.uk", "hotmail.fr", "msn.com", "yahoo.fr", "yahoo.com.br", "yahoo.co.in", "outlook.com", "live.com", "rediffmail.com", "free.fr", "gmx.de", "web.de", "ymail.com", "libero.it", "cox.net", "hotmail.it", "sbcglobal.net", "live.fr", "live.co.uk", "googlemail.com", "yahoo.es", "live.nl", "yahoo.it", "yahoo.de", "rocketmail.com", "att.net", "yahoo.in", "hotmail.es", "yahoo.ca", "yahoo.com.au", "hotmail.de", "yahoo.co.jp", "sky.com", "yahoo.com.ar", "yahoo.com.mx", "mail.com", "live.it", "yahoo.co.id", "live.com.au", "yahoo.com.sg", "aim.com", "live.ca", "mailinator.com"
];

export function isBusinessEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return false; // Invalid email format
  }
  
  const domain = email.split('@')[1];
  
  return !freeEmailDomains.includes(domain.toLowerCase());
}

export async function getTotalExperience(exp) {

  let month = 0;
  for await (const e of exp) {

      if (e.is_currently_working && !e.end_date) {
          let endDate = moment();
          let diff = endDate.diff(moment(e.start_date), "months");
          month += diff;
      } else {
        let endDate = moment(e.end_date);
        let diff = endDate.diff(moment(e.start_date), "months");
        month += diff;
      }
    
  }

  if (month < 0) {
    return {years: 0, months: 0}
  } else {

    let years = parseInt(month/12);
    let months = parseInt(month%12);
    return {years, months}
  }
}
// router.beforePopState(() => {
//   isBack.current = true;
//   return true;
// });
