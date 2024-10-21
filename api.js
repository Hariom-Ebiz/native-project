import axios from "axios";

// export const BASEURL =
//   process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_DEV_BACKEND_URI
//     : process.env.NEXT_PUBLIC_PROD_BACKEND_URI;

export const BASEURL = "https://nativens.stage04.obdemo.com";

// export const BASEURL = "http://localhost:4042";  

// export const BASEURL = "https://ns.native-career.com";


// export const BASEURL = "http://192.168.235.245:4042";
// export const IMAGEBASEURL = "http://192.168.235.245:4073";

// export const BASEURL = "http://192.168.235.245:4042"

// export const IMAGEBASEURL = "http://localhost:4042/";
// export const IMAGEBASEURL = "https://ns.native-career.com/";

export const IMAGEBASEURL = "https://nativens.stage04.obdemo.com/";

// export const CANDIDATE_URL =  "http://localhost:4074";
export const EMPLOYER_URL = "http://localhost:4075/employer";

// local lan
// export const BASEURL = "http://192.100.100.35:4042";
// export const IMAGEBASEURL = "http://192.100.100.35:4042/";


// export const BASEURL = "https://nativens.stage04.obdemo.com";
// export const IMAGEBASEURL = "https://nativens.stage04.obdemo.com";

export const API = BASEURL;

export const axiosInstance = axios.create({ baseURL: `${API}/` });
