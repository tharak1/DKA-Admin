import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmployeeModel } from "../Models/EmployeeModel";

// const navigate = useNavigate();

interface UserSlice{
    user: EmployeeModel | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserSlice = {
    user: null,
    status: 'idle',
    error: null,
};

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (user: EmployeeModel) => {
      try {
        return user; 
      } catch (error: any) {
        return error.message; 
      }
    }
  );

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async()=>{
        try {
            return null;
        } catch (error:any) {
            return error.message; 
        }
    }
)

const UserSlice = createSlice({
    name:'user',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload;
          })
          .addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          })


          .addCase(logoutUser.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(logoutUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload;
          })
          .addCase(logoutUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          })
    }
});


export const GetUser = (state:any) => state.user.user;

export const GetStatus = (state:any) => state.user.status;

export const GetError = (state:any) => state.user.error;

export default UserSlice.reducer;