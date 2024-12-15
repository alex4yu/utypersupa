"use client"
import React, { useContext, useEffect, useState } from "react";
import styles from '@styles/settings.module.css';
import SettingsContext from '@utils/settingsContext';


export default function Settings(){
    
    const { settings, updateSettings } = useContext(SettingsContext);
    useEffect(() => {
    // Apply the CSS variable for body background color
        document.body.style.setProperty('--bg-color', settings.bgColor);
        document.body.style.setProperty('--title-color', settings.titleColor);
        document.body.style.setProperty('--pre-text-color', settings.preTextColor);
        document.body.style.setProperty('--bg-light-color', settings.bgLightColor);
    }, [settings.theme]);
    const [liveWPM, setLiveWPM] = useState(settings.liveWPM);
    const [liveAccuracy, setLiveAccuracy] = useState(settings.liveAccuracy);
    const [trueTyping, setTrueTyping] = useState(settings.trueTyping);
    const [noErrors, setNoError] = useState(settings.noErrors);
    const [noBackspace, setNoBackspace] = useState(settings.noBackspace);

    
    

    const newSettingValue = (curVal: 'ON'|'OFF') =>{
        return curVal === 'ON' ? 'OFF': 'ON';
    }
    const toggleSetting = (setting: string) =>{
        if(setting === "liveWPM"){
            const newVal = newSettingValue(liveWPM);
            setLiveWPM(newVal);
            updateSettings({ ['liveWPM']: newVal});
        }
        else if(setting === "liveAccuracy"){
            const newVal = newSettingValue(liveAccuracy);
            setLiveAccuracy(newVal);
            updateSettings({ ['liveAccuracy']: newVal});
        }
        else if(setting === "trueTyping"){
            const newVal = newSettingValue(trueTyping);
            setTrueTyping(newVal);
            updateSettings({ ['trueTyping']: newVal});
        }
        else if(setting === "noErrors"){
            const newVal = newSettingValue(noErrors);
            setNoError(newVal);
            updateSettings({ ['noErrors']: newVal });
        }
        else if(setting === "noBackspace"){
            const newVal = newSettingValue(noBackspace);
            setNoBackspace(newVal);
            updateSettings({ ['noBackspace']: newVal});
        }
        
    }

    const changeTheme = (theme: string) => {
        console.log('new theme: ' + theme);
        if(theme === "blueRoyal"){
            updateSettings({ ['theme']: 'blueRoyal'});
            updateSettings({ ['bgColor']: '#001d3d'});
            updateSettings({ ['titleColor']: '#ffc300'});
            updateSettings({ ['preTextColor']: '#516c8a'});
            updateSettings({ ['bgLightColor']: '#002752'});
            updateSettings({ ['wrongColor']: 'red'});
        }
        else if(theme === 'matrix'){
            updateSettings({ ['theme']: 'matrix'});
            updateSettings({ ['bgColor']: 'black'});
            updateSettings({ ['titleColor']: '#15d128'});
            updateSettings({ ['preTextColor']: '#03540b'});
            updateSettings({ ['bgLightColor']: '#0d2112'});
            updateSettings({ ['wrongColor']: 'red'});
        }
        else if(theme === 'word'){
            updateSettings({ ['theme']: 'word'});
            updateSettings({ ['bgColor']: 'white'});
            updateSettings({ ['titleColor']: 'black'});
            updateSettings({ ['preTextColor']: '#a3a3a3'});
            updateSettings({ ['bgLightColor']: '#f0f0f0'});
            updateSettings({ ['wrongColor']: 'red'});
        }
        else if(theme === 'night'){
            updateSettings({ ['theme']: 'night'});
            updateSettings({ ['bgColor']: '#0e062b'});
            updateSettings({ ['titleColor']: '#ffec9c'});
            updateSettings({ ['preTextColor']: '#6a71a5'});
            updateSettings({ ['bgLightColor']: '#35336b'});
            updateSettings({ ['wrongColor']: 'red'});
        }
    }


    return(
        <div>
            <div className = {styles.settingSection}>Display</div>
            <div className = {styles.sectionContainer}>
                <div className = {styles.labelContainer}>
                    <div className = {styles.label}>
                        <div className = {styles.labelName}>Live WPM</div>
                        <div className = {styles.labelDescription}>Displays cumulative words per minute during the test </div>
                    </div>
                    <div className = {styles.label}>
                        <div className = {styles.labelName}>Live Accuracy</div>
                        <div className = {styles.labelDescription}>Displays overall typing accuracy during the test </div>
                    </div>
                    <div className = {styles.label}>
                        <div className = {styles.labelName}>True Typing</div>
                        <div className = {styles.labelDescription}>Displays actual typed characters rather than prompt during the test </div>
                    </div>
                    
                </div>
                <div className = {styles.buttonsContainer}>
                    <div className = {styles.settingButton} onClick={()=>toggleSetting('liveWPM')}>{liveWPM}</div>
                    <div className = {styles.settingButton} onClick={()=>toggleSetting('liveAccuracy')}>{liveAccuracy}</div>
                    <div className = {styles.settingButton} onClick={()=>toggleSetting('trueTyping')}>{trueTyping}</div>
                </div>
            </div>

            <div className = {styles.settingSection}>Typing Settings</div>
            <div className = {styles.sectionContainer}>
                <div className = {styles.labelContainer}>
                    <div className = {styles.label}>
                        <div className = {styles.labelName}>No Errors</div>
                        <div className = {styles.labelDescription}>Test ends on first mistake</div>
                    </div>
                    <div className = {styles.label}>
                        <div className = {styles.labelName}>No Backspace</div>
                        <div className = {styles.labelDescription}>Unable to use backspace in tests</div>
                    </div>
                </div>
                <div className = {styles.buttonsContainer}>
                    <div className = {styles.settingButton} onClick={()=>toggleSetting('noErrors')}>{noErrors}</div>
                    <div className = {styles.settingButton} onClick={()=>toggleSetting('noBackspace')}>{noBackspace}</div>
                </div>
            </div>

            <div className = {styles.settingSection}>Themes</div>
            <div className = {styles.sectionContainer}>
                <div 
                    className = {styles.theme} 
                    style={{border: '3px solid #ffc300', color: '#ffc300', background: '#001d3d'}}
                    onClick={() => changeTheme('blueRoyal')}
                >Blue Royal</div>
                <div 
                    className = {styles.theme} 
                    style={{border: '3px solid #15d128', color: '#15d128', background: 'black'}}
                    onClick={() => changeTheme('matrix')}
                >Matrix</div>
                <div 
                    className = {styles.theme} 
                    style={{border: '3px solid black', color: 'black', background: 'white'}}
                    onClick={() => changeTheme('word')}
                >Word</div>
                <div 
                    className = {styles.theme} 
                    style={{border: '3px solid #ffec9c', color: '#ffec9c', background: '#0e062b'}}
                    onClick={() => changeTheme('night')}
                >Night</div>
            </div>
            
        </div>
        
        
            
        )
}