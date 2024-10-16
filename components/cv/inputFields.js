import Select from "react-select";
import { Controller } from "react-hook-form";
import moment from "moment";

import styles from "@/styles/create_cv_steps.module.css";
import styles2 from "@/styles/profile.module.css";

const YEAR_OPTIONS = [];

for (let i = 0; i < 30; i++) {
  const year = moment().add({'year':1}).subtract({ year: i }).year();
  YEAR_OPTIONS.push(year);
}

export const TextInput = ({
  label,
  placeholder,
  name,
  registerFields,
  otherFields,
  register,
  errors,
  colClass,
}) => {
  return (
    <div className={colClass ? colClass : "col-sm-12 col-md-12"}>
      <div className={styles.input_block}>
        <label className={styles.form_label}>{label}</label>
        <input
          id={name}
          type="text"
          className={`${styles.form_control} form-control`}
          placeholder={placeholder}
          name={name}
          {...register(name, registerFields)}
          {...otherFields}
        />
        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
        {/* {errors?.[name] && errors?.[name]?.type == "pattern" && (
          <div className="invalid-feedback d-block">
            First Name must contain only alphabets.
          </div>
        )} */}
      </div>
    </div>
  );
};

export const NumberInput = ({
  label,
  placeholder,
  name,
  registerFields,
  otherFields,
  register,
  errors,
  colClass,
}) => {
  return (
    <div className={colClass ? colClass : "col-sm-12 col-md-12"}>
      <div className={styles.input_block}>
        <label className={styles.form_label}>{label}</label>
        <input
          id={name}
          type="number"
          className={`${styles.form_control} form-control`}
          placeholder={placeholder}
          name={name}
          {...register(name, registerFields)}
          {...otherFields}
        />
        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
      </div>
    </div>
  );
};

export const YearNumberInput = ({
  label,
  placeholder,
  name,
  registerFields,
  otherFields,
  register,
  errors,
  colClass,
}) => {
  return (
    <div className={colClass ? colClass : "col-sm-12 col-md-12"}>
      <div className={styles.input_block}>
        <label className={styles.form_label}>{label}</label>
        <select
          id={name}
          className={`${styles.form_control} form-control`}
          placeholder={placeholder}
          name={name}
          {...register(name, registerFields)}
          {...otherFields}
        >
          {YEAR_OPTIONS.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
      </div>
    </div>
  );
};

export const TextAreaInput = ({
  label,
  placeholder,
  name,
  registerFields,
  otherFields,
  register,
  errors,
}) => {
  return (
    <div className="col-sm-12 col-md-12">
      <div className="input_block">
        <label className={styles.form_label}>{label}</label>
        <textarea
          id={name}
          className={`${styles.form_control} ${styles.text_area} form-control`}
          name={name}
          placeholder={placeholder || ""}
          {...register(name, registerFields)}
          {...otherFields}
        />
        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
      </div>
    </div>
  );
};

export const SelectInput = ({
  label,
  placeholder,
  name,
  registerFields,
  otherFields,
  options,
  register,
  errors,
  colClass,
}) => {
  return (
    <div className={colClass ? colClass : "col-sm-12 col-md-12"}>
      <div className="input_block">
        <label className={styles.form_label}>{label || ""}</label>
        <select
          id={name}
          className={`${styles.form_select} ${styles.form_control} form-select form-control`}
          aria-label="Default select example"
          name={name}
          {...register(name, registerFields)}
          {...otherFields}
        >
          {options}
        </select>
        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
      </div>
    </div>
  );
};

export const ReactSelectInput = ({
  label,
  name,
  registerFields,
  otherFields = {},
  options,
  errors,
  colClass,
  control,
  handleChange = () => {},
  isMultiple = false,
  isDisabled = false,
  validateSelection = () => true,
}) => {
  return (
    <div className={colClass ? colClass : "col-sm-12 col-md-12"}>
      <div className="input_block">
        <label className={styles.form_label}>{label || ""}</label>

        <Controller
          id={name}
          // className={`${styles.form_select} ${styles.form_control} form-select form-control`}
          control={control}
          name={name}
          rules={registerFields}
          render={({ field: { onChange, value, ref } }) => {
            return (
              <Select
                onChange={(val, changedData) => {
                  if (validateSelection(val, changedData)) {
                    onChange(val);
                    handleChange(val, changedData);
                  }
                }}
                options={options}
                isMulti={isMultiple}
                value={value}
                // className={`${styles.form_select} ${styles.form_control} form-select form-control`}
                isDisabled={isDisabled}
                {...otherFields}
              />
            );
          }}
        />
        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
      </div>
    </div>
  );
};

export const PasswordInput = ({
  label,
  placeholder,
  name,
  registerFields,
  otherFields,
  register,
  errors,
  colClass,
}) => {
  return (
    <div className={colClass ? colClass : "col-sm-12 col-md-12"}>
      <div className={styles.input_block}>
        <label className={styles.form_label}>{label}</label>
        <input
          id={name}
          type="password"
          className={`${styles.form_control} form-control`}
          placeholder={placeholder}
          name={name}
          {...register(name, registerFields)}
          {...otherFields}
        />
        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
      </div>
    </div>
  );
};

export const PasswordViewInput = ({
  label,
  placeholder,
  name,
  registerFields,
  otherFields,
  register,
  errors,
  colClass,
  isPasswordVisible,
  setIsPasswordVisible,
}) => {
  return (
    <div className={colClass ? colClass : "col-sm-12 col-md-12"}>
      <div className={styles.input_block}>
        <label className={styles.form_label}>{label}</label>
        <div className="position-relative">
          <input
            id={name}
            type={isPasswordVisible ? "text" : "password"}
            className={`${styles.form_control} form-control`}
            placeholder={placeholder}
            name={name}
            {...register(name, registerFields)}
            {...otherFields}
          />
          {isPasswordVisible ? (
            <span
              className={styles2.show_pass}
              onClick={() => setIsPasswordVisible((prev) => false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-eye-slash"
                viewBox="0 0 16 16"
              >
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
              </svg>
            </span>
          ) : (
            <span
              className={styles2.show_pass}
              onClick={() => setIsPasswordVisible((prev) => true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-eye"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
            </span>
          )}
        </div>

        {errors?.[name] && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )}
        {/* {errors?.[name] && errors?.[name]?.type == "pattern" && (
          <div className="invalid-feedback d-block">
            {errors?.[name].message}
          </div>
        )} */}
      </div>
    </div>
  );
};
