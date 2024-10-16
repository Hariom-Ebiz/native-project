import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { createAxiosCookies, getCookies } from "@/fn";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setAlertModal, setCompleteProfile, setCompleteProfileWarning, setModal, setSubscriptionWarning, unsetModal } from "@/store/siteSlice";
import { useSelector } from "react-redux";
import EmployerAuth from "@/components/layout/EmployerAuth";
import Styles from "@/styles/subscriptions.module.css";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import useRequest from "@/hooks/useRequest";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";
import { getMyMemberships } from "@/services/employer/subscriptions";

const staticMonth = [
  { option: "Jan", count: 0 },
  { option: "Feb", count: 0 },
  { option: "Mar", count: 0 },
  { option: "Apr", count: 0 },
  { option: "May", count: 0 },
  { option: "Jun", count: 0 },
  { option: "July", count: 0 },
  { option: "Aug", count: 0 },
  { option: "Sept", count: 0 },
  { option: "Oct", count: 0 },
  { option: "Nov", count: 0 },
  { option: "Dec", count: 0 },
];

const getDayTime = () => {
  const hour = new Date().getHours();
  console.log("hour : ", hour);
  let message = "";
  if (hour < 12) message = "Morning";
  else if (hour < 16) message = "Afternoon";
  else if (hour < 24) message = "Evening";

  return message;
}


