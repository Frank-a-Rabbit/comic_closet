import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import { auth, databaseConnection, firebase } from '../../../utils/firebase';
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
      return data.data.results; // Adjust based on the actual structure of the response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch saved comics for the current user
export const fetchSavedComics = createAsyncThunk(
  'comics/fetchSavedComics',
  async (user, { rejectWithValue }) => {
    try {
      // Directly reference the document by the user's email
      const docRef = databaseConnection.collection('comics').doc(user.email);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        // Assuming the array field is named 'comics' within the document
        const { comics } = docSnapshot.data();
        console.log('Fetched comics:', comics);
        return comics;
      } else {
        // Handle the case where there's no document for the user
        console.log('No document found for user:', user.email);
        return []; // Returning an empty array or handle as needed
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
      // Note: Ensure your databaseConnection correctly points to your Firestore instance
      const userRef = doc(databaseConnection, 'comics', userEmail);

      // Use setDoc with { merge: true } to update or create the document
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
      // Use setDoc with { merge: true } and arrayRemove to remove the comic
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
    // setComics: (state, action) => {
    //   state.allComics = action.payload;
    // },
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

// Export the new reducer function along with the existing ones
export const { addComic, removeComic, incrementOffset, decrementOffset, toggleShowFavorites } = comicSlice.actions;

export default comicSlice.reducer;