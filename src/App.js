import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import { auth } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginUser } from './redux/features/users/userSlice';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('fb user ', firebaseUser)
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

  return (
    <div className="App">
      <Header></Header>
    </div>
  );
}

export default App;
