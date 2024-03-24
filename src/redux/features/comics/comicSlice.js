import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const initialState = {
  allComics: [],
  comics: [],
  status: 'idle',
  error: null,
  limit: 12,
  offset: 0
};

const publicKey = process.env.REACT_APP_MARVEL_PUBLIC_API_KEY;
const privateKey = process.env.REACT_APP_MARVEL_PRIVATE_API_KEY;
const ts = new Date().getTime();
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

export const fetchComics = createAsyncThunk(
  'comics/fetchComics',
  async (_, { getState, rejectWithValue }) => {
    const { offset, limit } = getState().comics;
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data)
      return data.data.results; // Adjust based on the actual structure of the response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const comicSlice = createSlice({
  name: 'comics',
  initialState,
  reducers: {
    addComic: (state, action) => {
      state.comics.push(action.payload);
    },
    removeComic: (state, action) => {
      state.comics = state.comics.filter(comic => comic.id !== action.payload);
    },
    setComics: (state, action) => {
      state.allComics = action.payload;
    },
    incrementOffset: (state) => {
      state.offset += state.limit;
    },
    decrementOffset: (state) => {
      state.offset = Math.max(0, state.offset -= state.limit);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allComics = action.payload;
        state.error = null;
      })
      .addCase(fetchComics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the new reducer function along with the existing ones
export const { addComic, removeComic, setComics, incrementOffset, decrementOffset } = comicSlice.actions;

export default comicSlice.reducer;