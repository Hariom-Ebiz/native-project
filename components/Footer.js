import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, UseSelector } from "react-redux";
import useRequest from "@/hooks/useRequest";
import { emailPattern } from "@/utils/helper";
import { toast } from "react-toastify";

const Footer = () => {
  const { setting } = useSelector((store) => store.site);
  const [footerData, setFooterData] = useState();
  const [emailForNewsletter, setEmailForNewsletter] = useState("");
  const [nlEmailError, setNlEmailError] = useState(null);
  const { request: footerReq, response: footerRes } = useRequest();
  const { request: newsLetterSubmitReq, response: newsLetterSubmitRes } =
    useRequest();
  useEffect(() => {
    footerReq("GET", "block/get-block/footer-page");
  }, []);
  useEffect(() => {
    if (footerRes && footerRes.status) {
      setFooterData(footerRes?.blocks);
    }
  }, [footerRes]);

  const handleSubmitNewsletterEmail = () => {
    setNlEmailError(null);
    if (!emailForNewsletter || !emailForNewsletter.match(emailPattern)) {
      setNlEmailError("Please provide a valid email address!");
      return;
    }
    newsLetterSubmitReq("POST", "newsletter", { email: emailForNewsletter });
  };

  useEffect(() => {
    if (newsLetterSubmitRes && newsLetterSubmitRes.status) {
      toast.success(newsLetterSubmitRes?.message);
      setNlEmailError(null);
      setEmailForNewsletter("");
    }
  }, [newsLetterSubmitRes]);
  return (
    <>
      <footer className="footer_wrapper">
        <div className="container">
          <div className="row">
            <div
              className="col-md-6 col-lg-4"
              dangerouslySetInnerHTML={{
                __html: footerData?.["footer-page"]?.description,
              }}
            />

            {/* <div className="footer-block">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  ut purus in nulla volutpat sagittis. Quisque in condimentum
                  justo. Aliquam sodales nec diam sit amet{" "}
                </p>
              </div>


            </div> */}
            <div className="col-md-6 col-lg-4">
              <ul className="footer-links footer-links-box ">
                <li>
                  {" "}
                  <Link href="/employer">Native </Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/#pricingsection">Pricing</Link>{" "}
                </li>
                <li>
                  {" "}
                  <a href="#">Community</a>{" "}
                </li>
                <li>
                  {" "}
                  <a href="#">Jobs</a>{" "}
                </li>
                <li>
                  {" "}
                  <Link href="/about-us">About Us</Link>{" "}
                </li>
              </ul>
            </div>
            <div className="col-md-12 col-lg-4">
              <ul className="footer-links mt-margin">
                <li>
                  <a href="#">Newsletter</a>
                </li>
                <li>
                  <div className="newsletter-form">
                    <div className="">
                      <div className="form-group relative-box">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Your email here"
                          value={emailForNewsletter}
                          onChange={(e) =>
                            setEmailForNewsletter(e.target.value)
                          }
                        />
                        <button
                          onClick={handleSubmitNewsletterEmail}
                          type="button"
                          className="footer_send_btn"
                        >
                          Send
                        </button>
                      </div>
                      {nlEmailError && (
                        <div className="invalid-feedback d-block">
                          {nlEmailError}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <div className="footer_border_copyright">
              <div className="row align-items-start">
                <div className="col-6 col-md-3 col-lg-3 col-xxl-4">
                  <p className="copyText">{setting?.copyright}</p>
                </div>
                <div className="col-6 col-md-3 col-lg-3 col-xl-4">
                  <ul className="copyright_footer_social">
                    <li onClick={() => {
                      window.open(setting?.facebook, '_blank')
                    }}>
                      <a href={setting?.facebook} target="__blank" rel="nofollow">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.9201 2.24H8.75008C8.47008 2.24 8.12008 2.31 8.12008 2.8V5.04H10.9201V7.28H8.12008V14H5.88008V7.28H3.08008V5.04H5.88008V3.08C5.88008 1.05 6.86008 0 8.75008 0H10.9201V2.24Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>

                    <li onClick={() => {
                      window.open(setting?.linkedin, '_blank')
                    }}>
                      <a href={setting?.linkedin} target="__blank" rel="nofollow">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.08 13.9306H0.07V4.27063H3.08V13.9306V13.9306ZM1.54 3.08062C0.63 3.08062 0 2.45063 0 1.61063C0 0.770625 0.63 0.140625 1.61 0.140625C2.59 0.140625 3.15 0.770625 3.15 1.61063C3.15 2.45063 2.59 3.08062 1.54 3.08062V3.08062ZM14 13.9306H10.99V8.61062C10.99 7.35062 10.57 6.51063 9.45 6.51063C8.61 6.51063 8.12 7.07063 7.91 7.63063C7.84 7.84063 7.84 8.12062 7.84 8.40062V13.9306H4.83V7.35063C4.83 6.16062 4.76 5.18063 4.76 4.27063H7.35L7.49 5.60063H7.56C7.98 4.97063 8.89 4.06062 10.5 4.06062C12.46 4.06062 13.93 5.39062 13.93 8.19062V13.9306H14Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                    <li onClick={() => {
                      window.open(setting?.twitter, '_blank')
                    }}>
                      <a href={setting?.twitter} target="__blank" rel="nofollow">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.6 4.13008V4.48008C12.6 8.26008 9.73 12.6701 4.41 12.6701C2.8 12.6701 1.26 12.1801 0 11.4101C0.21 11.4101 0.49 11.4801 0.7 11.4801C2.03 11.4801 3.29 10.9901 4.27 10.2201C3.01 10.2201 1.96 9.38008 1.61 8.26008C1.82 8.26008 1.96 8.33008 2.17 8.33008C2.45 8.33008 2.73 8.33008 2.94 8.26008C1.61 7.98008 0.7 6.86008 0.7 5.46008V5.39008C0.7 5.60008 1.47 5.74008 1.96 5.74008C1.19 5.25008 0.63 4.34008 0.63 3.36008C0.63 2.80008 0.77 2.31008 1.05 1.89008C2.45 3.64008 4.55 4.76008 7 4.90008C6.86 4.62008 6.79 4.41008 6.79 4.20008C6.79 2.59008 8.05 1.33008 9.66 1.33008C10.5 1.33008 11.2 1.68008 11.76 2.24008C12.39 2.10008 13.02 1.89008 13.58 1.54008C13.37 2.24008 12.88 2.80008 12.32 3.15008C12.88 3.08008 13.44 2.94008 14 2.73008C13.58 3.22008 13.16 3.71008 12.6 4.13008V4.13008Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-md-6 col-lg-6 col-xl-4">
                  <ul className="copyrightFooter">
                    <li>
                      <Link href="/terms-conditions">Terms & Conditions </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy">Privacy & Policy</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <a href="#" id="top-button" className="back_top">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 25"
            fill="none"
          >
            <mask
              id="mask0_511_55"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="25"
              height="25"
            >
              <rect
                x="0.5"
                y="0.25"
                width="24"
                height="24"
                fill="currentColor"
              />
            </mask>
            <g mask="url(#mask0_511_55)">
              <path
                d="M11.5 22.25V6.075L6.9 10.65L5.5 9.25L12.5 2.25L19.5 9.25L18.1 10.675L13.5 6.075V22.25H11.5Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </span>
      </a>
    </>
  );
};

export default Footer;
