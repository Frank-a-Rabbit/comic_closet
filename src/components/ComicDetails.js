import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSavedComics } from "../redux/features/comics/comicSlice";
import Header from "./Header";
import styles from '../stylesheets/ComicDetails.module.css';

const ComicDetails = () => {
    const { comicId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [showComicsList, toggleComicsList] = useState(false); 
    const [showSeriesList, toggleSeriesList] = useState(false);
    const comic = useSelector(state => 
        state.comics?.comics?.find(comic => comic.id.toString() === comicId)
    );
    useEffect(() => {
        if (!comic) {
            dispatch(fetchSavedComics());
        }
    }, [comicId, comic, dispatch]);
    if (!comic) {
        return (
            <>
                <Header></Header>
                <div>Loading comic details...</div>
            </>
        );
    }
    const { comics, series, name, description, thumbnail } = comic;
    const generateInfoSection = (comics && comics?.items && comics?.items?.length > 0 || series && series?.items && series?.items?.length > 0) ? true : false; 
    return (
        <>
            <Header></Header>
            <div className={styles.back}>
                <Link to={'/'}>Back</Link>
            </div>
            {user.user && (
                <section>
                    <header className={styles.comicDetailHeader}>
                        <h1>{name}</h1>
                    </header>
                    <div className={styles.comicDetailContainer}>
                        <div className={styles.topSection}>
                            <div className={styles.imgCont}>
                                <img src={`${thumbnail?.path}.${thumbnail?.extension}`} alt={name} />
                            </div>
                            <div className={styles.contentSection}>
                                {description && (
                                    <p>{description}</p>
                                )}
                            </div>
                        </div>
                        {generateInfoSection && (
                            <div className={styles.bottomSection}>
                                {comics && comics.items && comics.items.length > 0 && (
                                    <>
                                        <button onClick={() => toggleComicsList(prev => !prev)}>Show Comics</button>
                                        <ul className={`${styles.comicsList} ${showComicsList ? styles.activeList : ''}`}>
                                            {comics.items.map((comic, index) => (
                                                <li key={index}>{comic.name}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {series && series.items && series.items.length > 0 && (
                                    <>
                                        <button onClick={() => toggleSeriesList(prev => !prev)}>Show Series</button>
                                        <ul className={`${styles.comicsList} ${showSeriesList ? styles.activeList : ''}`}>
                                            {series.items.map((issue, index) => (
                                                <li key={index}>{issue.name}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </>
    )
}

export default ComicDetails;