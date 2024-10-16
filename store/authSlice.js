import { createSlice } from "@reduxjs/toolkit";
import { destroyCookie, setCookie } from "nookies";

const siteSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: null,
    token: null,
    userId: null,
    email: null,
    firstName: null,
    lastName: null,
    profilePic: null,
    role: null,
    isLogout: false,
    is_subscriber: 0,
    was_subscriber: 0,
    subscription: {"career_coaching": 0, "standout": 0, "functional_mastery": []},
  },
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem("authToken");
      destroyCookie(null, "token");
      state.loggedIn = false;
      state.token = null;
      state.userId = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.profilePic = null;
      state.cvStep = null;
      state.companyProfile = null;
      state.isLogout = true;
      state.is_subscriber = 0;
      state.was_subscriber = 0;
      state.subscription = {"career_coaching": 0, "standout": 0, "functional_mastery": []};
    },
    login: (state, action) => {
      let {
        token,
        userId,
        email,
        firstName,
        lastName,
        profilePic,
        role,
        cvStep,
        companyProfile,
        is_subscriber,
        was_subscriber,
        subscription
      } = action.payload;
      localStorage.setItem("authToken", JSON.stringify(token));
      setCookie(null, "token", token, {
        maxAge: 30 * 24 * 60 * 60 * 100,
        path: "/",
        // sameSite: "None",
        // secure: true,
      });

      state.loggedIn = true;
      state.token = token;
      state.userId = userId;
      state.email = email;
      state.firstName = firstName;
      state.lastName = lastName;
      state.profilePic = profilePic;
      state.role = role;
      state.cvStep = cvStep;
      state.companyProfile = companyProfile;
      state.is_subscriber = is_subscriber;
      state.was_subscriber = was_subscriber;
      state.subscription = subscription
    },
    update: (state, action) => {
      let { firstName, lastName, profilePic } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.profilePic = profilePic;
    },
    updateCvStep: (state, action) => {
      state.cvStep = action.payload;
    },    

    updateCompanyProfile: (state, action) => {
      state.companyProfile = action.payload;
    },    

    updateSubscription: (state, action) => {
      state.is_subscriber = true;
      state.was_subscriber = true;
      state.subscription = action.payload;
    }
  },
});

export const { logout, login, update, updateCvStep, updateLoading, updateCompanyProfile, updateSubscription } = siteSlice.actions;
export default siteSlice.reducer;
