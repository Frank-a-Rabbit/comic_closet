import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import { databaseConnection } from '../../../utils/firebase';
import { doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const initialState = {
  allComics: [],
  comics: [],
  status: 'idle',
  error: null,
  limit: 12,
  offset: 0,
  showFavorites: false
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
      return data.data.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSavedComics = createAsyncThunk(
  'comics/fetchSavedComics',
  async (user, { rejectWithValue }) => {
    try {
      const docRef = databaseConnection.collection('comics').doc(user.email);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        const { comics } = docSnapshot.data();
        return comics;
      } else {
        console.log('No document found for user:', user.email);
        return [];
      }
    } catch (error) {
      console.error('Error fetching saved comics:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const addComicToUserFavorites = createAsyncThunk(
  'comics/addComicToUserFavorites',
  async ({ userEmail, comic }, { rejectWithValue, getState }) => {
    try {
      const userRef = doc(databaseConnection, 'comics', userEmail);

      await setDoc(userRef, {
        comics: arrayUnion(comic)
      }, { merge: true });

      return comic;
    } catch (error) {
      console.error('Failed to add or update comic in user favorites:', error);
      return rejectWithValue(error.toString());
    }
  }
);

export const removeComicFromUserFavorites = createAsyncThunk(
  'comics/removeComicFromUserFavorites',
  async ({ userEmail, comic }, { rejectWithValue }) => {
    try {
      const userRef = doc(databaseConnection, 'comics', userEmail);
      await setDoc(userRef, {
        comics: arrayRemove(comic)
      }, { merge: true });

      return comic;
    } catch (error) {
      console.error('Failed to remove comic from user favorites:', error);
      return rejectWithValue(error.toString());
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
    incrementOffset: (state) => {
      state.offset += state.limit;
    },
    decrementOffset: (state) => {
      state.offset = Math.max(0, state.offset -= state.limit);
    },
    toggleShowFavorites: (state, action) => {
      state.showFavorites = action.payload;
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
      })
      .addCase(fetchSavedComics.fulfilled, (state, action) => {
        state.comics = action.payload;
      })
      .addCase(addComicToUserFavorites.fulfilled, (state, action) => {
        state.comics.push(action.payload);
      })
      .addCase(removeComicFromUserFavorites.fulfilled, (state, action) => {
        state.comics = state.comics.filter(comic => comic.id !== action.payload.id);
      });
  },
});

export const { addComic, removeComic, incrementOffset, decrementOffset, toggleShowFavorites } = comicSlice.actions;

export default comicSlice.reducer;