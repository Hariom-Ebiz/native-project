import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// import { createAxiosCookies } from "@/fn";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import styles from "@/styles/post_a_job.module.css";
import Sidebar from "@/components/jobSeeker/Sidebar";
import AuthHeader from "@/components/employer/AuthHeader";
import Header from "@/components/common/Header";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import useRequest from "@/hooks/useRequest";
import Loading from "@/components/loading/loading";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateLoading } from "@/store/siteSlice";
import { getCookies } from "@/fn";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

let placeholder = `e.g., What motivated you to apply for this position and how does it align with your career goals?
e.g., What unique qualities or skills do you bring to this role that set you apart from other candidates?
e.g., What specific goals or outcomes are you hoping to achieve in this role, and how do you plan to accomplish them?
e.g., Why are you interested in working for our company, and how do you see yourself contributing to our team and goals?
e.g., How do you handle feedback and criticism in the workplace?
`;

const StepFour = ({ setData, trackForm, country,  validateStep }) => {
    const { t } = useTranslation('common');
    const {userId} = useSelector((store) => store.auth);
    const { request:PostJobRequest, response: postJobResponse } = useRequest();
    const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    unregister,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
    control
  } = useFormContext({
    defaultValues: {
      questions: [
        {
          id: 0,
          question: "",
          isRequired: false,
          other: false,
          otherVal: ""
        }
      ]
    }
  });


  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "questions"
  });

  const route = useRouter();

const moveToPreview = (data) => {

    setValue("employer_id", userId);  
    
    validateStep(4)
    trackForm(5);
}

const skipPage = async () => {
  setValue("employer_id", userId);  
  unregister("questions");
  unregister("is_question_required");
  validateStep(4)
    trackForm(5);
    // setData(4);
}

const watchQuestions = watch('questions');
const selectedQuestions = Array.isArray(watchQuestions) ?  watchQuestions?.map(item => item.selectedOption) : [];

const getFilteredOptions = (index) => {
  // Filter out already selected options for the current select
  return defaultQues.filter(question => !selectedQuestions.includes(question) || selectedQuestions[index] === question);
};

  const [questions, setQuestions] = useState([
    { id: 1, question: "", isRequired: false, other: false, otherVal: null }
  ]);

  const [defaultQues, setDefaultQues] = useState([
    {text: "What are your salary expectations?", isActive: true},
    {text: "Are you willing to start immediately?", isActive: true},
    {text: "How many years of experience do you have?", isActive: true},
    {text: "What is your English Level? (C2-A2)", isActive: true},
    {text: "What makes you the ideal candidate for this position?", isActive: true},
  ])

  const addQuestion = () => {
    append({
      id: fields.length,
      question: "",
      isRequired: false,
      other: false,
      otherVal: ""
    })
  };

  const deleteQuestion = (id) => {
    remove(id)
  };

  useEffect(() => {
    window.scrollTo(0,0);
}, []);

useEffect(() => {
  if(postJobResponse){
    console.log("postJobResponse",postJobResponse)
  }
    if (postJobResponse) {
        route.push("/employer/company-profile")
    }
},[postJobResponse])

  const addOtherQuestion = (id, val) => {
    setQuestions(questions.map(d => {
      if (d.id == id) {
        return { ...d, otherVal: val }
      } else {
        return d
      }
    }))
  }

  return (
    <>
       
      <div className={styles.inner_box} style={{"display": "flex"}}>
         <div>
            <h3 className={styles.inner_box_title}>{t("Screening Questions")}</h3>
            <p className={styles.inner_box_subtitle}>{t("Questions can be either mandatory or optional, depending on the employer's choice. For questions that applicants must answer, please ensure you select the 'Required' checkbox.")}</p>
        </div>
        <button onClick={() => skipPage()} className={styles.next_btn}>
          {t("Skip")}
        </button>
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className={`btn btn-primary ${styles.dash_theem_btn}`}
        style={{ marginLeft: "10px" }}
      >
        ADD
      </button>

      {
        fields.map((d, i) => (
          <div
            key={i}
            className={styles.like_to_work_input}
            style={{ marginTop: "5px", marginBottom: "5px" }}
          >
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckChecked"
            >
              Question {i+1}
            </label>
            <select
              className={`${styles.form_select} ${styles.form_control} form-select form-control`}
              aria-label="Default select example"
              // name="country"
              {...register(`questions.${i}.question`, {
                required: {
                  value: true,
                  message: "This field is required.",
                },
              })}
              onChange={(e) => {
                if(e.target.value == "other") {
                  setValue(`questions.${i}.other`, true)
                }
              }}
              // onChange={(e) => {questionSelectHandler(e.target.value, d.id); if (e.target.value != "other") setSelectedQuestion([...selectedQuestion, e.target.value])}}
            >
              <option value="">Select Question</option>
              {
                getFilteredOptions().map((d) => {
                  if(d.isActive){
                    return <option>{d.text}</option>
                  } else {
                    <></>
                  }
                })
              }
              <option value="other">Other</option>
            </select>
            {errors[`question_${d.id}`] && (
              <div className="invalid-feedback d-block">
                {errors[`question_${d.id}`].message}
              </div>
            )}
            <label>
              <input
                type="checkbox"
                {...register(`questions.${i}.isRequired`)}
                checked={watch(`questions.${i}.isRequired`)}
                onChange={(e) => {
                  setValue(`questions.${i}.isRequired`, e.target.checked)
                }}
              />
              &nbsp;{t("Required")}
            </label>
            {
              watch(`questions.${i}.other`) && (
                <div style={{display: "block"}}>
                  <input type="text" {...register(`questions.${i}.otherVal`)} placeholder="Enter Question" defaultValue={d.otherVal} onChange={(e) => addOtherQuestion(d.id, e.currentTarget.value)} />
                </div>
              )
            }

            {errors[`is_question_required_${d.id}`] && (
              <div className="invalid-feedback d-block">
                {errors[`is_question_required_${d.id}`].message}
              </div>
            )}
            {(fields.length > 1 && i > 0) && (
              <button
                type="button"
                onClick={() => deleteQuestion(i)}
                className={`btn btn-primary ${styles.dash_theem_btn}`}
              >
                DELETE
              </button>
            )}
          </div>
        ))
      }

      <div className={styles.next_step_btn_block}>
        <button onClick={() => skipPage()} className={styles.next_btn}>
          {t("Skip")}
        </button>
        <button
          type="button"
          onClick={handleSubmit(moveToPreview)}
          className={styles.next_btn}
        >
          {t("Preview")}
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

export default StepFour;