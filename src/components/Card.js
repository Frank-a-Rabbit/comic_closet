import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons'
import styles from '../stylesheets/Card.module.css';

const Card = ({ name, thumbnail, description }) => {
  return (
    <div className={styles.card}>
      <img src={thumbnail} alt={name} className={styles.cardImage} />
      <div className={styles.contentSection}>
        <button className={styles.faveBtn} aria-label='add to/remove from favorites'>
            <FontAwesomeIcon icon={faBoltLightning}></FontAwesomeIcon>
        </button>
        <h3 className={styles.cardTitle}>{name}</h3>
        { description && (
            <p>{description}</p>
        ) }
      </div>
    </div>
  );
};

export default Card;
