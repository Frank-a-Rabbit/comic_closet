import React from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import Pager from './Pager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSpinner, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../stylesheets/ComicsGrid.module.css';

const ComicsGrid = () => {
  const allComics = useSelector((state) => state.comics.allComics);
  const status = useSelector((state) => state.comics.status);

  return (
    <div className={styles.container}>
        {allComics.length > 0  && (
            <Pager></Pager>
        )}
        {status === 'loading' && (
            <div className={styles.spinner}>
                <FontAwesomeIcon icon={faSpinner}></FontAwesomeIcon>
            </div>
        )}
        {status === 'succeeded' && (
            <>
                <div className={styles.grid}>
                    {allComics.map((comic) => (
                    <Card
                        key={comic.id}
                        name={comic.name}
                        thumbnail={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                        description={comic.description}
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