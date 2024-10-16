import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../../styles/edit-profile.module.css";
import EditProfileTopBar from "@/components/jobSeeker/EditProfileTopBar";
import { FileUploader } from "react-drag-drop-files";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { useSelector } from "react-redux";
import { IMAGEBASEURL } from "@/api";
import useRequest from "@/hooks/useRequest";
import { updateCompanyProfile } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Loading from "@/components/loading/loading";
import { toast } from "react-toastify";
import useLeavePageConfirmation from "@/hooks/useLeavePageConfirmation";


const fileTypes = ["JPG", "PNG", "GIF"];

const EditProfileStep1 = () => {

  const {pageChangeRef, setPageChangeRef} = useLeavePageConfirmation()

  const route = useRouter();
  const dispatch = useDispatch()

  const { from_profile } = route.query;

  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const { companyProfile } = useSelector((store) => store.auth);

  const { request, response } = useRequest();
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({});
      
  const handleChangeRef = (e) => {
    if (!pageChangeRef) {
      setPageChangeRef(true);
    }
  };

  const handleChange = (file) => {
    handleChangeRef(null)
    setFile(file);
  };

  const handleCoverChange = (file) => {
    handleChangeRef(null)
    setCover(file);
  };

  async function handleSubmit() {
    try {
      const newErrors = {};
      setIsLoading(true)

      let formData = new FormData();

      formData.append("id", companyProfile?.id)

      if (!companyProfile?.logo && !file) {
        newErrors.logo = "Company logo is required."
      }

      if (file) {
        formData.append("logo", file)
      }

      if (cover) {
        formData.append("cover_image", cover)
      }


      setErrors(newErrors);

      if(Object.keys(newErrors).length === 0) {
        if (file || cover) {
          setPageChangeRef(false)
          request("PUT", "company/profile", formData);
        } else {
          route.push("/employer/edit-profile/step-2")
        }
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
      route.push("/employer/edit-profile/step-2")
    }
    setIsLoading(false);

  }, [response])

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
              <a href="#!" className={styles.applicant_details_heading} onClick={() => route.back()}  style={{cursor: "pointer"}}>
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
                    Company Logo<span className="text-danger">*</span>
                  </h3>
                  <p className={styles.company_profile_description}>
                    This image will be shown publicly as company logo.
                  </p>
                </div>

              </div>
              <div className="col-md-8 col-sm-8">
                <div className={styles.uploadImgBlockPreant}>
                  <div className={styles.uploadImgBlock}>
                    <div className={styles.ImgBox}>
                      <img src={(file) ? URL.createObjectURL(file) : (companyProfile?.logo) ? `${IMAGEBASEURL}${companyProfile.logo}` : "/img/no-image.jpg"} alt="company-logo" />
                    </div>
                    <div className={styles.InputBox}>
                      <input
                        id="uploadImg"
                        onChange={(e) => handleChange(e.target.files[0])}
                        className={styles.imgInput}
                        type="file"
                      />
                      <label className={styles.uploadLabel} for="uploadImg">
                        Upload
                      </label>
                    </div>
                    {errors.logo && <span className="text-danger">{errors.logo}</span>}
                  </div>
                  
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-sm-4">

                <div className={styles.company_profile_edit}>
                  <h3 className={styles.company_profile_heading}>
                    Company Cover
                  </h3>
                  <p className={styles.company_profile_description}>
                    This image will be shown publicly as company cover.
                  </p>
                </div>

              </div>

              <div className="col-md-8 col-sm-8">
                
                <div className={styles.uploadImgBlockPreant}>
                  <div className={styles.drapAndDrop} style={{"position": "relative"}}>
                    <FileUploader
                      handleChange={handleCoverChange}
                      name="cover"
                      types={fileTypes}
                    >
                    {(cover || companyProfile?.cover_image) && (
                      <label htmlFor="cover" style={{ "cursor": "pointer", "zIndex": "0", "position": "absolute", "top": "0" }}><img
                        style={{ width: "100%", "height": "100%" }}
                        src={(cover) ? URL.createObjectURL(cover) : `${IMAGEBASEURL}${companyProfile?.cover_image}`}
                        alt=""
                      /></label>

                    )}
                    </FileUploader>
                    {/*  <p>
                            {file ? `File name: ${file.name}` : "no files uploaded yet"}
                          </p>*/}
                  </div>
                </div>
              </div>
            </div>




            {/* 
                <div className="row">
                <div className="col-md-4 col-sm-4">
                    <div className={styles.company_profile_edit}>
                      <h3 className={styles.company_profile_heading}>
                        Company Logo
                      </h3>
                      <p className={styles.company_profile_description}>
                        This image will be shown publicly as company logo.
                      </p>
                    </div>
                    <div className={styles.company_profile_edit}>
                      <h3 className={styles.company_profile_heading}>
                        Company Cover
                      </h3>
                      <p className={styles.company_profile_description}>
                        This image will be shown publicly as company logo.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-8 col-sm-8">

                    <div className={styles.uploadImgBlockPreant}>
                                    <div className={styles.uploadImgBlock}>
                                    <div className={styles.ImgBox}>
                                      <img src="/img/company-logo.png" alt="company-logo" />
                                    </div>
                                    <div className={styles.InputBox}>
                                      <input
                                        id="uploadImg"
                                        className={styles.imgInput}
                                        type="file"
                                      />
                                      <label className={styles.uploadLabel} for="uploadImg">
                                        Upload
                                      </label>
                                    </div>
                                </div>
                                <div className={styles.drapAndDrop}>
                                    <FileUploader
                                    handleChange={handleChange}
                                    name="file"
                                    types={fileTypes}
                                  />
                          <p>
                                {file ? `File name: ${file.name}` : "no files uploaded yet"}
                              </p>
                          </div>
                    
                    </div>
                    

                   
                  </div>
                </div>*/}
          </div>
          {/* <Link href='/employer/edit-profile/step-2'> */}
          <div className={styles.next_prev_btn}>

            <button className={`btn-primary ms-auto ${styles.next_btn}`} onClick={() => handleSubmit()}>
              {(from_profile) ? "Update" : "Next step"}
            </button>


          </div>
          {/* </Link> */}
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
