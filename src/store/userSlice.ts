import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
   fullname: string;
     savedBlogs?: string[];
}

interface UserState {
  currentUser: User | null;
}
const storedUser=typeof window!=="undefined"?localStorage.getItem("user"):null;

const initialState: UserState = {
  currentUser: storedUser? JSON.parse(storedUser):null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      localStorage.setItem("user",JSON.stringify(action.payload));
    },
    updateSavedBlogs(state, action: PayloadAction<string[]>){
      if(state.currentUser){
        state.currentUser.savedBlogs=action.payload;
              localStorage.setItem("user", JSON.stringify(state.currentUser));

      }
    },
    logoutUser:(state) =>{
      state.currentUser = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logoutUser ,updateSavedBlogs} = userSlice.actions;
export default userSlice.reducer;
