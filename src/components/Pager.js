import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { incrementOffset, decrementOffset, fetchComics } from "../redux/features/comics/comicSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointLeft, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import styles from "../stylesheets/Pager.module.css";

const Pager = () => {
    const dispatch = useDispatch();
    const limit = useSelector((state) => state.comics.limit);
    const offset = useSelector((state) => state.comics.offset);
    const loadMoreComics = (dir) => {
        if (dir === 'next') {
            dispatch(incrementOffset(limit));
            dispatch(fetchComics());
        } else {
            dispatch(decrementOffset(limit));
            dispatch(fetchComics());
        }
    }

    return (
        <div className={styles.pager}>
            {offset > 0 && (
                <button aria-label="get previous comics" onClick={() => loadMoreComics('prev')}>
                    <FontAwesomeIcon icon={faHandPointLeft}></FontAwesomeIcon>
                </button>
            )}
            <span>Get More Comics</span>
            <button aria-label="get next comics" onClick={() => loadMoreComics('next')}>
                <FontAwesomeIcon icon={faHandPointRight}></FontAwesomeIcon>
            </button>
        </div>
    )
};

export default Pager;