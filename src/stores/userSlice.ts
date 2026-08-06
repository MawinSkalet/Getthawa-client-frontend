import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  displayName: "",
  pictureUrl: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    setPictureUrl: (state, action) => {
      state.pictureUrl = action.payload;
    },
    logout: (state) => {
      state.id = "";
      state.displayName = "";
      state.pictureUrl = "";
    },
  },
});

export const { setId, setDisplayName, setPictureUrl, logout } =
  userSlice.actions;
export default userSlice.reducer;
