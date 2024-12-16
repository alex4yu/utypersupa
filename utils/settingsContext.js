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


  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  if (!isLoaded) {
    return null; 
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
