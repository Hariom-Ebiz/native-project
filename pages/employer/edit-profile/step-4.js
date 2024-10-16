import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createAxiosCookies } from "@/fn";
import styles from "../../../styles/edit-profile.module.css";
import EditProfileTopBar from "@/components/jobSeeker/EditProfileTopBar";
import EmployerAuth from "@/components/layout/EmployerAuth";
import { useSelector } from "react-redux";
import useRequest from "@/hooks/useRequest";
import { useDispatch } from "react-redux";
import { updateCompanyProfile } from "@/store/authSlice";
import { useRouter } from "next/router";
import Loading from "@/components/loading/loading";
import { isBusinessEmail } from "@/utils/helper";
import { toast } from "react-toastify";
import useLeavePageConfirmation from "@/hooks/useLeavePageConfirmation";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';

const fileTypes = ["JPG", "PNG", "GIF"];


const EditProfileStep4 = () => {

  const {pageChangeRef, setPageChangeRef} = useLeavePageConfirmation();

  const dispatch = useDispatch();

  const route = useRouter();

  
  
  const [isLoading, setIsLoading] = useState(false);
  const { request, response } = useRequest();
  const { companyProfile } = useSelector((store) => store.auth);
  
  const handleChange = (e) => {
    if (!pageChangeRef) {
      setPageChangeRef(true);
    }
  };
  const [phoneVal, setPhoneVal] = useState(companyProfile?.phone)

  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (phoneNumber) => {
    let updatePhone = phoneNumber.includes("+") ? phoneNumber : `+${phoneNumber}`;
    const parsedNumber = parsePhoneNumberFromString(updatePhone);

    if (parsedNumber && parsedNumber.countryCallingCode == "20"){
      if ((updatePhone.length - 3) > 10) {
        return false
      } else {
        return true
      }
    } else  {
      return parsedNumber && isValidPhoneNumber(updatePhone);
    }
  };
  
  async function handleSubmit() {
    try {
      const newErrors = {};
      const validateFields = ["phone", "email", "linkedin"];

      setIsLoading(true)

      // let phone = document.getElementById("phone_number").value;
      let phone = phoneVal;
      let email = document.getElementById("email").value;
      let facebook = document.getElementById("facebook").value;
      let linkedIn = document.getElementById("linkedin").value;

      // /^\+?[1-9]\d{1,14}$/
      if (!phone) {
        newErrors.phone = "Please enter phone number.";
      } else if(!validatePhoneNumber(`${phone}`)) {
        newErrors.phone = "Please enter a valid phone number.";
      }

      if (email && !isBusinessEmail(email)) {
        newErrors.email = "Please use a business email address.";
      }

      if (facebook && !(/^(https?:\/\/)?(www\.|m\.)?facebook.com\/[A-Za-z0-9_.-]+\/?$/.test(facebook))) {
        newErrors.facebook = "Please use a valid facebook address.";
      }
// /^https?:\/\/(www\.)?linkedin\.com\/(in|company|school)\/.+\/?$/
      if (linkedIn && !(/^https?:\/\/(www\.)?linkedin\.com\/.+/).test(linkedIn)) {
        newErrors.linkedin = "Please use a valid LinkedIn address.";
      }

      const getInputs = document.getElementsByClassName("form-group");
      let formData = new FormData();

      formData.append("id", companyProfile?.id);

      for await (const i of getInputs) {
        if (i.querySelector("input").name) {
          if (validateFields.includes(i.querySelector("input").name) && !i.querySelector("input").value) {
            newErrors[i.querySelector("input").name] = "This field is required";
          } else {
            formData.append(i.querySelector("input").name, i.querySelector("input").value.split(" ").join(""))
          }
        }
      }


      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setPageChangeRef(false);
        request("PUT", "company/profile", formData);
      } else {
        setIsLoading(false)
        return false;
      }

    } catch (error) {
      setIsLoading(false);
      alert(new Error(error).message);
    }
  }

  const { from_profile } = route.query;

  //on form submission

  useEffect(() => {
    if (response && response.status) {
      dispatch(updateCompanyProfile(response.updatedData));
      toast.success("Profile is updated successfully.")
      route.push("/employer/company-profile");
    }
    setIsLoading(false);
  }, [response]);


  return (
    <>
      {isLoading ? <Loading /> : ""}
      <EmployerAuth data={{ data: "Company Profile" }} />
      <div className="page_container">
        <div className="main_content" id="body_lang_css">
          <div className={styles.applicant_details_head}>
            <div className={styles.applicant_details_text}>
              <a
                href="#!"
                className={styles.applicant_details_heading}
                onClick={() => route.back()}
                style={{"cursor": "pointer"}}
              >
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
                    Contact Info
                  </h3>
                  <p className={styles.company_profile_description}>
                    Provide your company's contact details to ensure users can easily reach you
                  </p>
                </div>
              </div>

              <div className="col-md-8 col-sm-8">
                <div className={styles.uploadImgBlockPreant}>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
      
                          <label htmlFor="phone" className={styles.form_label}>Phone Number<span className="text-danger">*</span></label>
                          <PhoneInput
                            // inputClass={`${styles.form_control} form-control`}
                            countryCodeEditable={false}
                            // disableDropdown={true}
                            value={companyProfile?.phone}
                            inputStyle={{width: "100%"}}
                            containerStyle={{width: "100%"}}
                            enableSearch={true}
                            country={"eg"}
                            inputProps={{
                              name: 'phone',
                              required: true,
                              autoFocus: true
                            }}
                            onChange={(value) =>{ handleChange(value); setPhoneVal(value);}}
                          />
                          {errors.phone && <span className="text-danger">{errors.phone}</span>}
                        {/* <label className={styles.form_label}>Phone Number<span className="text-danger">*</span></label>
                        <input
                          onChange={(e)=> {
                            handleChange(e)
                             //dispatch(updateCompanyProfile( { ...companyProfile, "phone": e.target.value }))
                          }} 
                          type="text" className={styles.form_control} defaultValue={companyProfile?.phone} placeholder="Enter you Phone number" id="phone_number" name="phone" />
                        {errors.phone && <span className="text-danger">{errors.phone}</span>} */}
                      </div>

                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>Business Email Address<span className="text-danger">*</span></label>
                        <input
                            onChange={(e)=> {
                              handleChange(e)
                                //dispatch(updateCompanyProfile( { ...companyProfile, "email": e.target.value }))
                            }}
                          type="email" className={styles.form_control} defaultValue={companyProfile?.email} placeholder="" id="email" name="email" />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                      </div>
                    </div>
                    {/* <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>Twitter</label>
                        <input type="text" className={styles.form_control} defaultValue={companyProfile?.twitter} placeholder="Enter your Twitter address" name="twitter" />
                      </div>
                    </div> */}
                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>Facebook</label>
                        <input
                          id="facebook"
                          onChange={(e)=> {
                            handleChange(e)
                            // dispatch(updateCompanyProfile( { ...companyProfile, "facebook": e.target.value }))
                          }}
                          type="text"
                          className={styles.form_control}
                          defaultValue={companyProfile?.facebook}
                          placeholder="Enter your Facebook address"
                          name="facebook"
                        />
                        {errors.facebook && <span className="text-danger">{errors.facebook}</span>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className={styles.form_label}>LinkedIn<span className="text-danger">*</span></label>
                        <input
                          id="linkedin"
                          onChange={(e)=> {
                            handleChange(e)
                            // dispatch(updateCompanyProfile( { ...companyProfile, "linkedin": e.target.value }))
                          }}
                          type="text" className={styles.form_control} defaultValue={companyProfile?.linkedin} placeholder="Enter your LinkedIn address" name="linkedin" />
                        {errors.linkedin && <span className="text-danger">{errors.linkedin}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.next_prev_btn}>
            <Link href="/employer/edit-profile/step-3">
              <button className={`btn-primary ${styles.next_btn}`}>Prev</button>
            </Link>
            <button
              className={`btn-primary  ${styles.next_btn}`}
              onClick={() => handleSubmit()}
            >
              {from_profile ? "Update" : "Next"}
            </button>
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

export default EditProfileStep4;
