import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '../redux/features/users/userSlice';

const LoginButton = () => {
  const dispatch = useDispatch();
  
  const login = () => {
    dispatch(loginWithGoogle());
  };
  
  return (
    <button onClick={login}>Login</button>
  );
};

export default LoginButton;