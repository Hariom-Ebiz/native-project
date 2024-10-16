import React, { useEffect, useState } from "react";
import styles from "@/styles/profile.module.css";
import useRequest from "@/hooks/useRequest";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PasswordInput, PasswordViewInput, TextInput } from "../cv/inputFields";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
    setValue,
    control,
  } = useForm();

  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const { request, response } = useRequest();

  const onSubmit = (data) => {
    const { newPassword, confirmPassword } = data;

if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Confirm password do not match with New Password",
      });
      return;
    }

    request("POST", "user/job-seeker/change-password", {
      newPassword,
    });
  };

  useEffect(() => {
    if (response && response.status) {
      toast.success(response.message);
    }
  }, [response]);

  const resetHandler = () => {
    resetField("newPassword");
    resetField("confirmPassword");
  };

  return (
    <div className={`${styles.dash_wrapper} ${styles.top_space_block}`}>
      <h2 className={styles.inner_heading}>Change Password</h2>
      <div className={styles.form_wrapper}>
        <div className="row g-4">
          <PasswordViewInput
            label="New Password"
            placeholder="New Password"
            name="newPassword"
            register={register}
            errors={errors}
            registerFields={{
              required: {
                value: true,
                message: "This field is required.",
              },
              pattern: {
                value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
                message:
                  "Password should be of 8 characters long with at least one uppercase, one lowercase and one number",
              },
            }}
            otherFields={{}}
            colClass="col-sm-12 col-md-4"
            isPasswordVisible={isNewPasswordVisible}
            setIsPasswordVisible={setIsNewPasswordVisible}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            register={register}
            errors={errors}
            registerFields={{
              required: {
                value: true,
                message: "This field is required.",
              },
            }}
            otherFields={{}}
            colClass="col-sm-12 col-md-4"
            isPasswordVisible={isNewPasswordVisible}
            setIsPasswordVisible={setIsNewPasswordVisible}
          />
          <div className="col-sm-12 col-md-12">
            <div className={styles.next_pre_btn}>
              <button
                type="button"
                className={`btn btn-primary ${styles.dash_theem_btn} ${styles.theem_btn_second}`}
                onClick={resetHandler}
              >
                cancel
              </button>
              <button
                type="button"
                className={`btn btn-primary ${styles.dash_theem_btn}`}
                onClick={handleSubmit(onSubmit)}
              >
                save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
