import React, { useEffect, useState } from "react";
import styles from "@/styles/profile.module.css";
import useRequest from "@/hooks/useRequest";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PasswordInput, PasswordViewInput, TextInput } from "../cv/inputFields";

const NotificationSetting = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        resetField,
        reset,
        setValue,
        getValues,
        watch,
        control,
    } = useForm();

    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

    const { request, response } = useRequest();

    const { request: NotifSettingsReq, response: NotifSettingsResp } = useRequest();

    const onSubmit = (data) => {
        const { invitation_notif, job_update_notif } = data;
        request("PUT", "notification/settings-update", {
            invitation_notif,job_update_notif
        });
    };

    useEffect(() => {
        if (response && response.status) {
            toast.success("Notification status updated");
        }
    }, [response]);

    useEffect(() => {
        NotifSettingsReq("GET", "notification/settings")
    }, [])

    useEffect(() => {
        if (NotifSettingsResp && NotifSettingsResp.status) {
            resetHandler(NotifSettingsResp.data);
        }
    }, [NotifSettingsResp])

    const resetHandler = (obj) => {
        reset({
            "invitation_notif": obj["invitation_notif"],
            "job_update_notif": obj["job_update_notif"]
        });
    };

    return (
        <div className={`${styles.dash_wrapper} ${styles.top_space_block}`}>
            <h2 className={styles.inner_heading}>Notification Settings</h2>
            <div className={styles.form_wrapper}>
                <div className="row g-4">
                    <div className="col-sm-12 col-md-4">
                        <div className="input_block">
                            <label className={styles.form_label}>Job Invitation</label>
                            <div className={styles.radio_block}>
                                <div className={`${styles.form_check} form-check`}>
                                    {(watch("invitation_notif") == 1 || watch("invitation_notif") == 0) && 
                                    <input
                                        className={`${styles.form_check_input} form-check-input`}
                                        type="radio"
                                        name="invitation_notif"
                                        id="invitation_notif1"
                                        value={1}
                                        checked={watch("invitation_notif") == 1}
                                        {...register("invitation_notif")}
                                    />}
                                    <label
                                        className={`${styles.form_check_label} form-check-label`}
                                        htmlFor="invitation_notif1"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div className={`${styles.form_check} form-check`}>
                                {(watch("invitation_notif") == 1 || watch("invitation_notif") == 0) &&
                                    <input
                                        className={`${styles.form_check_input} form-check-input`}
                                        type="radio"
                                        name="invitation_notif"
                                        id="invitation_notif2"
                                        value={0}
                                        checked={watch("invitation_notif") == 0}
                                        {...register("invitation_notif")}
                                    />}
                                    <label
                                        className={`${styles.form_check_label} form-check-label`}
                                        htmlFor="invitation_notif2"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                            {errors?.["invitation_notif"] && (
                                <div className="invalid-feedback d-block">
                                    {errors?.["invitation_notif"].message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-4">
                        <div className="input_block">
                            <label className={styles.form_label}>Job Updates</label>
                            <div className={styles.radio_block}>
                                <div className={`${styles.form_check} form-check`}>
                                {(watch("job_update_notif") == 1 || watch("job_update_notif") == 0) &&
                                    <input
                                        className={`${styles.form_check_input} form-check-input`}
                                        type="radio"
                                        name="job_update_notif"
                                        id="job_update_notif1"
                                        value={1}
                                        checked={watch("job_update_notif") == 1}
                                        {...register("job_update_notif")}
                                    />}
                                    <label
                                        className={`${styles.form_check_label} form-check-label`}
                                        htmlFor="job_update_notif1"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div className={`${styles.form_check} form-check`}>
                                {(watch("job_update_notif") == 1 || watch("job_update_notif") == 0) &&
                                    <input
                                        className={`${styles.form_check_input} form-check-input`}
                                        type="radio"
                                        name="job_update_notif"
                                        id="job_update_notif2"
                                        value={0}
                                        checked={watch("job_update_notif") == 0}
                                        {...register("job_update_notif")}
                                    />}
                                    <label
                                        className={`${styles.form_check_label} form-check-label`}
                                        htmlFor="job_update_notif2"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                            {errors?.["job_update_notif"] && (
                                <div className="invalid-feedback d-block">
                                    {errors?.["job_update_notif"].message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12">
                        <div className={styles.next_pre_btn}>
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

export default NotificationSetting;
