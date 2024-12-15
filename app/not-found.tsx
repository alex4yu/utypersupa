"use client"
import Link from "next/link";
import { useContext, useEffect } from "react";
import SettingsContext from "@utils/settingsContext";
import styles from "@styles/notFound.module.css"

const NotFound = () => {
    const { settings } = useContext(SettingsContext);
    useEffect(() => {
        // Apply the CSS variable for body background color
        document.body.style.setProperty('--bg-color', settings.bgColor);
        document.body.style.setProperty('--title-color', settings.titleColor);
        document.body.style.setProperty('--pre-text-color', settings.preTextColor);
        document.body.style.setProperty('--bg-light-color', settings.bgLightColor);
        
    }, [settings.theme]);
    useEffect(() => {
        const timeout = setTimeout(() => {
          window.location.href = "/"; // Redirect to the homepage
        }, 2000);
    
        return () => clearTimeout(timeout); // Clear timeout on unmount
    }, []);
    return ( 
        <div className={styles.container}>
            <h1>404 Error</h1>
            <h2>Page could not be found</h2>
            <div>If not redirected, click here:</div>
            <p className={styles.backLink}>Back to <Link href = "/">Homepage</Link></p>
        </div>
    )
}


export default NotFound;