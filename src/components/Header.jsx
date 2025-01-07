import React from "react";
import styles from './Header.module.scss';

function Header({ className }) {
    return (
        <div className={`${className} ${styles.div}`}>
            <h1 className={styles.header}>mixtape</h1>
            <p>btn holder</p>
        </div>
    );
}

export default Header;