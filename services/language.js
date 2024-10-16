const { axiosInstance } = require("@/api");

exports.languageChange = (lang) => {
    const htmlTag = document.getElementById("lang_dir");
    const bodyTag = document.getElementById("body_lang_css");
    
    if (lang == "AR") {
        htmlTag.setAttribute("dir", "rtl")
        htmlTag.setAttribute("lang", "ar")
        bodyTag.classList.add("land_ar");
    } else {
        htmlTag.removeAttribute("dir")
        htmlTag.setAttribute("lang", "en")
        bodyTag.classList.remove("land_ar");
    }
}

exports.getLanguage = async () => {
    let res
    try {
        res = await axiosInstance.get("master/language-list");
    } catch (err) {
        console.log("error", err);
        return {
            langs: []
        };
    }
    return {
        langs: res?.data?.list || [],
    };
}