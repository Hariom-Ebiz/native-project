import JobSeekerAuth from "@/components/layout/JobSeekerAuth";
import Topbar from "@/components/jobSeeker/Topbar";

import styles from "@/styles/edit_cv_steps.module.css";
import { useEffect, useState } from "react";

const CvParent = ({ children }) => {

  const [lang, setLang] = useState(null);

  useEffect(() => {

    if (localStorage.getItem("lang")) {
      setLang(JSON.parse(localStorage.getItem("lang")).code)
    }
  }, [])

  return (
    <JobSeekerAuth data={{ title: "Edit CV" }}>
      <div className="page_container">
        <div className={["main_content main_bg", `${(lang == "AR") ? styles.land_ar : ""}`]} id="body_lang_css">
          <div className={styles.step_wrapper}>
            <Topbar />
          </div>
          {children}
        </div>
      </div>
    </JobSeekerAuth>
  );
};

export default CvParent;
