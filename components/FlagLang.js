import React, { useEffect, useState } from "react";
import styles from "../styles/flag.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useSelector } from "react-redux";
import { setLanguageId, updateLang } from "@/store/siteSlice";
import { useDispatch } from "react-redux";
import { getLanguage, languageChange } from "@/services/language";
import { setCookie } from "nookies";

const FlagLang = () => {
  const dispatch = useDispatch();
  const get = localStorage.getItem("lang")
    ? JSON.parse(localStorage.getItem("lang"))
    : {};
  const [selectedLanguage, setSelectedLanguage] = useState(get?.code || "EN"); // State to track selected language

  const [languages, setLanguage] = useState([])

  useEffect(() => {
      getLanguage()
      .then(v => {
        setLanguage(v.langs)
      })
      .catch((err) => {
        alert("Language can't fetched.");
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("lang")) {
      let lang = JSON.parse(localStorage.getItem("lang"));
      languageChange(lang.code);
    }
  }, []);

  // Function to handle language change
  const changeLanguage = (language) => {
    setSelectedLanguage(language.code);
    localStorage.setItem("lang", JSON.stringify(language));
    setCookie(null, "lang", JSON.stringify(language));
    languageChange(language.code);
    dispatch(setLanguageId(language.id))
    window.location.reload();
  };

  // List of languages
  // const languages = [
  //   { code: "EN", name: "English", flag: "./img/english-flag.png" },
  //   { code: "AR", name: "Arabic", flag: "./img/arabic.png" },
  //   // Add more languages as needed
  // ];

  return (
    <div className={styles.Dropdown_box}>
      <Dropdown>
        <Dropdown.Toggle className={styles.DropdownBtn} id="dropdown-basic">
          <span className={styles.FlagLangImg}>
            <img
              src={
                languages?.find((lang) => lang.code === selectedLanguage)?.flag
              }
              alt={selectedLanguage}
            />
          </span>
          {selectedLanguage}
        </Dropdown.Toggle>

        <Dropdown.Menu className={styles.dropdown_content}>
          {languages.map((language) => (
            <Dropdown.Item
              key={language.code}
              onClick={() => changeLanguage(language)}
            >
              <div className={styles.country_box}>
                <span className={styles.FlagLangImg}>
                  <img src={language.flag} alt={language.code} />
                </span>
                <span className={styles.country_text}>{language.name}</span>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FlagLang;
