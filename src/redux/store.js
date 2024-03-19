import { configureStore } from '@reduxjs/toolkit';
import comicReducer from './features/comics/comicSlice';
import userReducer from './features/users/userSlice';

export const store = configureStore({
  reducer: {
    comics: comicReducer,
    user: userReducer,
  },
});