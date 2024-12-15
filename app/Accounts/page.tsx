"use client"
import { useContext, useEffect, useState } from 'react';
import SettingsContext from '@/utils/settingsContext';
import { getUserProfile } from './actions';
import { redirect, useRouter } from 'next/navigation';
import styles from "@styles/account.module.css";

export default function Account() {
    const { settings } = useContext(SettingsContext);
    useEffect(() => {
        // Apply the CSS variable for body background color
        document.body.style.setProperty('--bg-color', settings.bgColor);
        document.body.style.setProperty('--title-color', settings.titleColor);
        document.body.style.setProperty('--pre-text-color', settings.preTextColor);
        document.body.style.setProperty('--bg-light-color', settings.bgLightColor);
        document.body.style.setProperty('--wrong-color', settings.wrongColor);
    }, [settings.theme]);

    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState<string | undefined>("")
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getUserProfile();
                if(response?.error){
                    //console.log(response.error);
                    if(response.error === "no user"){
                        router.push("/Accounts/login");
                    }
                    else{
                        alert(response.error);
                    }
                }
                else if(response?.data){
                    setEmail(response.data.email);
                    setUsername(response.data.username);
                }
                
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
            setLoading(false);
        };
    
        fetchUserProfile();
    }, [])

    const  updateProfile = (username: string): void =>{
        if(!loading){
            console.log("function not implemented");
        }
    }

    const handleSignout = async () => {
        try {
            const response = await fetch("/auth/signout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.redirected) {
                window.location.href = response.url;
            } else if (response.ok) {
                router.push("/Accounts/login"); // Fallback redirect if no automatic redirect occurs
            } else {
                const data = await response.json();
                alert(data.error || "Failed to sign out.");
            }
            
        } catch (error) {
            console.error("Sign-out error:", error);
            alert("An error occurred during sign-out.");
        }
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>{`Hello ${username}`}</div>

            <div className={styles.section}>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={email} disabled />
            </div>
            <div className={styles.section}>
                <label htmlFor="username">Username</label>
                <input
                id="username"
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            
            <div className={styles.button} onClick={() => updateProfile(username)}>
                {loading ? 'Loading ...' : 'Update'}
            </div>

            <div className={styles.button} onClick={handleSignout}> Sign out </div>
        </div>
    )
}