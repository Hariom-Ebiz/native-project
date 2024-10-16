import React, { Fragment, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import styles from "@/styles/create_cv_steps.module.css";
import { WithContext as ReactTags } from "react-tag-input";

// const ReactTags = import("react-tag-input").then((mod) => mod.WithContext);
// const ReactTags = dynamic(() => import("react-tag-input"), {
//   ssr: false,
// });

const CvStep4 = ({
  onSubmit,
  skillList,
  skillsError,
  languageList,
  languageError,
  skillLevelChanged,
  languageLevelChanged,
  skillAddHandler,
  languageAddHandler,
  setSkillList,
  setSkillsError,
  setLanguageList,
  setLanguageError,
  mode,
}) => {
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  const [skillTags, setSkillTags] = useState([]);
  const [languageTags, setLanguageTags] = useState([]);
  const [skillInputField, setSkillInputField] = useState(false);
  const [languageInputField, setLanguageInputField] = useState(false);

  const inputFieldSkillHandle = () => {
    setSkillInputField((prev) => !prev);
  };

  const inputFieldLanguageHandle = () => {
    setLanguageInputField((prev) => !prev);
  };

  const handleAdditionSkillTags = (tag) => {
    setSkillsError(0);
    let exists = skillList.find((elem) => elem.name === tag.text);
    if (exists) {
      setSkillsError(2);
      return;
    }
    let newTag = {
      selected: true,
      level: "average",
      id: tag.text,
      name: tag.text,
    };
    setSkillList((prev) => {
      return [newTag, ...prev];
    });
  };

  const handleAdditionLanguageTags = (tag) => {
    setLanguageError(0);
    let exists = languageList.find((elem) => elem.name === tag.text);
    if (exists) {
      setLanguageError(2);
      return;
    }
    let newTag = {
      selected: true,
      level: "average",
      id: tag.text,
      name: tag.text,
    };
    setLanguageList((prev) => {
      return [newTag, ...prev];
    });
  };

  const handleDeleteSkillTags = (i) => {
    setSkillTags(skillTags.filter((tag, index) => index !== i));
  };

  const handleDeleteLanguageTags = (i) => {
    setLanguageTags(languageTags.filter((tag, index) => index !== i));
  };

  return (
    <div className={`${styles.dash_wrapper} ${styles.skill_step}`}>
      <div className={styles.profile_heading}>
        <h2 className={styles.inner_heading}>
          <span className={styles.icon_box}>
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.2435 12.8043C13.4257 12.8043 16.0055 10.3201 16.0055 7.25564C16.0055 4.19123 13.4257 1.70703 10.2435 1.70703C7.06119 1.70703 4.48145 4.19123 4.48145 7.25564C4.48145 10.3201 7.06119 12.8043 10.2435 12.8043Z"
                stroke="white"
                strokeWidth="1.28045"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.41916 11.5409L6.41064 17.8407C6.41064 18.6089 6.94844 18.9845 7.61427 18.6687L9.902 17.5846C10.0898 17.4907 10.4056 17.4907 10.5934 17.5846L12.8897 18.6687C13.547 18.976 14.0933 18.6089 14.0933 17.8407V11.3872"
                stroke="white"
                strokeWidth="1.28045"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Skills
        </h2>
        <a
          className={`add-icon ${styles.add_icon}`}
          onClick={inputFieldSkillHandle}
        >
          {!skillInputField ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_29464_34884)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                  fill="#2A3858"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                  fill="#2A3858"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_29464_34884">
                  <rect width="24" height="24" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8346 10.8317H4.16797V9.16504H15.8346V10.8317Z"
                fill="#161D46"
              />
            </svg>
          )}
        </a>
      </div>
      {skillInputField && (
        <div className="subject-search-icon">
          <ReactTags
            skillTags={skillTags}
            // suggestions={suggestions}
            delimiters={delimiters}
            handleDelete={handleDeleteSkillTags}
            handleAddition={handleAdditionSkillTags}
            inputFieldPosition="top"
            autocomplete
            id="skill-tag"
            allowUnique={false}
            className={`${styles.form_control} form-control`}
          />
        </div>
      )}

      <div className={styles.skills_box}>
        <ul className={styles.skills_list}>
          {skillList?.map((val) => {
            return (
              <Fragment key={val.id}>
                {val.selected ? (
                  <li
                    style={{
                      backgroundColor: "#82aad9",
                      borderRadius: "5px",
                    }}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        marginRight: "15px",
                      }}
                      onClick={() => skillAddHandler(val.name)}
                    >
                      {val.name}
                    </span>
                    <select
                      value={val.level}
                      onChange={(e) =>
                        skillLevelChanged(val.name, e.target.value)
                      }
                    >
                      <option value="basic">Basic</option>
                      <option value="average">Average</option>
                      <option value="good">Good</option>
                      <option value="expert">Expert</option>
                    </select>
                  </li>
                ) : (
                  <li
                    key={val.id}
                    onClick={() => skillAddHandler(val.name)}
                    style={{ cursor: "pointer" }}
                  >
                    {val.name}
                  </li>
                )}
              </Fragment>
            );
          })}
          {skillsError === 1 && (
            <div className="invalid-feedback d-block">
              You can add minimum 1 skill.
            </div>
          )}
          {skillsError === 2 && (
            <div className="invalid-feedback d-block">
              This skill already exists in suggestions.
            </div>
          )}
        </ul>
      </div>
      <div className={styles.profile_heading}>
        <h2 className={styles.inner_heading}>
          <span className={styles.icon_box}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_29605_19406)">
                <path
                  d="M5 7H12M10 5V7C10 9.12173 9.47322 11.1566 8.53553 12.6569C7.59785 14.1571 6.32608 15 5 15M6 11C5.99834 12.0318 6.69452 13.0241 7.94307 13.7695C9.19163 14.5149 10.896 14.9558 12.7 15"
                  stroke="#F8FBFD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 19L15 10L19 19M18.1 17H11.9"
                  stroke="#F8FBFD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_29605_19406">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          Language
        </h2>
        <a
          className={`add-icon ${styles.add_icon}`}
          onClick={inputFieldLanguageHandle}
        >
          {!languageInputField ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_29464_34884)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                  fill="#2A3858"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                  fill="#2A3858"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_29464_34884">
                  <rect width="24" height="24" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8346 10.8317H4.16797V9.16504H15.8346V10.8317Z"
                fill="#161D46"
              />
            </svg>
          )}
        </a>
      </div>

      {languageInputField && (
        <div className="subject-search-icon">
          <ReactTags
            languageTags={languageTags}
            // suggestions={suggestions}
            delimiters={delimiters}
            handleDelete={handleDeleteLanguageTags}
            handleAddition={handleAdditionLanguageTags}
            inputFieldPosition="top"
            autocomplete
            id="skill-tag"
            allowUnique={false}
            className={`${styles.form_control} form-control`}
          />
        </div>
      )}

      <div className={styles.skills_box}>
        <ul className={styles.skills_list}>
          {languageList?.map((val) => {
            return (
              <Fragment key={val.id}>
                {val.selected ? (
                  <>
                    <li
                      style={{
                        backgroundColor: "#82aad9",
                        borderRadius: "5px",
                      }}
                    >
                      <span
                        style={{
                          cursor: "pointer",
                          marginRight: "15px",
                        }}
                        onClick={() => languageAddHandler(val.name)}
                      >
                        {val.name}
                      </span>
                      <select
                        value={val.level}
                        onChange={(e) =>
                          languageLevelChanged(val.name, e.target.value)
                        }
                      >
                        <option value="basic">Basic</option>
                        <option value="average">Average</option>
                        <option value="good">Good</option>
                        <option value="expert">Expert</option>
                      </select>
                    </li>
                  </>
                ) : (
                  <li
                    key={val.id}
                    onClick={() => languageAddHandler(val.name)}
                    style={{ cursor: "pointer" }}
                  >
                    {val.name}
                  </li>
                )}
              </Fragment>
            );
          })}
          {languageError === 1 && (
            <div className="invalid-feedback d-block">
              You can add minimum 1 language.
            </div>
          )}
        </ul>
      </div>

      <div className={styles.next_pre_btn}>
        <Link href={`/job-seeker/${mode}-cv/step3`}>
          <button
            type="button"
            className={`btn btn-primary ${styles.dash_theem_btn}`}
            // onClick={() => router.back()}
          >
            Prev
          </button>
        </Link>
        <button
          type="button"
          className={`btn btn-primary ${styles.dash_theem_btn}`}
          onClick={() => onSubmit()}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default CvStep4;
