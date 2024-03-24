import React from 'react';
import styles from '../stylesheets/Header.module.css'
import LoginButton from './LoginButton';
import { logoutUser } from '../redux/features/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
    const dispatch = useDispatch();
    const handleLogOut = () => {
        dispatch(logoutUser());
    }
    const user = useSelector(state => state.user);
    return (
        <header className={styles.header}>
            <h1>Comic Closet</h1>
            <div className={styles.detailsCont}>
                <div className={styles.details}>
                    { user.user && (
                        <>
                            <span>{user.user?.displayName}</span>
                            <img className={styles.avatar} alt={user.user?.displayName} src={user.user?.photoURL} loading='lazy' width='50' height='50'></img>
                        </>
                    ) }
                </div>
                { user.user && (
                    <button onClick={handleLogOut}>Logout</button>
                ) }
                { !user.user && (
                    <LoginButton></LoginButton>
                ) }
            </div>
        </header>
    )
};

export default Header;