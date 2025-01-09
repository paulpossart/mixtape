import React from "react";
import styles from './Header.module.scss';
import SpotifyLogin from "./SpotifyLogin";

function Header({ className }) {
    return (
        <div className={`${className} ${styles.div}`}>
            <h1 className={styles.header}>mixtape</h1>
            <SpotifyLogin />
        </div>
    );
}

export default Header;