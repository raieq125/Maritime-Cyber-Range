import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  initialFetchDone: false,
  LoggedIn: false,
  IsAdmin: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleLoggedIn: (state) => {
      state.LoggedIn = !state.LoggedIn;
    },
    toggleAdmin: (state) => {
      state.IsAdmin = !state.IsAdmin;
      console.log("i have been toggled");
    },
    setInitialFetchDone: (state) => {
      state.initialFetchDone = true;
    },
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    signOutUserFailure: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  updateError,
  setInitialFetchDone,
  toggleLoggedIn,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
  toggleAdmin
} = userSlice.actions;

export default userSlice.reducer;
