import { createSlice } from "@reduxjs/toolkit";

const siteSlice = createSlice({
  name: "site",
  initialState: {
    setting: {},
    loading: true,
    modalOpen: false,
    modalData: "",
    isMobileSidebarOpen: false,
    alertModelOpen: false,
    completeProfileWarning: false,
    language_id: 0
  },
  reducers: {
    updateSetting: (state, action) => {
      state.setting = action.payload;
    },
    updateLoading: (state, action) => {
      state.loading = action.payload;
    },
    setModal: (state, action) => {
      state.modalOpen = true;
      state.modalData = action.payload;
    },
    unsetModal: (state, action) => {
      state.modalOpen = false;
      state.modalData = "";
    },
    setAlertModal: (state, action) => {
      state.alertModelOpen = true;
      state.modalData = action.payload;
    },
    unsetAlertModal: (state, action) => {
      state.alertModelOpen = false;
      state.modalData = "";
    },
    openAuthSidebar: (state, action) => {
      state.isMobileSidebarOpen = action.payload;
    },
    setCompleteProfileWarning: (state, action) => {
      state.completeProfileWarning = true;
    },
    setLanguageId : (state, action) => {
        state.language_id = action.payload
    }
  },
});

export const {
  updateSetting,
  updateLoading,
  setModal,
  unsetModal,
  openAuthSidebar,
  setAlertModal,
unsetAlertModal,
setCompleteProfileWarning,
setLanguageId
} = siteSlice.actions;
export default siteSlice.reducer;
