import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../../styles/edit-profile.module.css";
import EditProfileTopBar from "@/components/jobSeeker/EditProfileTopBar";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FileUploader } from "react-drag-drop-files";
import dynamic from "next/dynamic";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { useSelector } from "react-redux";
import useRequest from "@/hooks/useRequest";
import { useDispatch } from "react-redux";
import { updateCompanyProfile } from "@/store/authSlice";
import Loading from "@/components/loading/loading";
import { useRouter } from "next/router";
import Editor from "@/components/CKEditor";
import { toast } from "react-toastify";
import useLeavePageConfirmation from "@/hooks/useLeavePageConfirmation";
const fileTypes = ["JPG", "PNG", "GIF"];

const EditProfileStep1 = () => {

    const {pageChangeRef, setPageChangeRef} = useLeavePageConfirmation();

  if (typeof window === 'undefined') {
    return null; // Return null or any other fallback component for server-side rendering
  }
  // const Editor = dynamic(() => import("../../../components/CKEditor.js"), { ssr: false });

  const dispatch = useDispatch();

  const route = useRouter();

  const [isLoading, setIsLoading] = useState(false)
  const { request, response } = useRequest();
  const { companyProfile } = useSelector((store) => store.auth);

  console.log("companyProfile",companyProfile)

  const [errors, setErrors] = useState({});


  const [description, setDescription] = useState(companyProfile?.description ?? "");
  

  const handleChange = (e) => {
    if (!pageChangeRef) {
      setPageChangeRef(true);
    }
  };

  async function handleSubmit() {
    try {
      const newErrors = {};

      setIsLoading(true)

      if (!description) {
        newErrors.description = "This field is required.";
      } else if ((description.replace(/\r\n/g, " ").replace(/\n/g," ")).length > 500) {
        newErrors.description = "Description should be less than 500 characters.";
      }

      let formData = new FormData();

      formData.append("id", companyProfile?.id)

      formData.append("description", description)

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setPageChangeRef(false);
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
  const {from_profile} = route.query;
  //on form submission

  useEffect(() => {
    if (response && response.status) {
      dispatch(updateCompanyProfile(response.updatedData))
      toast.success("Profile is updated successfully.")
       route.push("/employer/edit-profile/step-4")
    }
    setIsLoading(false);

  }, [response])

  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     console.log('App is changing to:', url);
    
  //     const updatedProfile = { ...companyProfile, "description": description };
  //     console.log("finallll",updatedProfile)
     
  //   };

  //   route.events.on('routeChangeStart', handleRouteChange);

  //   return () => {
  //     route.events.off('routeChangeStart', handleRouteChange);
  //   };
  // }, []);

  return (
    <>
      {
        (isLoading) ? <Loading /> : ""
      }
      <EmployerAuth data={{ data: "Company Profile" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className={styles.applicant_details_head}>
            <div className={styles.applicant_details_text}>
              <a href="#!" className={styles.applicant_details_heading} style={{"cursor": "pointer"}} onClick={() => route.back()}>
                <span className={styles.LeftarrowIcon}>
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
                    Detailed Info
                  </h3>
                  <p className={styles.company_profile_description}>
                    Provide a brief description for your company.
                  </p>
                </div>
              </div>

              <div className="col-md-8 col-sm-8">
                <div className={styles.uploadImgBlockPreant}>
                  <div>
                    <label className={styles.form_label}>
                      Company Description<span className="text-danger">*</span>
                    </label>

                    <br />
                    <textarea 
                      name="description" 
                      rows={4}
                      maxLength={500}
                      // onChange={(e) => setDescription(e.target.value)} 
                      onChange={(e)=> {
                        let value = e.target.value;
                        if (value.length <= 500) {
                          setDescription(value);
                        }
                        handleChange(e)
                      }}
                      style={{"width": "100%"}}
                      defaultValue={description}
                    ></textarea>
                   {errors.description && <span className="text-danger">{errors.description}</span>}

                    <div className={styles.editorFooter}>
                      <h4 className={styles.left_text}>Maximum 500 characters</h4>
                      <h4 className={styles.right_text}>{(description?.replace(/\r\n/g, " ").replace(/\n/g," "))?.length}/500</h4>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.next_prev_btn}>
            <Link href='/employer/edit-profile/step-2'>

              <button className={`btn-primary  ${styles.next_btn}`}>
                prev
              </button>
            </Link>
            {/* <Link href='/employer/edit-profile/step-4'> */}
            
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

  return {
    props: {
      publicHeader: false,
      publicFooter: false,
    },
  };
}

export default EditProfileStep1;
