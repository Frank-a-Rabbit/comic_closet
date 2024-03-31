import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout';
import ComicDetails from './components/ComicDetails';
import { auth } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginUser } from './redux/features/users/userSlice';
import { fetchSavedComics } from './redux/features/comics/comicSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(loginUser({
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL
        }));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user.user) {
      dispatch(fetchSavedComics(user.user));
    }
  }, [user, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout></Layout>}></Route>
        <Route path='/comics/:comicId' element={<ComicDetails></ComicDetails>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
