import React from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import Pager from './Pager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSpinner, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../stylesheets/ComicsGrid.module.css';

const ComicsGrid = () => {
  const { allComics, comics } = useSelector((state) => state.comics);
  const userEmail = useSelector((state) => state.user?.user?.email);
  const status = useSelector((state) => state.comics.status);
  const showFavorites = useSelector((state) => state.comics.showFavorites);

  return (
    <div className={styles.container}>
        {allComics.length > 0  && !showFavorites && (
            <Pager></Pager>
        )}
        {status === 'loading' && (
            <div className={styles.spinner}>
                <FontAwesomeIcon icon={faSpinner}></FontAwesomeIcon>
            </div>
        )}
        {status === 'succeeded' && !showFavorites && (
            <>
                <div className={styles.grid}>
                    {allComics.map((comic) => (
                        <Card
                            key={comic.id}
                            comic={comic}
                            isFavorite={comics.some(favorite => favorite.id === comic.id)}
                            userEmail={userEmail}
                        />
                    ))}
                </div>
                <div className={styles.prompt}>
                    <span>Swipe for more results</span>
                    <FontAwesomeIcon icon={faHandPointRight}></FontAwesomeIcon>
                </div>
            </>
        )}
        {showFavorites && (
            <>
                <div className={styles.grid}>
                    {comics.slice().sort((a, b) => a.name.localeCompare(b.name)).map((comic) => (
                        <Card
                            key={comic.id}
                            comic={comic}
                            isFavorite={comics.some(favorite => favorite.id === comic.id)}
                            userEmail={userEmail}
                        />
                    ))}
                </div>
                <div className={styles.prompt}>
                    <span>Swipe for more results</span>
                    <FontAwesomeIcon icon={faHandPointRight}></FontAwesomeIcon>
                </div>
            </>
        )}
    </div>
  );
};

export default ComicsGrid;