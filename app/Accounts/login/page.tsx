"use client"
import { useEffect, useContext, useState } from 'react';
import SettingsContext from "@utils/settingsContext";
import styles from '@styles/signup_in.module.css';
import { logInAction } from '@app/Accounts/actions';
import { redirect, useRouter } from 'next/navigation'

export default function LoginPage() {
    const { settings } = useContext(SettingsContext);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
        // Apply the CSS variable for body background color
        document.body.style.setProperty('--bg-color', settings.bgColor);
        document.body.style.setProperty('--title-color', settings.titleColor);
        document.body.style.setProperty('--pre-text-color', settings.preTextColor);
        document.body.style.setProperty('--bg-light-color', settings.bgLightColor);
        document.body.style.setProperty('--wrong-color', settings.wrongColor);
    }, [settings.theme]);

    const handleLogin = async () => {
        const {error} = await logInAction({email: email, password: password});
        if(error){
            setErrorMsg(error);
        }
        else{
            router.push('/account')
        }
    }
    const handleSwitch = () => {
        router.push('./signup');
    }

    return(
        <div className={styles.inputArea}>
            <div className={styles.title}>Log in to Utyper</div>
            <form className={styles.inputForm}>
                {/*email row */}
                <label className={styles.inputLabel} htmlFor="email">Email:</label>
                <input className={styles.formInput} id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                {/*password row */}
                <label className={styles.inputLabel} htmlFor="password">Password:</label>
                <input className={styles.formInput} id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                <div className={styles.error}>{errorMsg}</div>
                <button className={styles.formSubmit} formAction={handleLogin}>Log in</button>    
            </form>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: '35px'}}>
                <div className={styles.noAccount}>No account yet?</div>
                <div className={styles.signUpBtn} onClick={handleSwitch}>Sign up</div>
            </div>
            
        </div>
    )

    
}