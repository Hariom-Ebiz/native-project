import { axiosInstance } from "../api";

export const faqPageData = async (role, lang_id) => {
    console.log("lang _id : ", lang_id, role);
    
    let res, res1
    try {
        if(lang_id == 1){
            res = await axiosInstance.get("faq/all?page=1&per_page=10&sort_by=likes&order=desc&role="+role+"");
        } else {
            res = await axiosInstance.get("faq/language/all?page=1&per_page=10&sort_by=likes&order=desc&role="+role+""+"&language_id="+lang_id);
        }

        res1 = await axiosInstance.get("faq/get/category-by-role?page=1&per_page=10&sort_by=category&order=asc&role="+role+"");
    } catch (err) {
        console.log("error", err);
        return {
            faqs: [],
            faqCategory: []
        };
    }
    return {
        faqs: res?.data?.faqs || [],
        faqCategory: res1?.data?.categories || [],
    };
};

export const getFaqByCategory = async (category_id, role, lang_id) => {
    
    let res;
    try {
        if(lang_id == 1){
            res = await axiosInstance.get("faq/all?page=1&per_page=10&sort_by=likes&order=desc&category_id=" + category_id + "&role="+role+"");
        } else{
            res = await axiosInstance.get("faq/language/all?page=1&per_page=10&sort_by=likes&order=desc&category_id=" + category_id + "&role="+role+""+"&language_id="+lang_id);
        }
        

    } catch (err) {
        console.log("error");
        return {
            faqs: [],
        };
    }
    return {
        faqs: res?.data?.faqs || [],
    };
};

export const searchQuestion = async (serachKey, role, lang_id) => {
    let res;
    try {
        if(lang_id == 1){
            res = await axiosInstance.get("faq/all?page=1&per_page=10&sort_by=likes&order=desc&question="+serachKey+"&role="+role+"");
        } else {
            res = await axiosInstance.get("faq/language/all?page=1&per_page=10&sort_by=likes&order=desc&question="+serachKey+"&role="+role+""+"&language_id="+lang_id);
        }
    } catch (err) {
        console.log("error");
        return {
            faqs: [],
        };
    }
    return {
        faqs: res?.data?.faqs || [],
    };
}

export const likeOrDislike = async (id, isLike, isDislike) => {
    let res;
    try {
        res = await axiosInstance.put("faq/like-dislike",{id, isLike, isDislike});
    } catch (err) {
        console.log("error");
        return {
            faqId: "",
        };
    }
    return {
        faqId: res?.data?.id || "",
    };
}
