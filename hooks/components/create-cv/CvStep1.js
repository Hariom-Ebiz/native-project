import React from "react";

import styles from "@/styles/create_cv_steps.module.css";

import {
  NumberInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "../cv/inputFields";

const CvStep1 = ({
  profilePicUrl,
  coverPicUrl,
  setSelectedProfilePic,
  setProfilePicUrl,
  setSelectedCoverPic,
  setCoverPicUrl,
  register,
  errors,
  disableField,
  country,
  cities,
  handleSubmit,
  onSubmit,
  countrySelectedHandler,
  mode,
  setToRemoveProfilePic,
  setToRemoveCoverPic,
}) => {
  const removePhotoHandler = () => {
    setSelectedProfilePic(null);
    setProfilePicUrl(null);
    setToRemoveProfilePic(true);
  };

  const removeCoverHandler = () => {
    setSelectedCoverPic(null);
    setCoverPicUrl(null);
    setToRemoveCoverPic(true);
  };

  return (
    <div className={styles.dash_wrapper}>
      <h2 className={styles.inner_heading}>Personal Info</h2>
      <div className={styles.form_wrapper}>
        <form>
          <div className="row g-4">
            <div className="col-sm-12 col-md-12">
              <label className={styles.form_label}>Upload Photo For CV</label>
              <div className={styles.manage_content_box}>
                <div className={styles.upload_img_block}>
                  <div className={styles.avatar_upload}>
                    <div className={styles.avatar_edit }>
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        name="profile_pic"
                        onChange={(e) => {
                          setSelectedProfilePic(e.target.files[0]);
                          setProfilePicUrl(
                            URL.createObjectURL(e.target.files[0])
                          );
                          setToRemoveProfilePic(false);
                        }}
                      />
                    </div>
                    <div className="mobile_img_block">
                    <div className={styles.avatar_preview}>
                      <div 
                        id="imagePreview"
                        style={{
                          backgroundImage: `url('${
                            profilePicUrl
                              ? profilePicUrl
                              : "/img/user-icon2.jpg"
                          }')`,
                        }}
                      ></div>
                    </div>
                    </div>
                    <div className="btn_droup">
                    <div className={styles.upload_btn_label}>
                      <label htmlFor="imageUpload">Upload Photo</label>
                    </div>
                    {profilePicUrl && (
                      <div className={styles.upload_btn_label}>
                        <label htmlFor="" onClick={removePhotoHandler}>
                          Remove Photo
                        </label>
                      </div>
                    )}
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12">
              <div
                className={`${styles.manage_content_box} ${styles.upload_cover}`}
              >
                <div className={styles.upload_img_block}>
                  <div className={styles.avatar_upload}>
                    <div className={styles.avatar_edit}>
                      <input
                        type="file"
                        id="imageUpload2"
                        accept=".png, .jpg, .jpeg"
                        name="cover_pic"
                        onChange={(e) => {
                          setSelectedCoverPic(e.target.files[0]);
                          setCoverPicUrl(
                            URL.createObjectURL(e.target.files[0])
                          );
                          setToRemoveCoverPic(false);
                        }}
                      />
                    </div>
                    <div className={styles.avatar_preview}>
                      <div
                        id="imagePreview2"
                        style={{
                          backgroundImage: `url('${
                            coverPicUrl ? coverPicUrl : "/img/cover-pic2.png"
                          }')`,
                        }}
                      ></div>
                    </div>
                    <div className="btn_droup">
                    <div className={styles.upload_btn_label}>
                      <label htmlFor="imageUpload2">Upload Cover</label>
                    </div>
                    {coverPicUrl && (
                      <div className={styles.upload_btn_label}>
                        <label htmlFor="" onClick={removeCoverHandler}>
                          Remove Cover
                        </label>
                      </div>
                    )}
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
            <TextInput
              label="First Name"
              placeholder="First Name"
              name="first_name"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^[a-zA-Z- ]*$/,
                },
              }}
              otherFields={{
                disabled: !!disableField,
                id: "first_name",
              }}
            />

            <TextInput
              label="Last Name"
              placeholder="Last Name"
              name="last_name"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^[a-zA-Z- ]*$/,
                },
              }}
              otherFields={{
                disabled: !!disableField,
                id: "last_name",
              }}
            />

            <TextInput
              label="Middle Name"
              placeholder="Middle Name"
              name="middle_name"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^[a-zA-Z- ]*$/,
                },
              }}
            />

            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}> Birthday</label>
                <input
                  type="date"
                  className={`${styles.form_control} ${styles.date_fix}  form-control`}
                  // className={`form-control`}

                  placeholder="start"
                  name="dob"
                  {...register("dob", {
                    required: {
                      value: true,
                      message: "This field is required.",
                    },
                  })}
                />
                {errors?.["dob"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["dob"].message}
                  </div>
                )}
              </div>
            </div>

            {/* <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>Birthday</label>
                <div className={styles.brith_date}>
                  
                  <input
                    type="number"
                    className={`${styles.form_control} form-control`}
                    placeholder="10"
                    name="day"
                    {...register("day", {
                      required: {
                        value: true,
                        message: "This field is required.",
                      },
                    })}
                  />
                 
                  <select
                    className={`${styles.form_select} ${styles.form_control} form-select form-control`}
                    aria-label="Default select example"
                    name="month"
                    {...register("month", {
                      required: {
                        value: true,
                        message: "This field is required.",
                      },
                    })}
                  >
                    <option value="">Select</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <input
                    type="number"
                    className={`${styles.form_control} form-control`}
                    placeholder="1996"
                    name="year"
                    {...register("year", {
                      required: {
                        value: true,
                        message: "This field is required.",
                      },
                    })}
                  />
                </div>
                {errors?.[("day", "month", "year")] && (
                  <div className="invalid-feedback d-block">
                    {errors?.[("day", "month", "year")].message}
                  </div>
                )}
              </div>
            </div> */}

            <SelectInput
              label="Nationality"
              name="nationality"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={
                <>
                  <option value="">Select Nationality </option>
                  {country?.map((val) => {
                    return (
                      <option value={val.id} key={val.id}>
                        {val.name}
                      </option>
                    );
                  })}
                </>
              }
            />

            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>Marital Status</label>
                <div className={styles.radio_block}>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      value="single"
                      {...register("martial_status", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="flexRadioDefault2"
                    >
                      Single
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault3"
                      value="married"
                      {...register("martial_status", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="flexRadioDefault3"
                    >
                      Married
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value="unspecified"
                      {...register("martial_status", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="flexRadioDefault1"
                    >
                      Unspecified
                    </label>
                  </div>
                </div>
                {errors?.["martial_status"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["martial_status"].message}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>
                  Do You Have a Driving Lisence ?
                </label>
                <div className={styles.radio_block}>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="Lisence"
                      id="Lisence1"
                      value="1"
                      {...register("have_driving_licence", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="Lisence1"
                    >
                      Yes
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="Lisence"
                      id="Lisence2"
                      value="0"
                      {...register("have_driving_licence", {
                        required: {
                          value: true,
                          message: "This field is required",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="Lisence2"
                    >
                      No
                    </label>
                  </div>
                </div>
                {errors?.["have_driving_licence"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["have_driving_licence"].message}
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-12 col-md-12">
              <div className={styles.location_heading}>
                <h4>Current Location</h4>
              </div>
            </div>

            <SelectInput
              label="Country"
              name="current_country"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={
                <>
                  <option value="">Select</option>
                  {country?.map((val) => {
                    return (
                      <option value={val.id} key={val.id}>
                        {val.name}
                      </option>
                    );
                  })}
                </>
              }
              
              onChangeFunc={(e) => countrySelectedHandler(e.target.value)}
              // otherFields={{
              //   onChange: (e) => countrySelectedHandler(e.target.value),
              // }}
            />

            <SelectInput
              label="City"
              name="current_city"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              options={
                <>
                  <option value="">Select</option>
                  {cities?.map((val) => {
                    return (
                      <option value={val.id} key={val.id}>
                        {val.name}
                      </option>
                    );
                  })}
                </>
              }
            />

            <TextInput
              label="Area"
              name="current_area"
              placeholder="Area"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
            />

            <div className="col-sm-12 col-md-12">
              <div className="input_block">
                <label className={styles.form_label}>
                  You want to relocate to another country
                </label>
                <div className={styles.radio_block}>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="country"
                      id="country1"
                      value="1"
                      {...register("want_to_relocate", {
                        required: {
                          value: true,
                          message: "This field is required.",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="country1"
                    >
                      Yes
                    </label>
                  </div>
                  <div className={`${styles.form_check} form-check`}>
                    <input
                      className={`${styles.form_check_input} form-check-input`}
                      type="radio"
                      name="country"
                      id="country2"
                      value="0"
                      {...register("want_to_relocate", {
                        required: {
                          value: true,
                          message: "This field is required.",
                        },
                      })}
                    />
                    <label
                      className={`${styles.form_check_label} form-check-label`}
                      htmlFor="country2"
                    >
                      No
                    </label>
                  </div>
                </div>
                {errors?.["want_to_relocate"] && (
                  <div className="invalid-feedback d-block">
                    {errors?.["want_to_relocate"].message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-sm-12 col-md-12">
              <div className={styles.location_heading}>
                <h4>Contact Info</h4>
              </div>
            </div>

            <NumberInput
              label="Mobile Number (+2)"
              name="contact_mobile"
              placeholder="07542132659"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^\d{11}$/,
                  message: "Please provide a valid 11 digit mobile number.",
                },
              }}
            />

            <NumberInput
              label="Alternative Number (+2)"
              name="contact_alt_mobile"
              placeholder="07542132659"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^\d{11}$/,
                  message: "Please provide a valid 11 digit mobile number.",
                },
              }}
            />

            <TextInput
              label="Email"
              placeholder="Email"
              name="contact_email"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
                pattern: {
                  value: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
                  message: "Please provide a valid email.",
                },
              }}
            />

            <div className="col-sm-12 col-md-12">
              <div className={styles.location_heading}>
                <h4>About me</h4>
              </div>
            </div>

            <TextAreaInput
              label="Write info about you"
              placeholder="Write info about you"
              name="about"
              register={register}
              errors={errors}
              registerFields={{
                required: {
                  value: true,
                  message: "This field is required.",
                },
              }}
              otherFields={{
                id: "exampleFormControlTextarea1",
                rows: "3",
              }}
            />

            <div className="col-sm-12 col-md-12">
              <div className={styles.next_pre_btn}>
                <div></div>
                <button
                  type="button"
                  className={`btn btn-primary ${styles.dash_theem_btn}`}
                  onClick={handleSubmit(onSubmit)}
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CvStep1;
