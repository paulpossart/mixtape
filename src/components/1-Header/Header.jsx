import React from "react";
import styles from './Header.module.scss';
import SpotifyLogin from "./SpotifyLogin";
import About from "./About";

function Header({ className }) {
    return (
        <div className={`${className} ${styles.div}`}>
            <h1 className={styles.header}>mixtape</h1>
            <div className={styles.btnContainer}>
                <About />
                <SpotifyLogin className={styles.smallscreen} />
            </div>
        </div>
    );
}

export default Header;