const Dashboard = ({subscriptionList,totalUnlockCvQuantity}) => {
  console.log("totalUnlockCvQuantity",totalUnlockCvQuantity)
  const router = useRouter();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const { cvStep, role, companyProfile, firstName, is_subscriber, was_subscriber } = useSelector((store) => store.auth);
  let remaningUnlocked = companyProfile.unlock_qty;

  const { completeProfileWarning, subscriptionWarning } = useSelector((store) => store.site);
  const { request: requestDashboardData, response: responseDashboardData } = useRequest()

  const [fromDate, setFromDate] = useState(moment().startOf('month').format("YYYY/MM/DD"));
  const [toDate, setToDate] = useState(moment().endOf('month').format("YYYY/MM/DD"));
  const [cardsData, setCardsData] = useState({
    totalCandidatesToReview: 0,
    candidateHired: 0,
    openPositionsToFill: 0,
    remaningCvToUnlock: 0
  })

  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Total Candidates", "Unlocked", "Shortlisted", "Final Interview", "Hired"],
    },
    yaxis: {
      // tickAmount: 3,
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
  });

  const [Pioptions, setPiOptions] = useState({
    plotOptions: {
      pie: {
        donut: {
          size: '40%'
        }
      }
    },
    colors: [
      '#1E90FF', '#FF6347', '#32CD32', '#FFD700', '#8A2BE2', '#FF69B4', 
      '#20B2AA', '#FF4500', '#DA70D6', '#87CEEB', '#FF1493', '#00CED1'
    ],
    chart: {
      type: 'donut',
    },
    labels: ['A', 'B', 'C', 'D'],
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      // offsetX: 40
    }
  });


  const [applicantSummeryOptions, setApplicantSummeryOptions] = useState({
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    chart: {
      type: 'bar',
      stacked: true,
      stackType: '100%',
      toolbar: {
        show: false
      },
      offsetY: 0,
    },
    colors: ['#1E90FF', '#FF6347', '#32CD32', '#FFD700', '#8A2BE2', '#FF69B4'],
    dataLabels: {
      enabled: false, // Disable internal numbering
    },
    grid: {
      show: false,  // Removes all grid lines
    },
    yaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,  // Hides x-axis border
      },
      axisTicks: {
        show: false,  // Hides x-axis ticks
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,  // Hides x-axis border
      },
      axisTicks: {
        show: false,  // Hides x-axis ticks
      },

    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
    }
  })

  const [series, setSeries] = useState([
    {
      name: "Recruitment Funnel Statistics",
      data: [30, 40, 45, 50, 49],
    },
  ]);

  const [piSeries, setPiSeries] = useState([44, 55, 13, 33]);

  const [applicantSummerySeries, setApplicantSummerySeries] = useState([{
    name: 'Total Jobs',
    data: [0]
  }, {
    name: 'Saved',
    data: [0]
  }, {
    name: 'Open',
    data: [0]
  },{
    name: 'Under Review',
    data: [0]
  },{
    name: 'Hired',
    data: [0]
  },{
    name: 'Canceled',
    data: [0]
  }]);

  const filterData = async (from, to) => {
    requestDashboardData("get", `dashboard/get-employer-dashboard-data?from=${from}&to=${to}`)
  }

  function handleDateRange(start, end) {
    setToDate(end.format("YYYY/MM/DD"));
    setFromDate(start.format("YYYY/MM/DD"));
    filterData(start.format("YYYY/MM/DD"), end.format("YYYY/MM/DD"), 1)
  }

  useEffect(() => {
    requestDashboardData("get", `dashboard/get-employer-dashboard-data?from=${fromDate}&to=${toDate}`)
    if (role == 1) {
      router.replace("/job-seeker/dashboard")
    }

    if (companyProfile?.is_complete == 0 && !completeProfileWarning) {
      dispatch(
        setAlertModal(
          {
            content: "For best results please complete your Company Profile",
            imageUrl: "/img/error.png",
            buttonText: "Open Profile",
            buttonHref: "/employer/edit-profile/step-1"
          }
        )
      );
      dispatch(setCompleteProfileWarning(true))
    } else if (!is_subscriber && !subscriptionWarning) {
      dispatch(
        setAlertModal(
          {
            content: "Subscribe our plan For access all the Benefits.",
            imageUrl: "/img/error.png",
            buttonText: "Packages",
            buttonHref: (was_subscriber) ? "/employer/expansion-renewal" : "/employer/explore-our-packages"
          }
        )
      );
      dispatch(setSubscriptionWarning(true))
    }

  }, []);


  useEffect(() => {
    if (responseDashboardData) {
      const { status, message, data } = responseDashboardData;
      if (!status) {
        return;
      }

      if (!data) {
        setCardsData({
          totalCandidatesToReview: 0,
          candidateHired: 0,
          openPositionsToFill: 0,
          remaningCvToUnlock: 0
        })

        setSeries([
          {
            name: "Recruitment Funnel Statistics",
            data: [0, 0, 0, 0, 0],
          },
        ])

        setPiOptions({ ...Pioptions, labels: [] })
        setPiSeries([])
        setApplicantSummerySeries([{
          name: 'Total Jobs',
          data: [0]
        }, {
          name: 'Saved',
          data: [0]
        }, {
          name: 'Open',
          data: [0]
        },{
          name: 'Under Review',
          data: [0]
        },{
          name: 'Hired',
          data: [0]
        },{
          name: 'Canceled',
          data: [0]
        }])

        return;
      }

      const { totalUnlockedCVAnyTime,
        totalCandidates,
        totalCandidatesToReview,
        totalHiredCandidates,
        totalInterviewed,
        totalShortlisted,
        totalUnlocked,
        totalVacancies, categories,jobSummery } = data;

      const piLablesVals = [];
      const piSeriesVals = [];
      categories.forEach((category) => {
        piLablesVals.push(category.name);
        piSeriesVals.push(category.count);
      })

      setPiOptions({ ...Pioptions, labels: piLablesVals })
      setPiSeries(piSeriesVals)

      setCardsData({
        totalCandidatesToReview: totalCandidatesToReview,
        candidateHired: totalHiredCandidates,
        openPositionsToFill: Number(totalVacancies) - Number(totalHiredCandidates),
        remaningCvToUnlock: Math.max(Number(totalCandidates) - Number(totalUnlockedCVAnyTime), 0)
      })

      setSeries([
        {
          name: "Recruitment Funnel Statistics",
          data: [Number(totalCandidates), Number(totalUnlocked), Number(totalShortlisted), Number(totalInterviewed), Number(totalHiredCandidates)],
        },
      ])

      setApplicantSummerySeries([{
        name: 'Total Jobs',
        data: [jobSummery.totalJobs]
      }, {
        name: 'Saved',
        data: [jobSummery.savedJobs]
      }, {
        name: 'Open',
        data: [jobSummery.openJobs]
      },{
        name: 'Under Review',
        data: [jobSummery.underReview]
      },{
        name: 'Hired',
        data: [jobSummery.hired]
      },{
        name: 'Canceled',
        data: [jobSummery.closed]
      }])
    }
  }, [responseDashboardData])

  return (
    <>
      <EmployerAuth data={{ title: "Dashboard" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className="company_message">
            <div className="company_message_left">
              <h3 className="morning_text">{t("Good")} {t(getDayTime())}, {firstName}</h3>
              <p className="message_info">
                {t("Here is your job listings statistic report from")} {moment(fromDate).format("MMMM DD")} - {moment(toDate).format("MMMM DD")}.
              </p>
            </div>
            <div className="company_message_right">
              <DateRangePicker initialSettings={{ startDate: moment(fromDate).format("MM/DD/YYYY"), endDate: moment(toDate).format("MM/DD/YYYY") }} onCallback={(start, end) => handleDateRange(start, end)}>
                <input type="text" className="form-control col-4" />
              </DateRangePicker>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
              <a href="#">
                <div className="candidates_info">
                  <span className="review_number">{cardsData.totalCandidatesToReview}</span>
                  <div className="review_text">
                    {t("New Candidates to Review")}
                  </div>
                </div>
              </a>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
              <a href="#">
                <div className="candidates_info dash_box2">
                  <span className="review_number">{cardsData.candidateHired}</span>
                  <div className="review_text">{t("Candidates Hired")}</div>
                </div>
              </a>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
              <a href="#">
                <div className="candidates_info dash_box3">
                  <span className="review_number">{cardsData.openPositionsToFill}</span>
                  <div className="review_text">{t("Open Positions to Fill")}</div>
                </div>
              </a>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-3">
              <a href="#">
                <div className="candidates_info dash_box4">
                  <span className="review_number">{companyProfile.unlock_qty}</span>
                  <div className="review_text">{t("Number of Remaining CVs")}</div>
                </div>
              </a>
            </div>
          </div>

          <div className="row g-4 mt-0">
            <div className="col-sm-12 col-md-8 col-lg-8">
              <div className="inner_wrapper">
                <div className="card_selectReviBox">
                  <h3 className="card_reviewTitle">
                    {t("Recruitment Funnel Statistics")}{" "}
                    {/* <span>Showing Recruitment Funnel Statistics Jul 19-25</span> */}
                  </h3>

                </div>
                <div className="chart_wrapper" style={{ marginTop: "0px" }}>
                  {/* <img src="img/chart-1.png" alt="" /> */}
                  <ApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={350}
                  />

                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="inner_wrapper">
                <h3 className="box_heading">{t("Job Status Summary")}</h3>
                <div className="chart_wrapper" style={{ marginTop: "0px" }}>
                  <ApexChart
                    options={applicantSummeryOptions}
                    series={applicantSummerySeries}
                    type="bar"
                    height={"100%"}
                    width={"100%"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="job_wrapper">
            <div className="job_heading_box">
              <h3 className="box_heading">{t("Open Positions By Department")}</h3>
            </div>
            <div className="inner_wrapper">
              <div className="row g-4">
                {piSeries.length > 0 ? <ApexChart
                  options={Pioptions}
                  series={piSeries}
                  type="donut"
                  height={350}
                /> : <p>{t("No Data To Show")}</p>}
              </div>
            </div>
          </div>

          <div className="job_wrapper">
            <div className="job_heading_box">
              <h3 className="box_heading">{t("Membership Status")}</h3>
            </div>
            <div className={`table-responsive ${Styles.data_table}`} style={{border: "1px solid #d6ddeb"}}>
              <table className={`table mb-0`}>
                <thead>
                  <tr>
                    <th>{t("Package")}</th>
                    <th style={{ textAlign: "center" }}>{t("Start Date")}</th>
                    <th style={{ textAlign: "center" }}>{t("Expiry Date")}</th>
                    <th style={{ textAlign: "center" }}>{t("Validity(Months)")}</th>
                    <th style={{ textAlign: "center" }}>{t("Granted Unlocked CVs")}</th>
                    <th style={{ textAlign: "center" }}>{t("Remaining CVs to Unlock")}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    subscriptionList.filter(f => f.is_expire == "0").length <= 0 ?
                    (<tr><td colSpan={5} ><center>{t("No info. to display")}</center></td></tr>)
                    :
                    subscriptionList.filter(f => f.is_expire == "0").map(d => {
                      let val = 0;
                      
                      if(remaningUnlocked >= d.unlock_cv_qty){
                        val = d.unlock_cv_qty;
                        remaningUnlocked -= d.unlock_cv_qty;
                      } else {
                        val =  remaningUnlocked;
                        remaningUnlocked = 0;
                      }

                      return <tr>
                        <td style={{ textAlign: "left" }}>
                          {d.title}
                        </td>
                        <td style={{ textAlign: "center" }}>{moment(d.start).format("DD MMMM YYYY")}</td>
                        <td style={{ textAlign: "center" }}>{moment(d.end).format("DD MMMM YYYY")}</td>
                        <td style={{ textAlign: "center" }}>{moment(d.end).diff(moment(d.start), "months")}</td>
                        <td style={{ textAlign: "center" }}>{d.unlock_cv_qty}</td>
                        <td style={{ textAlign: "center" }}>{Math.max(val,0)}</td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const { lang } = getCookies(context);
  let lang_code = "en";
  const subscriptionList = await getMyMemberships();
  try {
    const language = JSON.parse(lang)

    lang_code = String(language.code).toLowerCase()
  } catch (error) {
    lang_code = "en"
  }

  const totalUnlockCvQuantity = subscriptionList.list.reduce((sum, d) => {
    sum += d.unlock_cv_qty;
    return sum;
  }, 0)

  return {
    props: {
      publicHeader: false,
      publicFooter: false,
      isProtected: true,
      subscriptionList: subscriptionList.list,
      totalUnlockCvQuantity,
      ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default Dashboard;
