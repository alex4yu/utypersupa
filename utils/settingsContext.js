"use client"
import { createContext, useState, useEffect} from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const defaultSettings = {
    liveWPM: 'OFF',
    liveAccuracy: 'OFF',
    trueTyping: 'OFF',
    noErrors: 'OFF',
    noBackspace: 'OFF',
    theme: 'blueRoyal',
    bgColor: '#001d3d',
    titleColor: '#ffc300',
    preTextColor: '#516c8a',
    bgLightColor: '#002752',
    wrongColor: 'red'
  };


  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
