// features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../../utils/firebase';

export const loginWithGoogle = createAsyncThunk(
    'user/loginWithGoogle',
    async (_, { rejectWithValue }) => {
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        return { user : user }; // Simplified user object
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

const initialState = {
  user: null,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
    },
    loginUser: (state, action) => {
      const { displayName, email, uid, photoURL } = action.payload;
      state.user = { displayName, email, uid, photoURL }; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        console.log('action ', action)
        state.status = 'succeeded';
        const { displayName, email, uid, photoURL } = action.payload.user;
        state.user = { displayName, email, uid, photoURL }; 
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logoutUser, loginUser } = userSlice.actions;

export default userSlice.reducer;