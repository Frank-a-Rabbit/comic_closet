import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComics, fetchSavedComics, toggleShowFavorites } from '../redux/features/comics/comicSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faBoltLightning, faHandPointRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../stylesheets/ComicFilter.module.css'
 
function ComicFilter() {
  const dispatch = useDispatch();
  const [dropdownActive, toggleDropDown] = useState(false);
  const [comicsFetched, setComicsFetched] = useState(false);
  const showFavorites = useSelector((state) => state.comics.showFavorites);

  const handleFetchComics = () => {
    dispatch(fetchComics());
    toggleDropDownMenu();
    setComicsFetched(currentState => !currentState);
  };

  const handleFetchSavedComics = () => {
    console.log('yes bro')
    dispatch(toggleShowFavorites(!showFavorites));
  };

  const toggleDropDownMenu = () => {
    toggleDropDown(currentState => !currentState);
  }

  return (
    <div className={`${styles.filterCont} ${dropdownActive ? styles.active : ''}`}>
      <div className={styles.controls}>
        <button aria-label='Show/Hide Dropdown Menu' onClick={toggleDropDownMenu}>Filter<FontAwesomeIcon icon={faFilter} /></button>
        <button onClick={handleFetchSavedComics}>Show Favorites<FontAwesomeIcon icon={faBoltLightning} /></button>
      </div>
      <div className={styles.dropDown}>
        <div className={styles.buttons}>
          <button onClick={handleFetchComics} className={`${comicsFetched ? styles.disabled : ''}`}>Fetch Comics<FontAwesomeIcon icon={faHandPointRight} /></button>
          <button onClick={handleFetchSavedComics}>Fetch Saved Comics<FontAwesomeIcon icon={faHandPointRight} /></button>
        </div>
      </div>
    </div>
  );
}

export default ComicFilter;