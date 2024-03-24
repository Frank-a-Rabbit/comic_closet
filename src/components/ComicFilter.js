import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchComics, setComics } from '../redux/features/comics/comicSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faBoltLightning, faHandPointRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../stylesheets/ComicFilter.module.css'
 
function ComicFilter() {
  const dispatch = useDispatch();
  const [dropdownActive, toggleDropDown] = useState(false);
  const [comicsFetched, setComicsFetched] = useState(false);

  const handleFetchComics = () => {
    dispatch(fetchComics());
    toggleDropDownMenu();
    setComicsFetched(currentState => !currentState);
  };

  const handleFetchSavedComics = () => {
    const savedComics = JSON.parse(localStorage.getItem('savedComics')) || [];
    // Assuming you have an action to set comics in your state
    // Replace `setComics` with the actual action creator you have
    dispatch(setComics(savedComics));
  };

  const toggleDropDownMenu = () => {
    toggleDropDown(currentState => !currentState);
  }

  return (
    <div className={`${styles.filterCont} ${dropdownActive ? styles.active : ''}`}>
      <div className={styles.controls}>
        <button aria-label='Show/Hide Dropdown Menu' onClick={toggleDropDownMenu}>Filter<FontAwesomeIcon icon={faFilter} /></button>
        <button>Show Favorites<FontAwesomeIcon icon={faBoltLightning} /></button>
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