import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/post_a_job.module.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { getCookies } from "@/fn";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "react-i18next";


const StepThree = ({ setData, trackForm,  validateStep, coreValues, intrestsData, motivateSkills, personalitySummary, psycometrics }) => {
  const { t } = useTranslation('common'); 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
    unregister,
    reset,
    setError,
    getValues,
    setValue
    } = useFormContext();


  const [interests, setInterests] = useState(intrestsData.map((m) => {return {id: String(m.id), title: m.title, description: m.description}}));
  const [top3Interests, setTop3Interests] = useState([]);

  const [careerValues, setCareerValues] = useState(coreValues);
  const [initialTop5CareerValues, setInitialTop5CareerValues] = useState([]);

  const [motivatedSkills, setMotivatedSkills] = useState(motivateSkills);
  const [initialTop5MotivatedSkills, setinitialTop5MotivatedSkills] = useState([]);

  const [selectedPersonality, setSelectedPersonality] = useState([])


  const [checkReaminingWeight, setRemainingWeight] = useState(100)

  const [checkReaminingAptiWeight, setRemainingAptiWeight] = useState(100)


  const [cvrWeight, setCvrWeight] = useState(0);
  const [cirWeight, setCirWeight] = useState(0);
  const [msvrWeight, setMsvrWeight] = useState(0);
  const [pvrWeight, setPvrWeight] = useState(0);

  const [logicalNumberReco, setlogicalNumberReco] = useState(0);
  const [numericalNumberReco, setNumericalReco] = useState(0);
  const [verbalNumberReco, setVervalNumberReco] = useState(0);
  const [situationalNumberReco, setSituationalNumberReco] = useState(0);

  const [show, setShow] = useState(false);

  const [modalContent, setModalContent] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const careerValueRef = useRef(null);
  const careerInterestRef = useRef(null);
  const motivatedSkillRef = useRef(null);
  const personalityValueRef = useRef(null);

  const handleDragEnd = (result, primaryItem, setPrimaryItems, secondaryItems, setSecondaryItems, type, limit) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(
        source.droppableId === type ? primaryItem : secondaryItems
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      source.droppableId === type
        ? setPrimaryItems(items)
        : setSecondaryItems(items);
    } else {
      if (destination.droppableId !== type && secondaryItems.length >=  limit) {
        return ;
      }
      // Moving between lists
      const sourceItems = Array.from(
        source.droppableId === type ? primaryItem : secondaryItems
      );
      const destinationItems = Array.from(
        destination.droppableId === type ? primaryItem : secondaryItems
      );

      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);

      source.droppableId === type
        ? (setPrimaryItems(sourceItems), setSecondaryItems(destinationItems))
        : (setPrimaryItems(destinationItems), setSecondaryItems(sourceItems));

      if (destination.droppableId == type) {
        setValue(`${type}_values`, sourceItems.map(s => s.id))
      } else {
        setValue(`${type}_values`, destinationItems.map(d => d.id))
      }
      clearErrors(`${type}_values`)
    }
  };


  const groupedData = personalitySummary.reduce((acc, item) => {
    if (!acc[item.group_name]) {
      acc[item.group_name] = [];
    }
    acc[item.group_name].push(item);
    return acc;
  }, {"Supreme": [], "Logical": [], "Friendly": [], "Intuitive": [], "Triple & Four-Even": []});

  useEffect(()=> {
    checkRemaining("", 0)
    checkAptitudeRemaining("", 0)
    const personality_values = getValues("personality_values");
    if(personality_values){
      const finalPersonalityValues = personalitySummary.filter((f)=> personality_values.includes(f.id))
      setSelectedPersonality(finalPersonalityValues);
    }


    const career_values = getValues("career_values");
    if(career_values){
      const [filterdData, unFilterdData] = coreValues.reduce((acc, val, index)=> {
        if(career_values.includes(val.id)){
          acc[0].push(val)
        } else{
          acc[1].push(val)
        }
        return acc;
      },[[],[]])
      setInitialTop5CareerValues(filterdData);
      setCareerValues(unFilterdData);
    }

    const interests_values = getValues("interests_values");
    if(interests_values){
      const [filterdData, unFilterdData] = intrestsData.reduce((acc, val, index)=> {
        if(interests_values.includes(String(val.id))){
          acc[0].push({...val, id: String(val.id)})
        } else{
          acc[1].push({...val, id: String(val.id)})
        }
        return acc;
      },[[],[]])
      setTop3Interests(filterdData);
      setInterests(unFilterdData);
    }

    const skills_values = getValues("skills_values");
    if(skills_values){
      const [filterdData, unFilterdData] = motivateSkills.reduce((acc, val, index)=> {
        if(skills_values.includes(val.id)){
          acc[0].push(val)
        } else{
          acc[1].push(val)
        }
        return acc;
      },[[],[]])
      setinitialTop5MotivatedSkills(filterdData);
      setMotivatedSkills(unFilterdData);
    }

    for (const i of psycometrics) {

      switch (i.slug) {
        case "career_weight": {
          setCvrWeight(i.value)
          break;
        }

        case "interest_weight": {
          setCirWeight(i.value)
          break;
        }

        case "skill_weight": {
          setMsvrWeight(i.value)
          break;
        }

        case "personality_weight": {
          setPvrWeight(i.value)
          break;
        }


        case "logical_number": {
          setlogicalNumberReco(i.value)
          break;
        }

        case "numerical_number": {
          setNumericalReco(i.value)
          break;
        }

        case "verbal_number": {
          setVervalNumberReco(i.value)
          break;
        }

        case "situational_number": {
          setSituationalNumberReco(i.value)
          break;
        }
          
        default:
          break;
      }
    }

    window.scrollTo(0,0);
  },[])

  const myhandleSubmit = () => {
    const data = getValues();
    console.log("data : ", data)
  
    if ((checkReaminingWeight > 0 || Number(data.personality_weight) > 0) && data.personality_weight && data.personality_weight != 0 && (!selectedPersonality || selectedPersonality.length < 5)) {
      setError("personality_values", { message: "Please select top 5 personality type." });
      if (personalityValueRef.current) {

        personalityValueRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      clearErrors("personality_values")
    }

    if ((checkReaminingWeight > 0 || Number(data.skill_weight) > 0) && (!data.skills_values || data.skills_values?.length < 5)) {
      setError("skills_values", { message: "Please select top 5 motivated skills." });
      if (motivatedSkillRef.current) {
        motivatedSkillRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      clearErrors("skills_values")
    }

    console.log("data.i", Number(data.interest_weight));
    
    if ((checkReaminingWeight > 0 || Number(data.interest_weight) > 0) && (!data.interests_values || data.interests_values?.length < 3)) {
      setError("interests_values", { message: "Please select top 3 career interest." });
      if (careerInterestRef.current) {

        careerInterestRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      clearErrors("interests_values")
    }

    if ((checkReaminingWeight > 0 || Number(data.career_weight) > 0) && (!data.career_values || data.career_values.length < 5)) {
      setError("career_values", { message: "Please select top 5 career values." });
      if (careerValueRef.current) {
        careerValueRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      clearErrors("career_values")
    }

    if (Object.entries(errors).length <= 0) {
      handleSubmit(onSubmit)();
    }

  }

  const onSubmit = async (data) => {
    console.log("data : ", data);
    let aptitudeWeigthTotal = (Number(data.logical_number)+Number(data.numerical_number)+Number(data.verbal_number)+Number(data.situational_number));

    if (checkReaminingWeight < 0 || checkReaminingWeight > 0) {
      toast.error("Please ensure total Psychometric weight % equals 100%");
      return false;
    }

    if (aptitudeWeigthTotal < 100 || aptitudeWeigthTotal > 100) {
      toast.error("Please ensure total Aptitude weight % equals 100%");
      return false;
    }


    if(data.career_weight && data.career_weight != "0" && (!data.career_values || data.career_values.length <= 0)){
      setError("career_values", {message: "This field is required."});
      if (careerValueRef.current) {
        careerValueRef.current.scrollIntoView({behavior: "smooth", block: "center"});
      }
      return false;
    } else {
      clearErrors("career_values")
    }

    if(data.interest_weight && data.interest_weight != "0" && (!data.interests_values || data.interests_values.length <= 0)){
      setError("interests_values");
      if(careerInterestRef.current) {

        careerInterestRef.current.scrollIntoView({behavior: "smooth", block: "center"})
      }
      return false;
    }  else {
      clearErrors("interests_values")
    }

    if(data.skill_weight && data.skill_weight != "0" && (!data.skills_values || data.skills_values.length <= 0)){
      setError("skills_values", {message: "This field is required."});
      if(motivatedSkillRef.current) {

        motivatedSkillRef.current.scrollIntoView({behavior: "smooth", block: "center"})
      }
      return false;
    }  else {
      clearErrors("skills_values")
    }
    
    if (data.personality_weight && data.personality_weight != "0" && (!selectedPersonality || selectedPersonality.length <= 0)) {
      setError("personality_values", {message: "This field is required."});
      if(personalityValueRef.current) {
        personalityValueRef.current.scrollIntoView({behavior: "smooth", block: "center"})
      }
      return false;
    }  else {
      clearErrors("personality_values")
    }


    let aptitudeWeight = (aptitudeWeigthTotal/40)*100;

    setValue("aptitude_weight", Math.ceil(aptitudeWeight));

    // setValue("personality_values", selectedPersonality);

    validateStep(3)
    trackForm(4);
    // setData(4);

  };

  const skipPage = async () => {

    unregister("career_weight");
    unregister("interest_weight");
    unregister("skill_weight");
    unregister("personality_weight");
    unregister("aptitude_weight");

    unregister("interests_values");
    unregister("personality_values");
    unregister("career_values");
    unregister("skills_values");

    unregister("logical_number");
    unregister("numerical_number");
    unregister("situational_number");
    unregister("verbal_number");
    
    validateStep(3)
    trackForm(4);
    // setData(4);
  }

  const handlePersonality = (e, item, isDelete) => {
    let finalVal = []
      if (!e.target.checked || isDelete) {
        let d = selectedPersonality.filter((f) => f.id != item.id);
        finalVal = d;
        if (isDelete) {
          const elem = document.getElementById(`${item.group_name}_${item.id}`);
          elem.nextElementSibling.click();
          elem.removeAttribute("checked")
        }
      } else {
        clearErrors("personality_values")
        finalVal = [...selectedPersonality, item];
      }
      setSelectedPersonality(finalVal)
      let ids = finalVal.map((m) => m.id);
      setValue("personality_values", ids)
  }

  const checkRemaining = (type, val) => {
    const c = (type == "career_weight") ? val || 0 : (watch("career_weight") || 0);
    const i = (type == "interest_weight") ? val || 0 : (watch("interest_weight") || 0);
    const s = (type == "skill_weight") ? val || 0 : (watch("skill_weight") || 0);
    const p = (type == "personality_weight") ? val || 0 : (watch("personality_weight") || 0);
    let total = 100 - (parseInt(c)+parseInt(i)+parseInt(s)+parseInt(p));
    setRemainingWeight((total || total >= 0) ? total : 100)
  }

  const checkAptitudeRemaining = (type, val) => {

    const c = (type == "logical_number") ? (val || 0) : (watch("logical_number") || 0);
    const i = (type == "numerical_number") ? (val || 0) : (watch("numerical_number") || 0);
    const s = (type == "verbal_number") ? (val || 0) : (watch("verbal_number") || 0);
    const p = (type == "situational_number") ? (val || 0) : (watch("situational_number") || 0);

    let total = 100 - (parseInt(c) + parseInt(i) + parseInt(s) + parseInt(p));
    setRemainingAptiWeight((total || total >= 0) ? total : 100)

  }


  const handleChange = (e, type) => {
    const { value } = e.target;
    setValue(type, value);
    checkRemaining(type, value);

    if (e.target.value == "0") {
      switch (type) {
        case "career_weight": {
  
          clearErrors("career_values")
          break;
        }
        
        case "interest_weight": {
          clearErrors("interests_values")
          break;          
        }
        
        case "skill_weight": {
          clearErrors("skills_values")
          break;          
        }
        
        case "personality_weight": {
          clearErrors("personality_values")
          break;
        } 
      
        default:
          break;
      }
    }
  };

  const setRecommandedScorePsyco = () => {

    setValue("career_weight", cvrWeight);
    setValue("interest_weight", cirWeight);
    setValue("skill_weight", msvrWeight);
    setValue("personality_weight", pvrWeight);
    setTimeout(() => {
      checkRemaining("","")
    }, 2000);
  }

  const setRecommandedScore = () => {

    setValue("logical_number", logicalNumberReco);
    setValue("numerical_number", numericalNumberReco);
    setValue("verbal_number", verbalNumberReco);
    setValue("situational_number", situationalNumberReco);

    setTimeout(() => {
      checkRemaining("","")
    }, 2000);
}

  return (
    <>
      <div className={` border-0 ${styles.inner_box}`} style={{"display": "flex"}}>
        <div>
            <h3 className={styles.inner_box_title}> {t("Assessment")} {t("Analysis")}</h3>
            <p className={styles.inner_box_subtitle}>
            {t("Incorporating Assessment Analysis into your screening process enhances selection by providing insights into candidates' skills and competencies, leading to better hiring decisions. This information won’t be displayed publicly")}
            </p>
        </div>
        <button onClick={() => skipPage()} className={styles.next_btn}>
          {t("Skip")}
        </button>
      </div>
      <div className={`${styles.psychomet_scoreDiv} ${styles.psychomet_scoreBlock}`}>
        <div className={styles.screening_assessment_top}>
            <div className={styles.screening_assessment_content}>
                <h4 className={styles.inner_box_title}>{t("Psychometric")} {t("Assessment")}</h4>
                <p>{t("In this part, you define the criteria for selected candidates in terms of Career Values, Interests, Motivated Skills, and Personality Type. You also have the option to define the percentage of importance weight for each section or use our default weighting")}</p>
            </div>
           <button className="post_btn border-0"  onClick={() => setRecommandedScorePsyco()}>{t("Use")} {t("Default")} {t("Weighting")}</button>
        </div>
       
      </div>
      <div className={styles.job_details_box}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={`${styles.post_job_left_section} ${styles.weighting_box}`}>
              <h3 className={`${styles.inner_box_title} ${styles.extra_title}`}>{t("Career")} {t("Values")}</h3>
              <div className={styles.weighting_scoreBox}>
                <div className={styles.form_group}>
                  <label className={styles.form_labelWeighting}>{t("Weighting")} :</label>
                  <div className={styles.form_InputFlex}>
                  {(checkReaminingWeight <= 0 || checkReaminingWeight > 0) && <input type="number" className={styles.form_InputWeighting}
                      {...register("career_weight", {
                        required: {
                          value: (checkReaminingWeight > 0) ? true : false,
                          message: "This field is required"
                        },
                        max: {
                          value: 100,
                          message: "Invalid Career Weight"
                        },
                        validate: (value) => (checkReaminingWeight <= 0 && value >= "0") || 'This field is required'
                      })}

                      onChange={(e) => handleChange(e, "career_weight")}
                      placeholder="25%" min="0" />}
                    <span className={styles.form_leftWeighting}>{checkReaminingWeight}% {t("left")}</span>
                  </div>
                  {errors['career_weight'] && <><span className="text-danger">{errors['career_weight'].message}</span><br /></>}
                  <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                  <h3 className={styles.form_scoreWeighting}>{cvrWeight}</h3>
                </div>
              </div>
            </div>
          </div>
          <DragDropContext onDragEnd={(result) => {
            // handleDragEnd(result, interests, setInterests, top3Interests, setTop3Interests);
            handleDragEnd(result, careerValues, setCareerValues, initialTop5CareerValues, setInitialTop5CareerValues, "career", 5);
            // handleDragEnd(result, motivatedSkills, setMotivatedSkills, initialTop5MotivatedSkills, setinitialTop5MotivatedSkills);
          }}>
          <div className="col-sm-8">
            <div className={styles.choose_careerBlock}>
              <div className="row">
                <div className="col-md-6 col-xxl-4">
                  <div className={styles.choose_valueDiv}>
                    <h4 className={styles.choose_valueTitle}>
                      {t("Choose")} {t("Values")}
                    </h4>
                    <Droppable droppableId="career">
                      {(provided) => (
                        <ul
                          className={`${styles.choose_valueScroll} ${styles.interest_valueBox}`}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {careerValues.map((career, index) => (
                            <Draggable
                              key={career.id}
                              draggableId={career.id}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <a
                                    href="#!"
                                    className={styles.choose_valueContent}
                                  >
                                    {career.content}
                                    <OverlayTrigger
                                          delay={{ hide: 450, show: 300 }}
                                          overlay={(props) => (
                                            <Tooltip {...props}>
                                              {"" + career.description + "" || <>&nbsp;</>}
                                            </Tooltip>
                                          )}
                                          placement="top"
                                        >
                                          <span>
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g clip-path="url(#clip0_1553_14029)">
                                                <path
                                                  d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z"
                                                  fill="#A8ADB7"
                                                />
                                                <path
                                                  d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z"
                                                  fill="#A8ADB7"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1553_14029">
                                                  <rect
                                                    width="14"
                                                    height="14"
                                                    fill="white"
                                                  />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                          </span>
                                    </OverlayTrigger>
                                  </a>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </div>
                </div>
                <div className="col-md-6 col-xxl-4">
                  <div className={styles.five_valueDiv}>
                    <h4 className={styles.choose_valueTitle} ref={careerValueRef}>
                      {t("Top")} 5 {t("Career")} {t("Values")}
                    </h4>
                    {errors['career_values'] && <span className="text-danger">{errors['career_values'].message}</span>}
                    <Droppable droppableId="top5career">
                      {(provided) => (
                        <ul
                          className={`${styles.five_valueScroll} ${styles.extra_content}`}
                          style={{ background: "#DDF6D4" }}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {initialTop5CareerValues.map((careerTop5, index) => (
                            <Draggable
                              key={careerTop5?.id}
                              draggableId={careerTop5?.id}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className={styles.five_valueContent} style={{position: "relative"}}>
                                    {careerTop5?.content}
                                    <span style={{"textAlign": "right", position: "absolute", right: "7px"}}>
                                        <OverlayTrigger
                                              delay={{ hide: 450, show: 300 }}
                                              overlay={(props) => (
                                                <Tooltip {...props}>
                                                  {"" + careerTop5.description + "" || <>&nbsp;</>}
                                                </Tooltip>
                                              )}
                                              placement="top"
                                            >
                                              <span>
                                                <svg
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 14 14"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <g clip-path="url(#clip0_1553_14029)">
                                                    <path
                                                      d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z"
                                                      fill="#A8ADB7"
                                                    />
                                                    <path
                                                      d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z"
                                                      fill="#A8ADB7"
                                                    />
                                                  </g>
                                                  <defs>
                                                    <clipPath id="clip0_1553_14029">
                                                      <rect
                                                        width="14"
                                                        height="14"
                                                        fill="white"
                                                      />
                                                    </clipPath>
                                                  </defs>
                                                </svg>
                                              </span>
                                        </OverlayTrigger>
                                      </span>
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                   
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.choose_availableText}>
              {t("Total")} {coreValues.length} {t("Career")} {t("Values")} {t("Available")}
            </div>
          </div>
          </DragDropContext>
        </div>
      </div>
      <div className={styles.job_details_box}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={`${styles.post_job_left_section} ${styles.weighting_box}`}>
              <h3 className={`${styles.inner_box_title} ${styles.extra_title}`}>{t("Career")} {t("Interest")}</h3>
              <div className={styles.weighting_scoreBox}>
                <div className={styles.form_group}>
                  <label className={styles.form_labelWeighting}>{t("Weighting")} :</label>
                  <div className={styles.form_InputFlex}>
                  <input type="number"
                      {...register("interest_weight", {
                        required: {
                          value: (checkReaminingWeight > 0) ? true : false,
                          message: "This field is required"
                        },
                        max: {
                          value: 100,
                          message: "Invalid Interest Weight"
                        },
                        validate: (value) => (checkReaminingWeight <= 0 && value >= "0") || 'This field is required'
                      })}

                      onChange={(e) => {handleChange(e, "interest_weight")} }
                      className={styles.form_InputWeighting} placeholder="25%" min="0" />
                    <span className={styles.form_leftWeighting}>{checkReaminingWeight}% {t("left")}</span>
                  </div>
                  {errors['interest_weight'] && <><span className="text-danger">{errors['interest_weight'].message}</span><br /></>}
                  
                  <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                  <h3 className={styles.form_scoreWeighting}>{cirWeight}</h3>
                </div>
              </div>
            </div>
          </div>
          <DragDropContext onDragEnd={(result) => {
            handleDragEnd(result, interests, setInterests, top3Interests, setTop3Interests, "interests", 3);
          }}>
            <div className="col-sm-8">
              <div className={styles.choose_careerBlock}>
                <div className="row">
                  <div className="col-md-6 col-xxl-4">
                    <div className={styles.choose_valueDiv}>
                      <h4 className={styles.choose_valueTitle}>
                        {t("Choose")} {t("Interest")} {t("Profile")}
                      </h4>
                      <Droppable droppableId="interests">
                        {(provided) => (
                          <ul
                            className={`${styles.choose_valueScroll} ${styles.interest_valueBox}`}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {interests.map((interest, index) => (
                              <Draggable
                                key={String(interest?.id)}
                                draggableId={String(interest?.id)}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <a
                                      href="#!"
                                      className={styles.choose_valueContent}
                                    >
                                      {interest?.title}
                                        <OverlayTrigger
                                          delay={{ hide: 450, show: 300 }}
                                          overlay={(props) => (
                                            <Tooltip {...props}>
                                              {"" + interest.description + "" || <>&nbsp;</>}
                                            </Tooltip>
                                          )}
                                          placement="top"
                                        >
                                          <span>
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g clip-path="url(#clip0_1553_14029)">
                                                <path
                                                  d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z"
                                                  fill="#A8ADB7"
                                                />
                                                <path
                                                  d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z"
                                                  fill="#A8ADB7"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1553_14029">
                                                  <rect
                                                    width="14"
                                                    height="14"
                                                    fill="white"
                                                  />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                          </span>
                                        </OverlayTrigger>
                                    </a>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  </div>
                  <div className="col-md-6 col-xxl-4">
                    <div className={styles.five_valueDiv}>
                      <h4 className={styles.choose_valueTitle} ref={careerInterestRef}>
                        {t("Top")} 3 {t("Interests")} {t("Profile")}
                      </h4>
                      {errors['interests_values'] && <span className="text-danger">{errors['interests_values'].message}</span>}
                      <Droppable droppableId="top3Interests">
                        {(provided) => (
                          <ul
                            className={`${styles.five_valueScroll} ${styles.extra_content}`}
                            style={{ background: '#FBEDD9' }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {top3Interests.map((interest, index) => (
                              <Draggable
                                key={String(interest?.id)}
                                draggableId={String(interest?.id)}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className={styles.five_valueContent} style={{position: "relative"}}>
                                      {interest?.title}
                                      <span style={{"textAlign": "right", position: "absolute", right: "7px"}}>

                                        <OverlayTrigger
                                          delay={{ hide: 450, show: 300 }}
                                          overlay={(props) => (
                                            <Tooltip {...props}>
                                              {"" + interest.description + "" || <>&nbsp;</>}
                                            </Tooltip>
                                          )}
                                          placement="top"
                                        >
                                          <span>
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g clip-path="url(#clip0_1553_14029)">
                                                <path
                                                  d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z"
                                                  fill="#A8ADB7"
                                                />
                                                <path
                                                  d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z"
                                                  fill="#A8ADB7"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1553_14029">
                                                  <rect
                                                    width="14"
                                                    height="14"
                                                    fill="white"
                                                  />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                          </span>
                                        </OverlayTrigger>
                                      </span>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.choose_availableText}>
                {t("Total")} {intrestsData.length} {t("Career")} {t("Interest")} {t("Profile")} {t("Available")}
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>
      <div className={styles.job_details_box}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={`${styles.post_job_left_section} ${styles.weighting_box}`}>
              <h3 className={`${styles.inner_box_title} ${styles.extra_title}`}>{t("Motivated")} {t("Skills")}</h3>
              <div className={styles.weighting_scoreBox}>
                <div className={styles.form_group}>
                  <label className={styles.form_labelWeighting}>{t("Weighting")} :</label>
                  <div className={styles.form_InputFlex}>
                  <input type="number"
                      {...register("skill_weight", {
                        required: {
                          value: (checkReaminingWeight > 0) ? true : false,
                          message: "This field is required"
                        },
                        
                        max: {
                          value: 100,
                          message: "Invalid Skill Weight"
                        },
                        validate: (value) => (checkReaminingWeight <= 0 && value >= "0") || 'This field is required'
                      })}

                      onChange={(e) => handleChange(e, "skill_weight")}
                      className={styles.form_InputWeighting} placeholder="25%" min="0" />
                    <span className={styles.form_leftWeighting}>{checkReaminingWeight}% {t("left")}</span>
                  </div>
                  {errors['skill_weight'] && <><span className="text-danger">{errors['skill_weight'].message}</span><br /></>}
                  <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                  <h3 className={styles.form_scoreWeighting}>{msvrWeight}</h3>
                </div>
              </div>
            </div>
          </div>
          <DragDropContext onDragEnd={(result) => {
            handleDragEnd(result, motivatedSkills, setMotivatedSkills, initialTop5MotivatedSkills, setinitialTop5MotivatedSkills, "skills", 5);
            //handleDragEnd(result, motivatedSkills, setMotivatedSkills, initialTop5MotivatedSkills, setinitialTop5MotivatedSkills);
          }}>
            <div className="col-sm-8">
              <div className={styles.choose_careerBlock}>
                <div className="row">
                  <div className="col-md-6 col-xxl-4">
                    <div className={styles.choose_valueDiv}>
                      <h4 className={styles.choose_valueTitle}>
                        {t("Choose")} {t("Skills")}
                      </h4>
                      <Droppable droppableId="skills">
                        {(provided) => (
                          <ul 
                            className={styles.choose_valueScroll}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {motivatedSkills.map((skills, index) => (
                                <Draggable
                                  key={skills?.id}
                                  draggableId={skills?.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <a
                                        href="#!"
                                        className={styles.choose_valueContent}
                                      >
                                        {skills?.content}
                                        <OverlayTrigger
                                          delay={{ hide: 450, show: 300 }}
                                          overlay={(props) => (
                                            <Tooltip {...props}>
                                              {"" + skills.description + "" || <>&nbsp;</>}
                                            </Tooltip>
                                          )}
                                          placement="top"
                                        >
                                          <span>
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g clip-path="url(#clip0_1553_14029)">
                                                <path
                                                  d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z"
                                                  fill="#A8ADB7"
                                                />
                                                <path
                                                  d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z"
                                                  fill="#A8ADB7"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1553_14029">
                                                  <rect
                                                    width="14"
                                                    height="14"
                                                    fill="white"
                                                  />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                          </span>
                                        </OverlayTrigger>
                                        </a>
                                    </li>
                                  )}
                                </Draggable>
                              ))}

                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  </div>
                  <div className="col-md-6 col-xxl-4">
                    <div className={styles.five_valueDiv}>
                      <h4 className={styles.choose_valueTitle} ref={motivatedSkillRef}>
                        {t("Top")} 5 {t("Motivated")} {t("Skills")}
                      </h4>
                      {errors['skills_values'] && <span className="text-danger">{errors['skills_values'].message}</span>}
                      <Droppable droppableId="top5skills">
                        {(provided) => (
                          <ul
                            className={`${styles.five_valueScroll} ${styles.extra_content}`}
                            style={{ background: "#E7E6FB" }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {initialTop5MotivatedSkills.map((skill, index) => (
                              <Draggable
                                key={skill?.id}
                                draggableId={skill?.id}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className={styles.five_valueContent} style={{position: "relative"}}>
                                      {skill?.content}
                                        <span style={{"textAlign": "right", position: "absolute", right: "7px"}}>

                                          <OverlayTrigger
                                            delay={{ hide: 450, show: 300 }}
                                            overlay={(props) => (
                                              <Tooltip {...props}>
                                                {"" + skill.description + "" || <>&nbsp;</>}
                                              </Tooltip>
                                            )}
                                            placement="top"
                                          >
                                            <span>
                                              <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <g clip-path="url(#clip0_1553_14029)">
                                                  <path
                                                    d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z"
                                                    fill="#A8ADB7"
                                                  />
                                                  <path
                                                    d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z"
                                                    fill="#A8ADB7"
                                                  />
                                                </g>
                                                <defs>
                                                  <clipPath id="clip0_1553_14029">
                                                    <rect
                                                      width="14"
                                                      height="14"
                                                      fill="white"
                                                    />
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                            </span>
                                          </OverlayTrigger>
                                        </span>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                      
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.choose_availableText}>
                {t("Total")} {motivateSkills.length} {t("Motivated")} {t("Skills")} {t("Available")}
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>
      <div className={`border-bottom-0 ${styles.job_details_box}`}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
            <div className={`${styles.post_job_left_section} ${styles.weighting_box}`}>
              <h3 className={`${styles.inner_box_title} ${styles.extra_title}`}>{t("Personality")} {t("Type")}</h3>
              <div className={styles.weighting_scoreBox}>
                <div className={styles.form_group}>
                  <label className={styles.form_labelWeighting}>{t("Weighting")} :</label>
                  <div className={styles.form_InputFlex}>
                  <input type="number"
                      {...register("personality_weight", {
                        required: {
                          value: (checkReaminingWeight > 0) ? true : false,
                          message: "This field is required"
                        },
                        max: {
                          value: 100,
                          message: "Invalid Personality Weight"
                        },
                        validate: (value) => (checkReaminingWeight <= 0 && value >= "0") || 'This field is required'
                      })}
                      onChange={(e) => handleChange(e, "personality_weight")}
                      className={styles.form_InputWeighting} placeholder="25%" min="0" />
                    <span className={styles.form_leftWeighting}>{checkReaminingWeight}% {t("left")}</span>
                  </div>
                  {errors['personality_weight'] && <><span className="text-danger">{errors['personality_weight'].message}</span><br /></>}
                  <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                  <h3 className={styles.form_scoreWeighting}>{pvrWeight}</h3>
                </div>
              </div>
            </div>

          </div>
          <div className="col-sm-8">
            <div className={styles.choose_careerBlock}>
              <h4 className={styles.choose_valueTitle}> {t("Choose")} {t("Type")} </h4>
              <div className={styles.personalityType_box}>
                <span className={styles.personality_typeText} ref={personalityValueRef}>
                  {t("Top")} 5 {t("Personality")} {t("Type")}
                </span>
                {errors['personality_values'] && <span className="text-danger">{errors['personality_values'].message}</span>}
                <div className={styles.personality_type_list}>
                  {
                    selectedPersonality.map((l, i) => {
                      return (
                        
                               <span className={styles.personality_type_Item} key={i}>
                            {l.title}
                            <div >
                              <span className={styles.personal_typeCheck} style={{ padding: "0", margin: "0" }} onClick={() => { handleShow(); setModalContent({ title: l.title, description: l.description }) }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1553_14029)"><path d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z" fill="#A8ADB7"></path><path d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z" fill="#A8ADB7"></path></g><defs><clipPath id="clip0_1553_14029"><rect width="14" height="14" fill="white"></rect></clipPath></defs></svg></span>
                            </div>
                            <label className={styles.personality_closeBtn} onClick={(e) => handlePersonality(e, l, true)}>
                            {/* <button  > */}
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M0.293031 1.29259C0.480558 1.10512 0.734866 0.999806 1.00003 0.999806C1.26519 0.999806 1.5195 1.10512 1.70703 1.29259L6.00003 5.58559L10.293 1.29259C10.3853 1.19708 10.4956 1.1209 10.6176 1.06849C10.7396 1.01608 10.8708 0.988496 11.0036 0.987342C11.1364 0.986189 11.2681 1.01149 11.391 1.06177C11.5139 1.11205 11.6255 1.18631 11.7194 1.2802C11.8133 1.37409 11.8876 1.48574 11.9378 1.60864C11.9881 1.73154 12.0134 1.86322 12.0123 1.99599C12.0111 2.12877 11.9835 2.25999 11.9311 2.382C11.8787 2.504 11.8025 2.61435 11.707 2.70659L7.41403 6.99959L11.707 11.2926C11.8892 11.4812 11.99 11.7338 11.9877 11.996C11.9854 12.2582 11.8803 12.509 11.6948 12.6944C11.5094 12.8798 11.2586 12.985 10.9964 12.9873C10.7342 12.9895 10.4816 12.8888 10.293 12.7066L6.00003 8.41359L1.70703 12.7066C1.51843 12.8888 1.26583 12.9895 1.00363 12.9873C0.741432 12.985 0.49062 12.8798 0.305212 12.6944C0.119804 12.509 0.0146347 12.2582 0.0123563 11.996C0.0100779 11.7338 0.110873 11.4812 0.293031 11.2926L4.58603 6.99959L0.293031 2.70659C0.10556 2.51907 0.000244141 2.26476 0.000244141 1.99959C0.000244141 1.73443 0.10556 1.48012 0.293031 1.29259Z"
                                  fill="currentcolor"
                                />
                              </svg>
                        </label>
                          </span>
                      )
                    })
                  }
                </div>
              </div>
              
               <ul className={styles.commanding_typeStep}>
                  {Object.keys(groupedData).map((groupName, groupIndex) => (
                    <li className={styles.commanding_typeLi} key={groupIndex}>
                      <span className={styles.commanding_typeNumber}>{groupIndex + 1}</span>
                      <span className={styles.commanding_typeText}>
                        {groupName} {t("Styles")}
                      </span>
                      <div className={styles.commanding_type_list}>
                        {groupedData[groupName].map((item, itemIndex) => (
                          <div className={styles.form_check} key={item.id} style={{display:"flex", alignItems: "center"}}>
                            {/* <input type="checkbox" id={`${groupName}_${item.id}`} name={`personality_values`}  {...register("personality_values", {required: watch("personality_weight") ? true : false})} onChange={(e) => handlePersonality(e, item, false) } />
                            <label htmlFor={`${groupName}_${item.id}`} className={styles.personal_typeCheck}>
                              {item.title}
                            </label> */}

                              <input type="checkbox" id={`${groupName}_${item.id}`} checked={watch("personality_values")?.includes(item.id)} name={`${groupName}_box`} disabled={(selectedPersonality.length >= 5) ? true : false} onChange={(e) => handlePersonality(e, item, false) } />
                              <label htmlFor={`${groupName}_${item.id}`} className={styles.personal_typeCheck} style={{"paddingRight": "10px"}}>
                                {item.title}
                                
                              </label>
                              <div  className={styles.infoTooltip} style={{height: "100%", display: "flex", background: "#F8F8FD", paddingRight: '10px', alignItems: "center"}}>
                              <span className={styles.personal_typeCheck} style={{padding: "0", margin: "0"}} onClick={() => {handleShow(); setModalContent({title: item.title, description: item.description})}}><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1553_14029)"><path d="M7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 5.37555 1.52031 3.81763 2.66897 2.66897C3.81763 1.52031 5.37555 0.875 7 0.875C8.62445 0.875 10.1824 1.52031 11.331 2.66897C12.4797 3.81763 13.125 5.37555 13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125ZM7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14Z" fill="#A8ADB7"></path><path d="M7.81371 5.7645L5.80996 6.01562L5.73821 6.34812L6.13196 6.42075C6.38921 6.482 6.43996 6.57475 6.38396 6.83113L5.73821 9.86562C5.56846 10.6505 5.83008 11.0197 6.44521 11.0197C6.92208 11.0197 7.47596 10.7993 7.72708 10.4965L7.80408 10.1325C7.62908 10.2865 7.37358 10.3478 7.20383 10.3478C6.96321 10.3478 6.87571 10.1789 6.93783 9.88138L7.81371 5.7645ZM7.87496 3.9375C7.87496 4.16956 7.78277 4.39212 7.61868 4.55622C7.45458 4.72031 7.23202 4.8125 6.99996 4.8125C6.76789 4.8125 6.54533 4.72031 6.38124 4.55622C6.21715 4.39212 6.12496 4.16956 6.12496 3.9375C6.12496 3.70544 6.21715 3.48288 6.38124 3.31878C6.54533 3.15469 6.76789 3.0625 6.99996 3.0625C7.23202 3.0625 7.45458 3.15469 7.61868 3.31878C7.78277 3.48288 7.87496 3.70544 7.87496 3.9375Z" fill="#A8ADB7"></path></g><defs><clipPath id="clip0_1553_14029"><rect width="14" height="14" fill="white"></rect></clipPath></defs></svg></span>
                              </div>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
            <div className={styles.choose_availableText}>
              {t("Total")} {personalitySummary.length} {t("Personality")} {t("Types")} {t("Available")}
            </div>
          </div>
        </div>
      </div>
      <div className={`mb-0 mt-4 ${styles.psychomet_scoreDiv}`}>
          <div className={styles.screening_assessment_top}>
                  <div className={styles.screening_assessment_content}>
                        <h4 className={styles.inner_box_title}>{t("Aptitude")} {t("Assessment")}</h4>
                        <p>{t("In this part, you define the criteria for selected candidates in terms of Logical, Numerical, Verbal & Situational skills. You also have the option to define the percentage of importance weight for each section or use our default weighting")}</p>
                  </div>
                  <button class="post_btn border-0" onClick={() => setRecommandedScore()}>{t("Use")} {t("Default")} {t("Weighting")}</button>
          </div>        
      </div>
      {console.log(">>>>>>>>>", errors)}
      <div className={styles.job_details_box}>
        <div className={`row ${styles.row_gap}`}>
          <div className="col-sm-4">
          </div>
          <div className="col-sm-8">
            <div className={styles.choose_careerBlock}>
              <h4 className={styles.choose_valueTitle}> {t("Set")} {t("Weighting")} </h4>
              <div className={styles.inputScore_box}>
              <div className={styles.inputScore_flex}>
                  <input type="text" className={styles.inputScore} value="Logical" />
                  <div>
                    <div className={styles.input_groupflex} style={{ display: "inline-block" }}>
                      <input type="text" className={styles.inputScore} max={10} {...register("logical_number", { required: { value: true, message: "This field is required." }, max: { value: (100 - (parseInt(watch("situational_number") || 0) + parseInt(watch("numerical_number") || 0) + parseInt(watch("verbal_number") || 0))), message: "Total Weight must be equal 100%." } })} placeholder="25%" 
                      onChange={(e) => checkAptitudeRemaining("logical_number", e.target.value)}
                      />
                      <span className={styles.inputScore_presnt}>%</span>
                    </div>
                    &nbsp;<span className={styles.form_leftWeighting}>{checkReaminingAptiWeight}% {t("left")}</span>
                    <div>
                      {errors['logical_number'] && <span className="text-danger">{errors["logical_number"].message}</span>}
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                    <h3 className={styles.form_scoreWeighting}>{logicalNumberReco}</h3>
                  </div>

                </div>
                <div className={styles.inputScore_flex}>
                  <input type="text" className={styles.inputScore} value="Numerical" />
                  <div>
                    <div className={styles.input_groupflex} style={{ display: "inline-block" }}>
                      <input type="text" className={styles.inputScore} max={10} {...register("numerical_number", { required: { value: true, message: "This field is required." }, max: { value: (100 - (parseInt(watch("situational_number") || 0) + parseInt(watch("logical_number") || 0) + parseInt(watch("verbal_number") || 0))), message: "Total Weight must be equal 100%." } })} placeholder="25%" 
                      onChange={(e) => checkAptitudeRemaining("numerical_number", e.target.value)}
                      />
                      <span className={styles.inputScore_presnt}>%</span>
                    </div>
                    &nbsp;<span className={styles.form_leftWeighting}>{checkReaminingAptiWeight}% {t("left")}</span>
                    <div>
                      {errors['numerical_number'] && <span className="text-danger">{errors["numerical_number"].message}</span>}
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                    <h3 className={styles.form_scoreWeighting}>{numericalNumberReco}</h3>
                  </div>


                </div>
                <div className={styles.inputScore_flex}>
                  <input type="text" className={styles.inputScore} value="Verbal" />
                  <div>
                    <div className={styles.input_groupflex} style={{ display: "inline-block" }}>
                      <input type="text" className={styles.inputScore} max={10} {...register("verbal_number", { required: { value: true, message: "This field is required." }, max: { value: (100 - (parseInt(watch("situational_number") || 0) + parseInt(watch("logical_number") || 0) + parseInt(watch("numerical_number") || 0))), message: "Total Weight must be equal 100%." } })} placeholder="25%" 
                      onChange={(e) => checkAptitudeRemaining("verbal_number", e.target.value)}
                      />
                      <span className={styles.inputScore_presnt}>%</span>
                    </div>
                    &nbsp;<span className={styles.form_leftWeighting}>{checkReaminingAptiWeight}% {t("left")}</span>
                    <div>
                      {errors['verbal_number'] && <span className="text-danger">{errors["verbal_number"].message}</span>}
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                    <h3 className={styles.form_scoreWeighting}>{verbalNumberReco}</h3>
                  </div>

                </div>
                <div className={styles.inputScore_flex}>
                  <input type="text" className={styles.inputScore} value="Situational" />
                  <div>
                    <div className={styles.input_groupflex} style={{ display: "inline-block" }}>
                      <input type="text" className={styles.inputScore} max={10} {...register("situational_number", { required: { value: true, message: "This field is required." }, max: { value: (100 - (parseInt(watch("verbal_number") || 0) + parseInt(watch("logical_number") || 0) + parseInt(watch("numerical_number") || 0))), message: "Total Weight must be equal 100%." } })} placeholder="25%" 
                      onChange={(e) => checkAptitudeRemaining("situational_number", e.target.value)}
                      />
                      <span className={styles.inputScore_presnt}>%</span>
                    </div>
                    &nbsp;<span className={styles.form_leftWeighting}>{checkReaminingAptiWeight}% {t("left")}</span>
                    <div>
                      {errors['situational_number'] && <span className="text-danger">{errors["situational_number"].message}</span>}
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <span className={styles.form_recommendedText}>{t("Recommended")} {t("Weight")}%</span>
                    <h3 className={styles.form_scoreWeighting}>{situationalNumberReco}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.next_step_btn_block}>
        <button onClick={() => skipPage()} className={styles.next_btn}>
          {t("Skip")}
        </button>
        <button onClick={myhandleSubmit} className={styles.next_btn}>
          {t("Next")} {t("Step")}
        </button>
      </div>


      <Modal
        className={styles.modalBox}
        show={show}
        onHide={handleClose}
        size="lg" 
      >
          <Modal.Header>
          <h3 style={{textAlign: "center"}}>
            {modalContent.title}
          </h3> 
        </Modal.Header>
        <Modal.Body className="p-0 border-0">
        <div className={styles.unlockPopupContent} style={{"paddingTop": "20px"}}>
          <ul>
            {
              modalContent.description && 
              JSON.parse(modalContent.description)?.map(d => {
                return (
                  <li style={{listStyle: "circle"}}>
                    <h5>{d}</h5>
                  </li>
                  )
              })
            }
          </ul>
          </div>
        </Modal.Body>
      </Modal>
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

export default StepThree;
