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
  } = useFormContext();


  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "questions"
  });

  const route = useRouter();

const moveToPreview = (data) => {

    setValue("employer_id", userId);  
    
    validateStep(4)
    trackForm(5);


    // setData(4);

    // data.questions = questionsArray;
    // data.is_question_required = isRequiredArray; // Add this line
    // data.employer_id = userId;
}

const skipPage = async () => {
  setValue("employer_id", userId);  
  unregister("questions");
  unregister("is_question_required");
  validateStep(4)
    trackForm(5);
    // setData(4);
}

  const [questions, setQuestions] = useState([
    { id: 1, question: "", isRequired: false, other: false, otherVal: null }
  ]);

  const [defaultQues, setDefaultQues] = useState([
    "What are your salary expectations?",
    "Are you willing to start immediately?",
    "How many years of experience do you have?",
    "What is your English Level? (C2-A2)",
    "What makes you the ideal candidate for this position?",
  ])

  const addQuestion = () => {
    append({
      id: fields.length,
      question: "",
      isRequired: false,
      other: false,
      otherVal: ""
    })
    // const newQuestion = (questions.length) ? questions[questions.length-1].id + 1 : 1;
    // setQuestions([
    //   ...questions,
    //   { id: newQuestion, question: "", value: "", isRequired: false, other: false, otherVal: null },
    // ]);
  };

  const deleteQuestion = (id) => {
    remove(id)
    // setQuestions(questions.filter((question) => question.id != id));
    // setSelectedQuestion(selectedQuestion.filter( f => f != watch(`question_${id}`)))
    // unregister(`question_${id}`)
    // unregister(`is_question_required_${id}`)
  };

  // const handleChange = (id, field, value) => {
  //   setQuestions(
  //     questions.map((question) =>
  //       question.id == id ? { ...question, [field]: value } : question
  //     )
  //   );
  // };

  useEffect(() => {
    // let data = watch()
    // const questionKeys = Object.keys(data).filter(key => key.startsWith('question_') && data[key]);
    // const questionsArray = questionKeys.map(key => data[key]);
    // setSelectedQuestion(questionsArray)
    // const isRequiredKeys = Object.keys(data).filter(key => key.startsWith('is_question_required') && data[key] != undefined);
    // const isRequiredArray = isRequiredKeys.map(key => data[key]);

    // let d = questionsArray.map((question, index) => { 
    //     let isYes = defaultQues.includes(question);
    //     return { id: questionKeys[index].split("_").pop(), question: question, value: question, isRequired: isRequiredArray[index], other: (isYes) ? false : true, otherVal: (!isYes) ? question : null }
    // });

    // setQuestions(d);

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

// const questionSelectHandler = (val, id) => {
//   let arr = questions.map((d) => {
//     if (d.id == id) {
//       return {...d, question: val, other: (val == "other") ? true : false, otherVal: (val == "other") ? d.otherVal : null}
//     } else {
//       return d
//     }
//   })
//   setQuestions(arr)
// }

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

      {/* <div>
        {questions.map((question, index) => (
          <div key={index} className={` ${styles.job_details_box}`}>
            <div className={`row ${styles.row_gap}`}>
              <div className="col-sm-4">
                <div className={styles.post_job_left_section}>
                  <h3 className={styles.inner_box_title}>
                    {t("Write")} {t("Question")} {question.id}
                  </h3>
                </div>
              </div>
              <div className="col-sm-8">
                <div className={`${styles.post_job_right_section}`}>
                  <Form.Control
                    as="textarea"
                    placeholder={placeholder}
                    rows={5}
                    {...register(`question_${question.id}`, {
                      // required: "This field is required.",
                      maxLength: 500,
                    })}
                    value={question.value}
                    onChange={(e) => {
                      handleChange(question.id, "value", e.target.value);
                    }}
                    maxLength={500}
                  />
                  {errors[`question_${question.id}`] && (
                    <span className="invalid-feedback d-block">
                      {errors[`question_${question.id}`].message}
                    </span>
                  )}
                  <label>
                    <input
                      type="checkbox"
                      {...register(`is_question_required_${question.id}`)}
                      checked={question.isRequired}
                      onChange={(e) => {
                        handleChange(
                          question.id,
                          "isRequired",
                          e.target.checked
                        );
                      }}
                    />
                    &nbsp;{t("Required")}
                  </label>
                  <div className={styles.dlt_max_box}>
                    <p className={styles.dlt_maxText}>{t("Maximum 500 characters")}</p>
                    <p className={styles.dlt_right_maxText}>
                      {question.value.length} / 500
                    </p>
                  </div>
                  {index > 2 && (
                    <button className={styles.row_delete} onClick={() => deleteQuestion(question.id)}>
                      {t("Delete")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={addQuestion}>
          {t("Add")} {t("More")}
        </button>
      </div> */}

      


<div className={styles.screening_questions_box}>


      {
        fields.map((d, i) => (
          <div
            key={i}
            className={styles.like_to_work_input}
           
          >

          <div className={styles.screening_questions_add_box}>
              <div className={styles.screening_questions_add_main}>
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
                        defaultQues.map((d) => {
                          return <option>{d}</option>
                        })
                      }
                      <option value="other">Other</option>
                    </select>
                    {errors[`question_${d.id}`] && (
                      <div className="invalid-feedback d-block">
                        {errors[`question_${d.id}`].message}
                      </div>
                    )}

        {
                      watch(`questions.${i}.other`) && (
                        <div style={{display: "block"}}>
                          <input  className={`${styles.form_control} ${styles.other_input_track}`} type="text" {...register(`questions.${i}.otherVal`)} placeholder="Enter Question" defaultValue={d.otherVal} onChange={(e) => addOtherQuestion(d.id, e.currentTarget.value)} />
                        </div>
                      )
                    }
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
                    
            </div>
            {(fields.length > 1 && i > 0) && (
              <button
                type="button"
                onClick={() => deleteQuestion(i)}
                className={`btn btn-primary ${styles.dash_theem_btn} ${styles.delete_btn}`}
              >
                DELETE
              </button>
            )}
            </div>   


           

            {errors[`is_question_required_${d.id}`] && (
              <div className="invalid-feedback d-block">
                {errors[`is_question_required_${d.id}`].message}
              </div>
            )}
           
          </div>
          
        ))
      }
</div>
   
      {/* {
        questions.map((d, i) => (
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
              {...register(`question_${d.id}`, {
                required: {
                  value: true,
                  message: "This field is required.",
                },
              })}
              onChange={(e) => {questionSelectHandler(e.target.value, d.id); if (e.target.value != "other") setSelectedQuestion([...selectedQuestion, e.target.value])}}
            >
              <option value="">Select Question</option>
              {
                defaultQues.map((d) => {
                  return <option>{d}</option>
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
                {...register(`is_question_required_${d.id}`)}
                checked={d.isRequired}
                onChange={(e) => {
                  handleChange(
                    d.id,
                    "isRequired",
                    e.target.checked
                  );
                }}
              />
              &nbsp;{t("Required")}
            </label>
            {
              d.other && (
                <div style={{display: "block"}}>
                  <input type="text" placeholder="Enter Question" defaultValue={d.otherVal} onChange={(e) => addOtherQuestion(d.id, e.currentTarget.value)} />
                </div>
              )
            }

            {errors[`is_question_required_${d.id}`] && (
              <div className="invalid-feedback d-block">
                {errors[`is_question_required_${d.id}`].message}
              </div>
            )}
            {(questions.length > 1 && i > 0) && (
              <button
                type="button"
                onClick={() => deleteQuestion(d.id)}
                className={`btn btn-primary ${styles.dash_theem_btn}`}
              >
                DELETE
              </button>
            )}
          </div>
        ))
      } */}

      <div className={styles.next_step_btn_block}>
         <button
        type="button"
        onClick={addQuestion}
        className={`btn btn-primary  ${styles.dash_theem_btn}`}
      >
        ADD
      </button>
                <div className="d-flex gap-2">
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