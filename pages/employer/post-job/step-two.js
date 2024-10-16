import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
// import { createAxiosCookies } from "@/fn";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import styles from "@/styles/post_a_job.module.css";
import Sidebar from "@/components/jobSeeker/Sidebar";
import AuthHeader from "@/components/employer/AuthHeader";
import Header from "@/components/common/Header";
import { useForm, useFormContext } from "react-hook-form";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CheckboxList from './CheckboxList'; // A component that displays a list of checkboxes
import { WithContext as ReactTags } from "react-tag-input";
import Creatable from "react-select/creatable";
import { getCookies } from "@/fn";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";


const StepTwo = ({ setData, trackForm, skills:keywords,  validateStep }) => {
  const { t } = useTranslation('common');
// const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     clearErrors,
//     reset,
//     } = useFormContext();

const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    setValue,
    reset,
    } = useFormContext();

  const [open, setOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  let valData = getValues();
  const [Description, setDescription] = useState(valData.job_description ?? "");
  const [Qualification, setQualification] = useState(valData.skills_qualifications ?? "");
  const [Requirement, setRequirement] = useState(valData.job_requirements ?? "");

  const [skillList, setSkillList] = useState(keywords);
  const [skillTags, setSkillTags] = useState([]);
  const [skillsError, setSkillsError] = useState([]);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectKeyword = (keyword) => {

    setSelectedKeywords((prevSelectedKeywords) => {
        const keywordIds = new Set(prevSelectedKeywords.map(k => k.id));
    //   const keywordSet = new Set(prevSelectedKeywords);
      if (!keywordIds.has(keyword.id)) {
        return [...prevSelectedKeywords, keyword];
      } else {
        let d = watch();

        const index = d['keywords'].indexOf(String(keyword.id));
        // If the value exists in the array, remove it
        if (index !== -1) {
            d['keywords'] = d['keywords'].splice(index, 1);
        }
        return prevSelectedKeywords.filter((k) => k.id != keyword.id);
      }
    });
  };
// console.log("selectedKeywords", selectedKeywords)


  const onSubmit = async (data) => {
    const keywords = getValues("keywords");
    console.log("getValues : ", keywords)
    if(!keywords){
      setError("keywords",{message: "This field is required!"})
      return;
    }else{
      clearErrors("keywords");
    }

    console.log("DATA FORM 1", data);
    data.keywords = selectedKeywords.map(keyword => keyword.id);
    console.log("datakeywords", data.keywords)
    validateStep(2)
    trackForm(3);
    // setData(3);
  };

  useEffect(() => {
    // let data = watch()
    // const formKeywords = data['keywords'];
    // console.log("formKeywords", formKeywords);
    // // if(formKeywords && formKeywords.length > 0) {
    // //     const dd = keywords.filter(keyword => {
    // //         if (formKeywords.includes(String(keyword.id))) {
    // //             return keyword;
    // //         }
    // //     });

    // //     setSelectedKeywords(dd); 
    // // }
    // if (formKeywords?.length) {
      
    //   // setSkillList(formKeywords);
    // }
    
    window.scrollTo(0,0);
}, []);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDeleteSkillTags = (i) => {
    setSkillTags(skillTags.filter((tag, index) => index !== i));
  };

  const skillAddHandler = (name) => {
    setSkillsError(0);
    console.log(">>>>A>sddf");
    let updated = skillList.map((elem) => {
      if (elem.name == name) {
        return {
          ...elem,
          selected: elem.selected ? false : true,
          level: "average",
        };
      } else {
        return elem;
      }
    });
    setSkillList(updated);
    setValue("keywords", updated)
    clearErrors("keywords")
  };

  const handleAdditionSkillTags = (tag) => {
    setSkillsError(0);
    let exists = skillList.find((elem) => elem.name.toLowerCase() === tag.text.toLowerCase());
    if (exists) {
      setSkillsError(2);
      // setError("skills_qualifications", "2")
      return;
    }
    let newTag = {
      selected: true,
      level: "average",
      id: tag.text,
      name: tag.text,
    };
    setSkillList((prev) => {
      return [newTag, ...prev];
    });
    setValue("keywords", [newTag, ...skillList])
    clearErrors("keywords")
  };
  return (
    <>
      <div className={styles.inner_box}>
        <h3 className={styles.inner_box_title}>{t("Detailed")} {t("Info")}</h3>
        <p className={styles.inner_box_subtitle}>
          {t("This information will be displayed publicly")}
        </p>
      </div>
      <div className={` ${styles.job_details_box}`}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={styles.post_job_left_section}>
              <h3 className={styles.inner_box_title}>{t("Job")} {t("Description")} </h3>
              {/* <p className={styles.inner_box_subtitle}>About this Jobs</p> */}
            </div>
          </div>
          <div className="col-sm-8">
            <div className={`${styles.post_job_right_section}`}>
              <Form.Control
                as="textarea"
                placeholder={t("Enter job description")}
                name="job_description"
                rows={5}
                // onKeyUp={(e) => setDescription(e.target.value)}
                {...register("job_description", {
                  required: "This field is required.",
                  setValueAs: (v) => {v = v.trim(); v = v.replace(/ \s/g, ""); return v},
                  maxLength: {
                    value: 500,
                    message: t("Job description should be under 500 characters.")
                  },
                  onChange: (e) => setDescription(e.target.value)
                })}
                maxLength={500}
              />
              {errors.job_description && (
                <span className="invalid-feedback d-block">
                  {errors.job_description.message}
                </span>
              )}
              <div className={styles.dlt_max_box}>
                <p className={styles.dlt_maxText}>{t("Maximum 500 characters")}</p>
                <p className={styles.dlt_right_maxText}>{Description.length} / 500</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={` ${styles.job_details_box}`}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={styles.post_job_left_section}>
              <h3 className={styles.inner_box_title}>{t("Job")} {t("Requirements")} </h3>
              {/* <p className={styles.inner_box_subtitle}>
                Some text will be here
              </p> */}
            </div>
          </div>
          <div className="col-sm-8">
            <div className={`${styles.post_job_right_section}`}>
              <Form.Control
                as="textarea"
                placeholder={t("Enter job requirements")}
                
                rows={5}
                name="job_requirements"
                onKeyUp={(e) => setRequirement(e.target.value)}
                {...register("job_requirements", {
                  required: t("This field is required."),
                  setValueAs: (v) => {v = v.trim(); v = v.replace(/ \s/g, ""); return v},
                  maxLength: {
                    value: 500,
                    message: t("Job requirements should be under 500 character.")
                  },
                })}
                maxLength={500}
              />
              {errors.job_requirements && (
                <span className="invalid-feedback d-block">
                  {errors.job_requirements.message}
                </span>
              )}
              <div className={styles.dlt_max_box}>
                <p className={styles.dlt_maxText}>{t("Maximum 500 characters")}</p>
                <p className={styles.dlt_right_maxText}>{Requirement.length} / 500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={` ${styles.job_details_box}`}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={styles.post_job_left_section}>
              <h3 className={styles.inner_box_title}>{t("Skills")} & {t("Keywords")} </h3>
              <p className={styles.inner_box_subtitle}>
              {t("Incorporate important skills/keywords to refine your results and enhance your job search")}
              </p>
            </div>
          </div>
          <div className="col-sm-8">
                <p>{t("You can select multiple Skills/Keywords or add your own!")}</p>
                <Creatable 
                  {
                    ...register("keywords", {required: {value: true, message: t("This field is required")}})
                  }
                  onChange={(v) => {
                    setValue("keywords", v)
                  }}
                  options={skillList.map((category) => ({
                    label: category.name,
                    value: category.name,
                  }))}
                  defaultValue={watch("keywords")}
                  isMulti
                />

            {/* {skillList && (
              <div className="subject-search-icon" style={{marginBottom: "20px"}}>
                <ReactTags
                  skillTags={skillTags}
                  // suggestions={suggestions}
                  delimiters={delimiters}
                  handleDelete={handleDeleteSkillTags}
                  handleAddition={handleAdditionSkillTags}
                  inputFieldPosition="top"
                  autocomplete
                  id="skill-tag"
                  allowUnique={false}
                />
              </div>
            )}

            <div className={styles.skills_box}>
              <ul className={styles.skills_list}>
                {skillList?.map((val) => {
                  return (
                    <Fragment key={val.id}>
                      {val.selected ? (
                        <li
                          style={{
                            backgroundColor: "#82aad9",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => skillAddHandler(val.name)}
                        >
                          <span
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {val.name}
                          </span>
                          
                        </li>
                      ) : (
                        <li
                          key={val.id}
                          onClick={() => skillAddHandler(val.name)}
                          style={{ cursor: "pointer" }}
                        >
                          {val.name}
                        </li>
                      )}
                    </Fragment>
                  );
                })}
                {skillsError === 1 &&
                  (
                    <div className="invalid-feedback d-block">
                      You can add minimum 1 skill.
                    </div>
                  )
                }
                {skillsError === 2 && 
                (
                  <div className="invalid-feedback d-block">
                    This skill already exists in suggestions.
                  </div>
                )
                }
              </ul>
            </div> */}
            {errors.keywords && (
                <span className="invalid-feedback d-block">
                  {errors.keywords.message}
                </span>
              )}
            {/* <div className={`${styles.post_job_right_section}`}>
              <Form.Control
                as="textarea"
                placeholder="Enter Skills & Qualifications"
                rows={5}
                name="skills_qualifications"
                onKeyUp={(e) => setQualification(e.target.value)}
                {...register("skills_qualifications", {
                  required: "This field is required.",
                  maxLength: 500,
                })}
                maxLength={500}
              />
              {errors.skills_qualifications && (
                <span className="invalid-feedback d-block">
                  {errors.skills_qualifications.message}
                </span>
              )}
              <div className={styles.dlt_max_box}>
                <p className={styles.dlt_maxText}>Maximum 500 characters</p>
                <p className={styles.dlt_right_maxText}>{Qualification.length} / 500</p>
              </div>
            </div> */}
          </div>
        </div>
        {/* <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={styles.post_job_left_section}>
              <h3 className={styles.inner_box_title}>Required Skills </h3>
            </div>
          </div>
          <div className="col-sm-8">
            <div className={`${styles.post_job_right_section}`}>
              <button
                type="button"
                className={styles.add_key_btn}
                onClick={handleClickOpen}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.99992 0.666992C6.36811 0.666992 6.66659 0.965469 6.66659 1.33366V10.667C6.66659 11.0352 6.36811 11.3337 5.99992 11.3337C5.63173 11.3337 5.33325 11.0352 5.33325 10.667V1.33366C5.33325 0.965469 5.63173 0.666992 5.99992 0.666992Z"
                    fill="currentcolor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.666748 5.99967C0.666748 5.63148 0.965225 5.33301 1.33341 5.33301H10.6667C11.0349 5.33301 11.3334 5.63148 11.3334 5.99967C11.3334 6.36786 11.0349 6.66634 10.6667 6.66634H1.33341C0.965225 6.66634 0.666748 6.36786 0.666748 5.99967Z"
                    fill="currentcolor"
                  />
                </svg>
                Add Keyword
              </button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Keywords</DialogTitle>
                <DialogContent>
                  <CheckboxList
                    items={keywords}
                    onSelectItem={handleSelectKeyword}
                    selectedItems = {selectedKeywords}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              <div className={styles.add_skills_box}>
                {selectedKeywords && selectedKeywords.length>0 && selectedKeywords?.map((keyword) => (
                  <span className={styles.key_tag} key={keyword.id}>
                    {keyword.name}
                    <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg" 
                    style={{cursor: "pointer"}}
                    onClick={() => handleSelectKeyword(keyword)}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.293031 1.29259C0.480558 1.10512 0.734866 0.999806 1.00003 0.999806C1.26519 0.999806 1.5195 1.10512 1.70703 1.29259L6.00003 5.58559L10.293 1.29259C10.3853 1.19708 10.4956 1.1209 10.6176 1.06849C10.7396 1.01608 10.8708 0.988496 11.0036 0.987342C11.1364 0.986189 11.2681 1.01149 11.391 1.06177C11.5139 1.11205 11.6255 1.18631 11.7194 1.2802C11.8133 1.37409 11.8876 1.48574 11.9378 1.60864C11.9881 1.73154 12.0134 1.86322 12.0123 1.99599C12.0111 2.12877 11.9835 2.25999 11.9311 2.382C11.8787 2.504 11.8025 2.61435 11.707 2.70659L7.41403 6.99959L11.707 11.2926C11.8892 11.4812 11.99 11.7338 11.9877 11.996C11.9854 12.2582 11.8803 12.509 11.6948 12.6944C11.5094 12.8798 11.2586 12.985 10.9964 12.9873C10.7342 12.9895 10.4816 12.8888 10.293 12.7066L6.00003 8.41359L1.70703 12.7066C1.51843 12.8888 1.26583 12.9895 1.00363 12.9873C0.741432 12.985 0.49062 12.8798 0.305212 12.6944C0.119804 12.509 0.0146347 12.2582 0.0123563 11.996C0.0100779 11.7338 0.110873 11.4812 0.293031 11.2926L4.58603 6.99959L0.293031 2.70659C0.10556 2.51907 0.000244141 2.26476 0.000244141 1.99959C0.000244141 1.73443 0.10556 1.48012 0.293031 1.29259Z"
                      fill="currentcolor"
                    />
                  </svg>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className={styles.next_step_btn_block}>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className={styles.next_btn}
        >
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
      isProtected: null,
            ...(await serverSideTranslations(lang_code, [
        'common',
      ])),
    },
  };
}

export default StepTwo;
