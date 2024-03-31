import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons'
import { addComicToUserFavorites, removeComicFromUserFavorites } from '../redux/features/comics/comicSlice';
import { Link } from 'react-router-dom'; 
import styles from '../stylesheets/Card.module.css';

const Card = ({ comic, isFavorite, userEmail }) => {
    const { id, name, thumbnail, description } = comic;
    const showFavorites = useSelector((state) => state.comics.showFavorites);
    const dispatch = useDispatch();
    const addComic = (userEmail, comic) => {
        dispatch(addComicToUserFavorites({ userEmail, comic }));
    }
    const removeComic = (userEmail, comic) => {
        dispatch(removeComicFromUserFavorites({ userEmail, comic }));
    }
    return (
        <div className={styles.card}>
        <img src={`${thumbnail.path}.${thumbnail.extension}`} alt={name} className={styles.cardImage} />
        <div className={styles.contentSection}>
            <button className={`${styles.faveBtn} ${isFavorite ? styles.fave : ''}`} aria-label='add to/remove from favorites' onClick={() => !isFavorite ? addComic(userEmail, comic) : removeComic(userEmail, comic)}>
                <FontAwesomeIcon icon={faBoltLightning}></FontAwesomeIcon>
            </button>
            <h3 className={styles.cardTitle}>{name}</h3>
            { description && (
                <p>{description}</p>
            ) }
            { isFavorite && showFavorites && (
                <Link to={`/comics/${id}`} className={styles.showDetailsLink}>Show Details</Link>
            ) }
        </div>
        </div>
    );
};

export default Card;
