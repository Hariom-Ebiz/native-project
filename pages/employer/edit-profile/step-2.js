import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { createAxiosCookies } from "@/fn";
import styles from "../../../styles/edit-profile.module.css";
import EditProfileTopBar from "@/components/jobSeeker/EditProfileTopBar";

///

import { FileUploader } from "react-drag-drop-files";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { useSelector } from "react-redux";
import { countriesData } from "@/services/jobSeeker/profile";
import useRequest from "@/hooks/useRequest";
import { getCities } from "@/services/other";
import Loading from "@/components/loading/loading";
import { useDispatch } from "react-redux";
import { updateCompanyProfile } from "@/store/authSlice";
import { employeeNumbers, jobCategory, jobIndustry } from "@/services/master";
import { toast } from "react-toastify";
import useLeavePageConfirmation from "@/hooks/useLeavePageConfirmation";

const fileTypes = ["JPG", "PNG", "GIF"];

const EditProfileStep1 = ({countries, jobIndustry, employees}) => {
  const {pageChangeRef, setPageChangeRef} = useLeavePageConfirmation();
  const dispatch = useDispatch()
  const route = useRouter();
  const [dates, setDates] = useState([]);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [years, setYears] = useState([]);

  
  const { companyProfile } = useSelector((store) => store.auth);
  
  const [areaVal, setAreaVal] = useState(companyProfile?.area);
  const [cityList, setCities] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const { request: requestCity, response: responseCity } = useRequest();
  const { request: requestArea, response: responseArea } = useRequest();
  const { request, response } = useRequest();
  const [isLoading, setIsLoading] = useState(false)

  let founded = companyProfile?.founded;
  const [date, setDate] = useState(founded ? new Date(founded).getDate() : "" );
  const [month, setMonth] = useState(founded ? new Date(founded).getMonth() : "");
  const [year, setYear] = useState(founded ? new Date(founded).getFullYear() : "");

  const [errors, setErrors] = useState({});
  const [otherIndustryActive, setOtherIndustryActive] = useState(false);

  const {from_profile} = route.query;

    
  const handleChange = (e) => {
    if (!pageChangeRef) {
      setPageChangeRef(true);
    }
  };
// /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
  const checkWebUrl = (str) => {
    if (str.match(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)?\/?$/)) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (companyProfile?.country) {
      requestCity("GET", `master/cities?country=${companyProfile?.country}`);
    }

    if (companyProfile?.city) {
      requestArea("GET", `master/areas?country=${companyProfile?.city}`)
    }

    //create years
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1970; i <= currentYear; i++) {
      years.push(i);
    }
    setYears(years)

    const dropDates = [];
    for (let i = 1; i <= 31; i++) {
      dropDates.push(i);
    }
    setDates(dropDates)

    if (companyProfile?.industry == "other") {
      setOtherIndustryActive(true);
    }

  }, [])

  const countrySelectedHandler = (data) => {
    if (data) {
      requestCity("GET", `master/cities?country=${data}`);
      if (data == companyProfile.country) {
        requestArea("GET", `master/areas?city=${companyProfile.city}`);
      }
    }
  };

  useEffect(() => {
    if (responseCity && responseCity.status) {
      setCities(responseCity?.list);
      setAreaList([])
    }
  }, [responseCity]);


  // check date is valid or not


  function isValidDate(year, month, day) {
      const date = new Date(year, month, day);
      return (
          date.getFullYear() == year &&
          date.getMonth() == month &&
          date.getDate() == day
      );
  }

  async function handleSubmit() {
    try {
      const newErrors = {};

      const validateFields = ["company_name","country","city","employee","industry","other_industry","website","area"];
      if (areaVal == "other") {
        validateFields.push("other_area")
      }
      setIsLoading(true)
      const getInputs = document.getElementsByClassName("form-group");
      let formData = new FormData();

      formData.append("id", companyProfile?.id)

      const getWebInput = document.getElementById("web_url");
      if (getWebInput && getWebInput.value) {
        if (!checkWebUrl(getWebInput.value)) {
          setIsLoading(false)
          newErrors.website = "Please enter a valid Website URL.";
        }
      }

      if (date && month && year) {
        if(isValidDate(year, month, date)) {
          formData.append("founded", `${year}/${parseInt(month)+1}/${date}`)
         
        } else {
          newErrors.foundation = "Founded date is not valid."
        }
      } else {
        newErrors.foundation = "Foundation date is required."
      }

      for await (const i of getInputs) {
        if (i.querySelector("input")) {
          if (i.querySelector("input").name) {
            if (validateFields.includes(i.querySelector("input").name) && !i.querySelector("input").value) {
              newErrors[i.querySelector("input").name] = "This field is required."
            } else {
              formData.append(i.querySelector("input").name, i.querySelector("input").value)
            }
          }
            
        } else if(i.querySelector("select")) {
          if (i.querySelector("select").name) {
            if (validateFields.includes(i.querySelector("select").name) && !i.querySelector("select").value) {
              newErrors[i.querySelector("select").name] = "This field is required."
            } else {
              formData.append(i.querySelector("select").name, i.querySelector("select").value)
            }
          }
            
        }
      }

      setErrors(newErrors);
      if(Object.keys(newErrors).length === 0) {
        setPageChangeRef(false)
        request("PUT", "company/profile", formData);
      } else {
        setIsLoading(false)
        return false;
      }
      
    } catch (error) {
      setIsLoading(false)
      alert(new Error(error).message)
    }
  }

  //on form submission

  useEffect(() => {
    if (response && response.status) {
      dispatch(updateCompanyProfile(response.updatedData))
      toast.success("Profile is updated successfully.")
      route.push("/employer/edit-profile/step-3")
      
    }
    setIsLoading(false);

  }, [response])

  const citySelectedHandler = (data) => {
      if (data) {
          requestArea("GET", `master/areas?city=${data}`);
      }
  };

  useEffect(() => {
      if (responseArea && responseArea.status) {
          setAreaList(responseArea?.list);
      }
  }, [responseArea]);

  return (
    <>
      {
        (isLoading) ? <Loading /> : ""
      }
      
      <EmployerAuth data={{ data: "Company profile" }} />

      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className={styles.applicant_details_head}>
            <div className={styles.applicant_details_text}>
              <a href="#!" className={styles.applicant_details_heading} onClick={() => route.back()}  style={{cursor: "pointer"}}>
                <span className={styles.LeftarrowIcon} style={{"cursor": "pointer"}}>
                  <svg
                    width="28"
                    height="24"
                    viewBox="0 0 28 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.666504 12C0.666504 11.0795 1.4127 10.3333 2.33317 10.3333H25.6665C26.587 10.3333 27.3332 11.0795 27.3332 12C27.3332 12.9205 26.587 13.6666 25.6665 13.6666H2.33317C1.4127 13.6666 0.666504 12.9205 0.666504 12Z"
                      fill="#25324B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.15466 10.8215C1.80553 10.1706 2.86081 10.1706 3.51168 10.8215L13.5117 20.8215C14.1626 21.4723 14.1626 22.5276 13.5117 23.1785C12.8608 23.8294 11.8055 23.8294 11.1547 23.1785L1.15466 13.1785C0.503785 12.5276 0.503785 11.4723 1.15466 10.8215Z"
                      fill="#25324B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.5117 0.821468C14.1626 1.47234 14.1626 2.52762 13.5117 3.17849L3.51168 13.1785C2.86081 13.8294 1.80553 13.8294 1.15466 13.1785C0.503785 12.5276 0.503785 11.4723 1.15466 10.8215L11.1547 0.821468C11.8055 0.170594 12.8608 0.170594 13.5117 0.821468Z"
                      fill="#25324B"
                    />
                  </svg>
                </span>
                Edit your Company Profile
              </a>
            </div>
          </div>

          <EditProfileTopBar />

          <div className={styles.EditProfileStepContent}>


            <div className="row">
              <div className="col-md-4 col-sm-4">
                <div className={styles.company_profile_edit}>
                  <h3 className={styles.company_profile_heading}>
                    Company Details
                  </h3>
                  <p className={styles.company_profile_description}>Provide a concise overview of your company's core information
                  </p>
                </div>

              </div>

              <div className="col-md-8 col-sm-8">
                <div className={styles.uploadImgBlockPreant}>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>Company Name<span className="text-danger">*</span></label>
                        <input 
                          onChange={(e)=> {
                            handleChange(e)
                            // dispatch(updateCompanyProfile( { ...companyProfile, "company_name_dup": e.target.value }))
                          }} 
                      type="text" className={styles.form_control} name="company_name" defaultValue={companyProfile?.company_name_dup ?? companyProfile?.company_name} placeholder="Company name" />
                        {errors.company_name && <span className="text-danger">{errors.company_name}</span>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>Website<span className="text-danger">*</span></label>
                        <input 
                          onChange={(e)=> {
                            handleChange(e)
                          }} 
                          type="text" className={styles.form_control} name="website" id="web_url" defaultValue={companyProfile?.website} placeholder="Website URL" required={true} />
                          {errors.website && <span className="text-danger">{errors.website}</span>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>Country<span className="text-danger">*</span></label>
                        <select className={`${styles.form_control} ${styles.steps_form_select}`} name="country" 
                        required={true}
                        onChange={(e) => {handleChange(e); countrySelectedHandler(e.target.value)}}
                        >
                          {
                            countries?.map(m => (
                              <option value={m.id} selected={m.id == companyProfile?.country} >{m.name}</option>
                            ))
                          }
                          
                        </select>
                        {errors.country && <span className="text-danger">{errors.country}</span>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>City<span className="text-danger">*</span></label>
                        <select className={`${styles.form_control} ${styles.steps_form_select}`} name="city"
                        onChange={(e)=> {
                            handleChange(e);
                            citySelectedHandler(e.target.value)
                          // dispatch(updateCompanyProfile( { ...companyProfile, "city": e.target.value }))
                        }} 
                        >
                          <option value="">Select city</option>
                          {
                            cityList?.map(m => (
                              <option value={m.id} selected={m.id == companyProfile?.city} >{m.name}</option>
                            ))
                          }
                        </select>
                        {errors.city && <span className="text-danger">{errors.city}</span>}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>Area<span className="text-danger">*</span></label>
                        <select className={`${styles.form_control} ${styles.steps_form_select}`} name="area"
                        onChange={(e)=> {
                            handleChange(e)
                            setAreaVal(e.target.value)
                          // dispatch(updateCompanyProfile( { ...companyProfile, "city": e.target.value }))
                        }} 
                        >
                          <option value="">Select Area</option>
                          {
                            areaList.map(d => (
                              <option value={d.id} selected={companyProfile.area == d.id}>{d.name}</option>
                            ))
                          }
                          <option value="other" selected={companyProfile.area == "other"}>Other</option>
                          
                        </select>
                        {errors.area && <span className="text-danger">{errors.area}</span>}
                      </div>
                    </div>

                    {
                      areaVal == "other" && (
                        <div className="col-12">
                          <div className="form-group">
                            <label className={styles.form_label}>Other Area<span className="text-danger">*</span></label>
                            <input 
                              onChange={(e)=> {
                                handleChange(e)
                                // dispatch(updateCompanyProfile( { ...companyProfile, "company_name_dup": e.target.value }))
                              }} 
                              type="text" className={styles.form_control} name="other_area" defaultValue={companyProfile?.other_area} placeholder="Enter your area" />
                              {errors.other_area && <span className="text-danger">{errors.other_area}</span>}
                          </div>
                        </div>
                      )
                    }

                    <div className="col-12">

                      <div className="row">

                        <div className="col-sm-6">
                          <div className="form-group">
                            <label className={styles.form_label}>Number of Employees<span className="text-danger">*</span></label>
                            <select className={`${styles.form_control} ${styles.steps_form_select} ${styles.Arrow} `} name="employee"
                             onChange={(e)=> {
                              handleChange(e)
                              // dispatch(updateCompanyProfile( { ...companyProfile, "employee": e.target.value }))
                            }} 
                            >
                              <option value="">Select Employees</option>
                              {
                                employees?.map((e) => (
                                  <option value={e.id} selected={companyProfile?.employee == e.id}>{e.name}</option>
                                ))
                              }
                            </select>
                          {errors.employee && <span className="text-danger">{errors.employee}</span>}
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="form-group">

                            <label className={styles.form_label}>Industry<span className="text-danger">*</span></label>
                            <select className={`${styles.form_control} ${styles.steps_form_select} ${styles.Arrow}`} name="industry" 
                            onChange={(e) => {
                              handleChange(e);
                              // dispatch(updateCompanyProfile( { ...companyProfile, "industry": e.target.value }));
                              (e.target.value == "other") ? setOtherIndustryActive(true) : setOtherIndustryActive(false)}}
                            >
                              <option value="">Select industry</option>
                              {
                                jobIndustry?.map((i) => {
                                  return <option value={i.id} selected={companyProfile?.industry == i.id}>{i.name}</option>
                                })
                              }
                              <option value="other" selected={(companyProfile?.industry == "other") ? true : false}>Other</option>
                            </select>
                            {errors.industry && <span className="text-danger">{errors.industry}</span>}
                          </div>
                        </div>
                      </div>

                    </div>
                    {otherIndustryActive && (
                      <div className="col-12">
                        <div className="form-group">
                          <label className={styles.form_label}>Please specify other<span className="text-danger">*</span></label>
                          <input type="text" className={styles.form_control} name="other_industry" defaultValue={companyProfile?.other_industry} placeholder="Other industry"
                            onChange={(e)=> {
                            handleChange(e);
                            // dispatch(updateCompanyProfile( { ...companyProfile, "other_industry": e.target.value }))
                          }}
                            />
                          {errors.other_industry && <span className="text-danger">{errors.other_industry}</span>}
                        </div>
                      </div>
                    )}
                    <div className="col-12">

                      <div className="row">
                        <label className={styles.form_label}>Foundation Date<span className="text-danger">*</span></label>

                        <div className="col-sm-4">
                          <div className="form-group">
                            <select className={`${styles.form_control} ${styles.steps_form_select} ${styles.Arrow}`} onChange={(e) => {setDate(e.target.value); handleChange(e)}} required>
                              <option value="">Select date</option>
                              {
                                dates.map(m => (
                                  <option value={m} selected={date == m}>{m}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <select className={`${styles.form_control} ${styles.steps_form_select} ${styles.Arrow}`} onChange={(e) => {setMonth(e.target.value);handleChange(e);}}>
                              <option value={""}>Select month</option>
                              {
                                months.map((m, i) => (
                                  <option value={i} selected={month !== "" && month == i}>{m}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <select className={`${styles.form_control} ${styles.steps_form_select} ${styles.Arrow}`}onChange={(e) => {setYear(e.target.value);handleChange(e);}}>
                              <option value="">Select Year</option>
                              {
                                years.map(y => (
                                  <option value={y} selected={year == y}>{y}</option>
                                ))
                              }
                            </select>
                          </div>

                        </div>
                        {errors.foundation && <span className="text-danger">{errors.foundation}</span>}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className={styles.next_prev_btn}>
            <Link href='/employer/edit-profile/step-1'>
            
              <button className={`btn-primary  ${styles.next_btn}`}>
                Prev
              </button>
            </Link>
            {/* <Link href='/employer/edit-profile/step-3'> */}
              <button className={`btn-primary  ${styles.next_btn}`} onClick={() => handleSubmit()}>
                {(from_profile) ? "Update" : "Next step"}
              </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  createAxiosCookies(context);
  const getCountry = await countriesData();
  const industry = await jobIndustry();
  const employees = await employeeNumbers();
  return {
    props: {
      countries: getCountry,
      jobIndustry: industry,
      employees: employees,
      publicHeader: false,
      publicFooter: false,
    },
  };
}

export default EditProfileStep1;
