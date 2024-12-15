"use client"
import { useEffect, useContext, useState } from 'react';
import SettingsContext from "@utils/settingsContext";
import styles from '@styles/signup_in.module.css';
import { signUpAction } from '@app/Accounts/actions';
import { redirect, useRouter, useSearchParams } from 'next/navigation'

export default function SignupPage() {
    const { settings } = useContext(SettingsContext);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMessage, setSuccessMessage] = useState<undefined | string>("");
    useEffect(() => {
        // Apply the CSS variable for body background color
        document.body.style.setProperty('--bg-color', settings.bgColor);
        document.body.style.setProperty('--title-color', settings.titleColor);
        document.body.style.setProperty('--pre-text-color', settings.preTextColor);
        document.body.style.setProperty('--bg-light-color', settings.bgLightColor);
        document.body.style.setProperty('--wrong-color', settings.wrongColor);
    }, [settings.theme]);

    const handleSignup = async () => {
        if(password !== retypePassword){
            setErrorMsg("Passwords don't match");
            return;
        }
        if(password.length < 6){
            setErrorMsg("Password must be at least 6 characters long");
            return;
        }
        
        const {data} = await signUpAction({username: username, email: email, password: password});
        if(data.error){
            setErrorMsg(data.error);
        }
        else{
            router.push("/Accounts");
        }
    }

    const handleSwitch = () => {
        redirect('./login');
    }

    return(
        <div className={styles.inputArea}>
            <div className={styles.title}>Sign Up</div>
            <form className={styles.inputForm}>
                <label className={styles.inputLabel} htmlFor="username">Username:</label>
                <input className={styles.formInput} id="username" name="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)}/>

                <label className={styles.inputLabel} htmlFor="email">Email:</label>
                <input className={styles.formInput} id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label className={styles.inputLabel} htmlFor="password">Password:</label>
                <input className={styles.formInput} id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>

                <label className={styles.inputLabel} htmlFor="retypePassword">Retype Password:</label>
                <input className={styles.formInput} id="retypePassword" name="retypePassword" type="password" required value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)}/>

                <div className={styles.error}>{errorMsg}</div>
                <div className={styles.success}>{successMessage}</div>
                <button className={styles.formSubmit} formAction={handleSignup}>Sign Up</button>    
            </form>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: '35px'}}>
                <div className={styles.noAccount}>Already have an account?</div>
                <div className={styles.signUpBtn} onClick={handleSwitch}>Log In</div>
            </div>
            
        </div>
    )

    
}