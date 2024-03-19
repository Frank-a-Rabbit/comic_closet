// features/comics/comicSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comics: []
};

export const comicSlice = createSlice({
  name: 'comics',
  initialState,
  reducers: {
    addComic: (state, action) => {
      // Assuming action.payload contains a comic book object
      state.comics.push(action.payload);
    },
    removeComic: (state, action) => {
      // Assuming action.payload contains the id of the comic to be removed
      state.comics = state.comics.filter(comic => comic.id !== action.payload);
    }
  }
});

export const { addComic, removeComic } = comicSlice.actions;

export default comicSlice.reducer;