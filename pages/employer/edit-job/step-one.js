import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import styles from "@/styles/post_a_job.module.css";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import { getCookies } from "@/fn";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";

const StepOne = ({setData, trackForm, country,city,getcity, getArea,area, category, jobType,validateStep, editData}) => {
   const { t } = useTranslation('common');
    const [selectLevel, setLevel] = useState(editData.career_level);
    const { request: requestCity, response: responseCity } = useRequest();
    const [selectedjob, setselectedjob] = useState(editData?.job_type);
    const [countryName, setCountryName] = useState("");
    const [cityName, setCityName] = useState("");
    const [areaName, setAreaName] = useState("");
    const [careerLevels, setCareerLevels] = useState([]);
    const {request: requestCareerLevel, response: responesCareerLevel} = useRequest();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
        reset,
        watch ,
        unregister,
        getValues,
        setValue,
        control 
      } = useFormContext();

      const [salaryselect, setsalaryselect] = useState("")
    
    const [selectedJobCategory, setSelectedJobCategory] = useState("")
    const [title, setTitle] = useState("")
    const [selectedCareerLevel, setselectedCareerLevel] = useState("")
    const [selectedArea, setSelectedArea] = useState("")

      let watchedPostType = watch('post_type');
          
      let selectedCareerLevelnew = watch('career_level');
      let selectedCurencynew = watch('salary_currency');
      let selectedJobTitle = watch("title");
      let jobCategory = watch("job_category");
      let selecetdArea = watch("area")

      useEffect(()=> {
        if(selectedCareerLevelnew){
            setselectedCareerLevel(selectedCareerLevelnew)
            if(careerLevels.length > 0){
                const d = careerLevels.find(d => d.id == selectedCareerLevelnew)
                setValue("career_name", d?.name)
            }
        }

        if (selectedCurencynew) {
            setsalaryselect(selectedCurencynew)
        }   

        if (selectedJobTitle) {
            setTitle(selectedJobTitle)
        }

        if (jobCategory) {
            setSelectedJobCategory(jobCategory)
        }

        if (selecetdArea) {
            setSelectedArea(selecetdArea)
        }
    
      },[selectedCareerLevelnew, selectedCurencynew, selectedJobTitle,careerLevels, jobCategory, selecetdArea])
      

      useEffect(()=> {
        if(editData?.job_category || editData?.job_category == 0){
            setSelectedJobCategory(editData?.job_category)
        }
      },[editData])


      const handleRadioChange = (event) => {
        setValue('post_type', event.target.value);
      };

      const salaryRangeFrom = useWatch({
        control,
        name: "salary_range_from"
      });

      const onSubmit = async (data) => {
        if(!getValues("career_level")){
            setError("career_level", {message: "This Field is required!"})
            return;
          }
          else{
            clearErrors("career_level")
          }
        if (countryName) setValue("country_name", countryName)
        if (cityName) setValue("city_name", cityName)
        if(areaName) setValue("area_name", areaName);
          
        if(data.area == "other") {
            setValue("area_name", "");
        }
        validateStep(1)
        trackForm(2)
        // setData(2)
      };

      useEffect(()=> {
        requestCareerLevel("get", "master/carrier-level-list")
      },[])

      useEffect(()=> {
        if(responesCareerLevel){
          const {status, list} = responesCareerLevel;
          if(!status){
            toast.error("Something went wrong");
            return;
          }
          setCareerLevels(list)
        }
      },[responesCareerLevel, selectedCareerLevelnew])

      const handleLevelChange = (level) => {
        // setLevel(level);
        // setValue('career_level', level);
      };

    return (
        <>
      
            <div className={styles.inner_box}>
                <h3 className={styles.inner_box_title}>{t("Basic Information")}</h3>
                <p className={styles.inner_box_subtitle}>{t("This information will be displayed publicly")}</p>
            </div>
            <div className={styles.job_details_box}>

                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Job Title")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Job titles must be describe one position</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="row">
                            <div className="col-lg-5 col-12">
                                <div className={styles.post_job_right_section}>
                                    <input 
                                    type="text" 
                                    className={`form-control ${styles.form_control}`} 
                                    placeholder={`${t("e.g.")} ${t("Software")} ${t("Engineer")}`} 
                                    name="title" 
                                    maxLength={80}
                                    // defaultValue={editData.title}
                                    {...register("title", {
                                        required: "Must be under 80 characters",
                                        maxLength: {
                                            value: 80,
                                            message: "Must be under 80 characters"
                                        },
                                        onChange: (e) => setTitle(e.target.value)
                                    })}
                                    />
                                    {errors.title && (
                                        <span className="invalid-feedback d-block">
                                        {errors.title.message}
                                        </span>
                                    )}
                                    <span className={`${styles.input_sub_text} text-end d-block`}>{title.length}/80</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Apply Before Date")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Need Some Text Here</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={styles.post_job_right_section}>
                            <label className={styles.label_text}>{t("Select Date")}</label>
                            <input 
                                className={`form-control ${styles.form_control}`} 
                                name="apply_before" 
                                type="date"
                                placeholder="20.05.2023"
                                min={new Date().toISOString().split("T")[0]} // Set min attribute to today's date
                                {...register("apply_before", {
                                    required: "This field is required.",
                                    validate: {
                                        dateNotLessThanToday: (value) => {
                                            const selectedDate = new Date(value);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            return selectedDate >= today || "Date should not be less than today's date.";
                                        }
                                    }
                                })}
                            />
                             {errors.apply_before && (
                                <span className="invalid-feedback d-block">
                                {errors.apply_before.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Jobs Options")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Add required skills for the job</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={styles.post_job_right_section}>
                            <div className={`custom_checkbox ${styles.select_options_box}`}>
                                <input 
                                id="job_option_one" 
                                type="checkbox" 
                                name="is_confidential" 
                                className={`${styles.checkbox}`} 
                                {...register("is_confidential", {
                                    required: false,
                                })}
                                />
                                <label className={styles.input_sub_lebal} for="job_option_one" >{t("Keep company confidential")}</label>
                            </div>

                            <p className={styles.company_text}>{t("Hide company name, logo and profile")}</p>
                            <div className={`custom_checkbox ${styles.select_options_box}`}>
                                <input 
                                id="job_option_to" 
                                type="checkbox" 
                                name="send_candidate_notif" 
                                className={`${styles.checkbox}`} 
                                {...register("send_candidate_notif", {
                                    required: false,
                                })}
                                />
                                <label className={styles.input_sub_lebal} for="job_option_to" >{t("Send email notifications when new candidates apply")}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.job_details_box}>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Post Type")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Choose Post Type</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={`${styles.post_job_right_section} ${styles.post_job_right_block}`}>
                            {
                                jobType?.map((j) => (
                                    <div className={`custom_radio ${styles.select_options_box}`}>
                                        <input style={{borderColor:errors.post_type ? "red" : "#d0d0d0"}} id={j.id} type="radio"
                                        name="post_type" 
                                        value={j.id} 
                                        className={`${styles.checkbox}`}  
                                       
                                        {...register("post_type", {
                                            required: "This field is required.",
                                        })}
                                        checked={watchedPostType ? watchedPostType == j.id : false}
                                        onChange={handleRadioChange}
                                        />
                                    
                                        <label className={styles.input_sub_lebal} for={j.id} >{j.name}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.job_details_box}>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Job Category")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Need Some Text Here</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={`${styles.post_job_right_section}`}>
                            <label className={styles.label_text}>{t("Select")} {t("Job Category")}</label> 
                            <Form.Select aria-label="Default select example" name="job_category" 
                                {...register("job_category", {
                                    required: "This field is required.",
                                })}
                                onChange={(e) => {
                                    setSelectedJobCategory(e.target.value)
                                    if(e.target.value){
                                        delete errors.job_category;
                                    }
                                }}
                                >
                                <option value="">{t("Select")} {t("Job Category")}</option>
                                {
                                    category.filter(f => f.id != "0").map((d) => (
                                        <option value={d.id} selected={editData.job_category == d.id}>{d.name}</option>
                                    ))
                                }
                                <option value="0" selected={editData.job_category == "0"}>{t("Other")}</option>
                            </Form.Select>
                            {errors.job_category && (
                                <span className="invalid-feedback d-block">
                                {errors.job_category.message}
                                </span>
                            )}

                            {
                                selectedJobCategory == "0" && (
                                    <span>
                                        <br />
                                        <label className={styles.label_text}>{t("Other")} {t("Job Category")} <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${styles.form_control}`}
                                            name="other_job_category"
                                            maxLength={80}
                                            {...register("other_job_category", {
                                                required: "This field is required.",
                                            })}
                                        />
                                        {errors.other_job_category && (
                                            <span className="invalid-feedback d-block">
                                                {errors.other_job_category.message}
                                            </span>
                                        )}
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.job_details_box}>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Location")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Need Some Text Here</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={` mb-3 ${styles.post_job_right_section}`}>
                            <label className={styles.label_text}>{t("Country")}</label>
                            <Form.Select aria-label="Default select example" name="country" {...register("country", {
                                    required: "This field is required.",
                                    onChange:(e)=> {
                                        getcity(e.target.value);
                                        const selectedCountry = country.find(c => c.id == e.target.value);
                                        setCountryName(selectedCountry?.name || '');
                                    }
                                })}
                                > 
                                <option value="">{t("Select")} {t("Country")}</option>
                                 {
                                    country?.map(m => (
                                    <option value={m.id} selected={editData.country == m.id} >{m.name}</option>
                                    ))
                                }
                            </Form.Select>
                            {errors.country && (
                                <span className="invalid-feedback d-block">
                                {errors.country.message}
                                </span>
                            )}
                        </div>
                        <div className={` mb-3 ${styles.post_job_right_section}`}>
                            <label className={styles.label_text}>{t("City")}</label>
                            <Form.Select aria-label="Default select example" name="city" {...register("city", {
                                    required: "This field is required.",
                                })}
                                onChange={(e) => {
                                    getArea(e.target.value)
                                    const selectedCity = city.find(c => c.id == e.target.value);
                                    setCityName(selectedCity?.name || '');
                                    if(e.target.value){
                                        delete errors.city;
                                    }
                                }}    
                            >
                                 <option value={""}>{t("Select")} {t("city")}</option>
                                {
                                    city?.map(m => (
                                    <option value={m.id} selected={editData.city == m.id}>{m.name}</option>
                                    ))
                                }
                            </Form.Select>
                            {errors.city && (
                                <span className="invalid-feedback d-block">
                                {errors.city.message}
                                </span>
                            )}
                        </div>
                        <div className={`  ${styles.post_job_right_section}`}>
                            <label className={styles.label_text}>Area</label>
                            <Form.Select aria-label="Default select example" name="area" {...register("area", {
                                    required: "This field is required.",
                                })}
                                onChange={e => {
                                    setSelectedArea(e.target.value)
                                    const selecetdAreaName = area.find((c) => c.id == e.target.value);
                                    setAreaName(selecetdAreaName?.name || "");
                                    if(e.target.value){
                                        delete errors.area;
                                    }
                                  }}
                                >
                                  <option value={""}>{t("Select")} {t("Area")}</option>
                                  {
                                    area.map(v => (
                                      <option value={v.id} selected={editData.area == v.id}>{v.name}</option>
                                    ))
                                  }
                                  {
                                    city.length > 0 && (
                                      <option value="other" selected={editData.area == "other"}>{t("Other")}</option>
                                    )
                                  }
                            </Form.Select>
                            {errors.area && (
                                <span className="invalid-feedback d-block">
                                {errors.area.message}
                                </span>
                            )}
                
                            {
                                selectedArea == "other" && (
                                <span>
                                    <br />
                                    <label className={styles.label_text}>{t("Other")} {t("Area")} <span className="text-danger">*</span></label>
                                    <input
                                    type="text"
                                    className={`form-control ${styles.form_control}`}
                                    placeholder="e.g. Cairo"
                                    name="other_area"
                                    {...register("other_area", {
                                        required: "This field is required.",
                                    })}
                                    />
                                    {errors.other_area && (
                                    <span className="invalid-feedback d-block">
                                        {errors.other_area.message}
                                    </span>
                                    )}
                                </span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className={` ${styles.job_details_box}`}>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Career")} {t("Level")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Need Some Text Here</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={` mb-3 ${styles.career_level_box} ${styles.post_job_right_section}`}>
                            <label
                                htmlFor="experienced"
                                className={`${styles.level_box} ${
                                    selectedCareerLevel && selectedCareerLevel != "2" && selectedCareerLevel != "1" && selectedCareerLevel != "" ? styles.active : ""
                                  }`}
                                // onClick={() => handleLevelChange("experienced")}
                            >
                            <input
                                id="experienced"
                                className="d-none"
                                name="career_level"
                                defaultChecked={selectedCareerLevel == "experienced"}
                                // {...register("career_level", { required: "This field is required.", })}
                                type="radio"
                                // value="experienced"
                                onChange={()=> {
                                    const careerLevel = careerLevels.find(l => l.id != 1 && l.id != 2);
                                    console.log("career_level : ", careerLevel); 
                                    setValue("career_level", careerLevel?.id)
                                    setValue("career_name", careerLevel?.name)
                                    clearErrors("career_level")
                                  }}
                            />
                                <h3 className={styles.level_title}>{t("Experienced")}</h3>
                                <h4 className={styles.level_sub_title}>{t("Senior")}/{t("Mid-Level")}</h4>
                            </label>

                            <label
                                htmlFor="junior"
                                className={`${styles.level_box} ${
                                    selectedCareerLevel === "2" ? styles.active : ""
                                  }`}
                                // onClick={() => handleLevelChange("junior")}
                            >
                                <input
                                id="junior"
                                className="d-none"
                                name="career_level"
                                type="radio"
                                value="junior"
                                defaultChecked={selectedCareerLevel == "junior"}
                                // {...register("career_level", { required: "This field is required." })}
                                onChange={()=> {
                                    setValue('career_level', "2")
                                    setValue("career_name", careerLevels.length > 1 && careerLevels[1])
                                    clearErrors("career_level")
                                  }}
                                />
                                <h3 className={styles.level_title}>{t("Entry")} {t("Level")}</h3>
                                <h4 className={styles.level_sub_title}>{t("Junior")} {t("Level")}</h4>
                            </label>

                            <label
                                htmlFor="student"
                                // className={`${styles.level_box} ${(selectedCareerLevel == "student") ? styles.active : ""}`}
                                className={`${styles.level_box} ${
                                    selectedCareerLevel === "1" ? styles.active : ""
                                  }`}
                                // onClick={() => handleLevelChange("student")}
                            >
                                <input
                                id="student"
                                className="d-none"
                                name="career_level"
                                type="radio"
                                value="student"
                                defaultChecked={selectedCareerLevel == "student"}
                                // {...register("career_level", { required: "This field is required." })}
                                onChange={()=> {
                                    setValue('career_level', "1")
                                    setValue("career_name", careerLevels.length > 0 && careerLevels[0])
                                    clearErrors("career_level")
                                  }}
                                />
                                <h3 className={styles.level_title}>{t("Student")}</h3>
                                <h4 className={styles.level_sub_title}>{t("Undergrad")}/{t("Postgrad")}</h4>
                            </label>
                        </div>
                        {errors.career_level && (
                                <span className="invalid-feedback d-block">
                                {errors.career_level.message}
                                </span>
                        )}

                        {selectedCareerLevel && selectedCareerLevel != "1" && selectedCareerLevel != "2" && 
                         <div className={` mb-3 ${styles.post_job_right_section}`}>
                            <label className={styles.label_text}>{t("Year")} {t("of")} {t("Experience")}</label>
                            <Form.Select aria-label="Default select example" name="year_of_experience" 
                            // {...register("year_of_experience", {
                            //         required: "This field is required.",
                            //     })}
                            onChange={(e)=> {
                                console.log("e",e.target);
                                setValue("career_level", e.target.value)
                                setValue("career_name", careerLevels[e.target.value]?.name)
                                // setValue("years_of_experience", e.target.value)
            
                              }}
                                >

{careerLevels.map((level)=> {
                    if(level.id != 1 && level.id != 2){
                      return <option value={level.id}  selected={getValues("career_level") == level.id}>{level.name}</option>
                    }else{<></>}
                  })}
                                {/* <option value={""}>Min</option>
                                <option value="1-2">1-2 Years</option>
                                <option value="2-3">2-3 Years</option>
                                <option value="3-5">3-5 Years</option>
                                <option value="5-8">5-8 Years</option>
                                <option value="8+">8+ Years</option> */}
                            </Form.Select>
                            {errors.year_of_experience && (
                                <span className="invalid-feedback d-block">
                                {errors.year_of_experience.message}
                                </span>
                            )}
                        </div>
                        }
                    </div>
                </div>
            </div>

            <div className={styles.job_details_box}>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Salary")} {t("Range")}</h3>
                            {/* <p className={styles.inner_box_subtitle}>Need Some Text Here</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">

                        <div className={`  ${styles.post_job_right_section}`}>
                            <div style={{ alignItems: "baseline" }} className={styles.salary_range_box}>
                                <div>
                                    <div className={styles.salary_range_track}>
                                        {/*<span>e.g.</span> */}
                                        <input className={styles.range_input} placeholder="e.g., 8000" type="number" name="salary_range_from"
                                            {...register("salary_range_from", {
                                                required: "This field is required.",
                                                min: 1
                                            })} />

                                    </div>
                                    {errors.salary_range_from && (
                                        <span className="invalid-feedback d-block">
                                            {errors.salary_range_from.message}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3 className={styles.salart_to_div}>{t("to")}</h3>
                                </div>
                                <div>
                                    <div className={styles.salary_range_track}>
                                        {/*<span>e.g.</span>*/}
                                        <input type="number" className={styles.range_input} placeholder="e.g., 10000" name="salary_range_to" {...register("salary_range_to", {
                                            required: "This field is required.",
                                            min: {
                                                value: salaryRangeFrom,
                                                message: "Must be bigger than From."
                                            }
                                        })} />
                                    </div>
                                    {errors.salary_range_to && (
                                        <span className="invalid-feedback d-block">
                                            {errors.salary_range_to.message}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.month_change_box}>
                                    <label className={styles.label_text}>{salaryselect == "egp" ? "EGP" : "USD"}/{t("Month")} </label>
                                    <label onClick={() => {
                                        if (salaryselect == "egp") {
                                            setsalaryselect("usd")
                                            setValue("salary_currency", "usd")
                                            setValue("salary_type", "per_month")
                                        }
                                        else {
                                            setsalaryselect("egp")
                                            setValue("salary_currency", "egp")
                                            setValue("salary_type", "per_month")
                                        }
                                    }} htmlFor="salary" type="button" className={styles.month_change_title}>&nbsp;&nbsp;{t("Change")}</label>
                                </div>
                                {salaryselect == "egp" ?

                                    <input className="d-none" id="salary" name="salary_currency" type="radio" defaultChecked {...register("salary_currency")} value={"egp"} />
                                    : (salaryselect == "usd") ? 
                                    <input className="d-none" id="salary" name="salary_currency" defaultChecked {...register("salary_currency")} type="radio" value={"usd"} /> : ""
                                }


                            </div>
                        </div>
                        <div className={` mb-3 ${styles.post_job_right_section}`}>

                            <div className={`custom_checkbox ${styles.select_options_box}`}>
                                <input id="job_option_nine" type="checkbox" className={`${styles.checkbox}`} name="hide_salary_range" {...register("hide_salary_range", {
                                    required: false,
                                })} />
                                <label className={`${styles.input_sub_lebal} ${styles.hide_selary}`} for="job_option_nine" >{t("Hide salary in job post")}</label>
                            </div>
                        </div>


                    </div>
                </div>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Additional")} {t("Salary")} {t("Details")} </h3>
                            {/* <p className={styles.inner_box_subtitle}>Job titles must be describe one position</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">

                        <div className={` mb-3 ${styles.post_job_right_section}`}>
                            <label className={styles.label_text}>{t("Optional")}</label>
                            <Form.Control
                                as="textarea"
                                placeholder={`${t("e.g.")}  ${t("Commissions")} ${t("and")} ${t("bonuses")}`}
                                rows={5}
                                name="salary_details"
                                {...register("salary_details", {
                                    required: false,
                                })}
                            />
                          
                        </div>
                    </div>
                </div>
            </div>            

            <div className={`${styles.job_details_box}`}>
                <div className={`row ${styles.row_gap}`}>
                    <div className="col-sm-4">
                        <div className={styles.post_job_left_section}>
                            <h3 className={styles.inner_box_title}>{t("Number")} {t("of")} {t("Vacancies")} </h3>
                            {/* <p className={styles.inner_box_subtitle}>Job titles must be describe one position</p> */}
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className={`  ${styles.post_job_right_section}`}>
                            {/* <label className={styles.label_text}>Number of Vacancies</label> */}
                            <input 
                                type="number"
                                name="vacancies"
                                className="form-control"
                                min={1}
                                placeholder="Enter vacancy"
                                onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e' || e.key === '+') {
                                        e.preventDefault();
                                    }
                                }}
                                {
                                    ...register("vacancies", {
                                    required: {
                                        value: true,
                                        message: "This field is required."
                                    },
                                    validate: {
                                        isNumber: (value) => !isNaN(value) || "Only numbers are allowed",
                                        minValue: (value) => value > 0 || "Number must be greater than 0"
                                    }
                                    })
                                }
                            />
                            {/* <Form.Select aria-label="Default select example" name="vacancies"  {...register("vacancies", {
                                    required: {
                                        value: true,
                                        message: "This field is required."
                                    }
                                })}>
                                <option value="">{t("Select")}</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </Form.Select> */}
                            {
                                errors.vacancies && (
                                    <span className="invalid-feedback d-block">
                                    {errors.vacancies.message}
                                    </span>
                                )
                            }
                        </div>

                    </div>
                </div>
            </div>

            <div className={styles.next_step_btn_block}>
                <button type="button" 
                onClick={handleSubmit(onSubmit)} 
                className={styles.next_btn}>
                    {t("Next")} {t("Step")}
                </button>
            </div>
     
        </>
    );
};

export async function getServerSideProps(context) {
    //   createAxiosCookies(context);
    const { lang } = getCookies(context);
    let lang_code = "en";
    try {
        const language = JSON.parse(lang)

        lang_code = String(language.code).toLowerCase()
    } catch (error) {
        lang_code = "en"
    }
    return {
        props: {
            isProtected: true,
            ...(await serverSideTranslations(lang_code, [
                'common',
            ])),
        },
    };
}

export default StepOne;
