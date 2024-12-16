"use client"
import React, { useContext, useEffect, useState, useRef, use } from "react";
import styles from "@styles/index.module.css";
import WordContainer from "@components/WordContainer";
import ResultsDisplay from "@/components/ResultsDisplay";
import SettingsContext from "@utils/settingsContext";
import { getUserStats, updateUserStats } from "./Accounts/actions";



export type WordData = {id: number, start: number, end: number}
export type CharData = {id: number, char: string, status: string};
export type ProgressSnapShot = {time: number, wpm: number};

export default function Index() {
  const {loadLetters, loadWords, loadQuote} = require("../utils/loadPrompts");
  //settings
  const { settings } = useContext(SettingsContext);
  useEffect(() => {
    // Apply the CSS variable for body background color
    document.body.style.setProperty('--bg-color', settings.bgColor);
    document.body.style.setProperty('--title-color', settings.titleColor);
    document.body.style.setProperty('--pre-text-color', settings.preTextColor);
    document.body.style.setProperty('--bg-light-color', settings.bgLightColor);
    
  }, [settings.theme]);


  // words and characters
  const [promptText, setPromptText] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [letters, setLetters] = useState<Array<CharData>>([]);
  const [wordContainers, setWordContainers] = useState<Array<WordData>>([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [firstTryArr, setFirstTryArr] = useState<Array<boolean>>([]);
  
  // trackers
  const [seconds, setSeconds] = useState(0);
  const [wpmProgress, setWpmProgress] = useState<Array<ProgressSnapShot>>([]);

  // modes and status
  const [focused, setFocused] = useState(true);
  const [typingMode, setTypingMode] = useState<"words" | "letters" | "quotes">('words');
  const [typing, setTyping] = useState(false);
  const [displayInfo, setDisplayInfo] = useState(false);

  // action booleans
  const [newPrompt, setNewPrompt] = useState(true);

  // info and data
  const [startTime, setStartTime] = useState(0);
  const [wordCount, setWordCount] = useState<number>(20);
  const [quoteLength, setQuoteLength] = useState<string>('medium');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [totalTime, setTotaltime] = useState(0);
  
  /*
  useEffect(() => {
    alert('wordContainers before map:'+ JSON.stringify(wordContainers));
  }, [wordContainers]);
  */

  //for checking wpm live
  const typedTextRef = useRef(typedText);
  useEffect(() => {
    typedTextRef.current = typedText;
  }, [typedText]);

  const secondsRef = useRef(seconds);
  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds])

  const wpmProgressRef = useRef(wpmProgress);
  useEffect(() => {
    wpmProgressRef.current = wpmProgress;
  }, [wpmProgress])
  


  //for live accuracy calculation
  const firstTryArrRef = useRef(firstTryArr);
  useEffect(() =>{
    firstTryArrRef.current = firstTryArr;
  }, [firstTryArr])

  const firstTryCorrectCountRef = useRef(firstTryCorrectCount);
  useEffect(() =>{
    firstTryCorrectCountRef.current = firstTryCorrectCount;
  }, [firstTryCorrectCount])

  //setInterval creates stale state errors 
  useEffect(() => {
    let timer: any;
    if (typing) {
      timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
        if(secondsRef.current >= 0){
          const livewpm = checkWPM();
          setWpm(livewpm);
          if(secondsRef.current > 0){
            
            const newProgress = [...wpmProgressRef.current, { time: secondsRef.current, wpm: livewpm }];
            //console.log("newProgress"+ newProgress);
            setWpmProgress(newProgress);
          }
          
        }
        if(settings.liveAccuracy === 'ON' && secondsRef.current >=0){
          const accuracy = Math.floor(firstTryCorrectCountRef.current/firstTryArrRef.current.length*100);
          setAccuracy(accuracy);
        }
      }, 1000);
    }

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [typing]);


  // handles key inputs, if focused updates information to match user key types. 
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if(!typing && !displayInfo && focused){
        setStartTime(Date.now());
        setTyping(true);
      }
      if(focused){
        const char = event.key;
        const index = characterCount;
        if (char === "Backspace"){
          // if user hits Backspace key, removes last character typed
          // if no character typed, no backspace happens
          if(characterCount != 0 && settings.noBackspace === "OFF"){
            const updatedLetters = [...letters];
            updatedLetters[index - 1].status = "new";
            if(settings.trueTyping){
              updatedLetters[index - 1].char = promptText.charAt(index - 1)
            }
            setLetters(updatedLetters);
            setCharacterCount(prevCount => prevCount - 1);
            setTypedText(typedText.substring(0,typedText.length - 1));
          }
          
        }
        else if (char === "Enter"){
          // if user hits Enter key, ends test
          setTyping(false);
          setDisplayInfo(!displayInfo);
          if(!displayInfo){
            finishTest();
          }
          else{
            //generate and display next prompt by changing dependency array
            setNewPrompt(!newPrompt);
          }
          
        }
        else if (index < letters.length && char.length === 1 && !displayInfo) {
          // if user has not overtyped prompt, and entered character is a single character, updates typed prompt. 
          const currentLetter = letters[index].char;
          const status = char === currentLetter ? "yes" : "no";
          if(firstTryArr.length < characterCount){
            let updatedFirstTryCorrectArr = firstTryArr;
            if(status === "yes"){
              updatedFirstTryCorrectArr.push(true);
              setFirstTryArr(updatedFirstTryCorrectArr);
              setFirstTryCorrectCount(firstTryCorrectCount + 1);
            }
            else{
              updatedFirstTryCorrectArr.push(true);
              setFirstTryArr(updatedFirstTryCorrectArr);
              if(settings.noErrors === 'ON'){
                setTyping(false);
                setDisplayInfo(true);
                finishTest();
                return;
              }
            }
          }
          const updatedLetters = [...letters];
          updatedLetters[index].status = status;
          if(settings.trueTyping === 'ON'){
            updatedLetters[index].char = char;
          }
          setLetters(updatedLetters);
          setCharacterCount(prevCount => prevCount + 1);
          //console.log(characterCount+1);
          setTypedText(typedText + char);
          if(characterCount + 1 === promptText.length || (settings.noErrors === "ON" && status === "no")){
            setTyping(false);
            setDisplayInfo(true);
            finishTest();
          }
        }
      }
      else{
        console.log("not focused");
      }
      
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [letters, characterCount, focused, typing, startTime]);

  //creates and displays prompts on first render and future new prompt requests
  useEffect(() => {
    const generate = async () => {
      //alert(typingMode);
      setWordContainers([])
      setLetters([]);
      setCharacterCount(0);
      setTypedText("");
      setStartTime(0);
      setSeconds(0);
      setFirstTryCorrectCount(0);
      setFirstTryArr([]);
      setWpmProgress([]);
      let wordList = "";
      let charArr = [];
      let wordsArr = [];
      if(typingMode === 'words'){
        wordList = await loadWords(wordCount);
      }
      else if (typingMode === 'letters'){
        wordList = await loadLetters(wordCount);
      }
      else{
        wordList = await loadQuote(quoteLength)
      }
      
      //alert(wordList);
      let wordStart: number = 0;
      let wordId: number = 0;
      setPromptText(wordList);
      for(let i: number = 0; i < wordList.length; i++){
        let charData: CharData = {id: i, char: wordList.charAt(i), status: "new"};
        charArr.push(charData);
        if(wordList.charAt(i) === " "){
          let wordData = {id: wordId, start: wordStart, end: i};
          wordStart = i+1;
          wordId++;
          wordsArr.push(wordData);
        
        }
        if(i === wordList.length - 1){
          let wordData: WordData = {id: wordId, start: wordStart, end: i};
          wordsArr.push(wordData);
        }
        
      }  
      setWordContainers(wordsArr);
      setLetters(charArr);
      
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      }
    }
    generate();
    
  }, [newPrompt]);

  const nextTest = () =>{
    setTyping(false);
    setNewPrompt(!newPrompt);
    setDisplayInfo(false);
  };

  //when the test finishes process test and display results
  const finishTest = async() =>{
    const wpm = checkWPM();
    let timeTaken = Math.floor((Date.now() - startTime)/10)/100;
    //alert(firstTryCorrectCount);
    const accuracy = Math.floor(firstTryCorrectCount/characterCount*10000)/100.0
    document.removeEventListener('click', handleClick);
    setTotaltime(timeTaken);
    setWpm(wpm);
    setAccuracy(accuracy);
    
    try{
      await updateUserStats({
        wpm: wpm, 
        words: typedText.split(" ").length, 
        charsCorrect: firstTryCorrectCount,
        totalChars: typedText.length
      })
    } catch(error){
      console.error(error);
    }

  }

  
  const handleClick = (event: MouseEvent) => {
    if(document.getElementById("prompt") === null){
      return ;
    }
    else if (event.target instanceof Node && document.getElementById("prompt")?.contains(event.target)) {
      setFocused(true);
    } else {
      setFocused(false);

    }
  };

  const checkWPM = () => {
    const timeTaken = (Date.now() - startTime)/1000;
    const promptArr = promptText.split(" ");
    const typedArr = typedTextRef.current.split(" ");
    //console.log(typedText);
    let wordsCorrect = 0;
    for (let i = 0; i < promptArr.length; i++)
    {
      if (typedArr != null && promptArr[i] === typedArr[i])
      { wordsCorrect++;  }
    }
    let wpm = Math.floor(wordsCorrect/timeTaken*60.0);
    return wpm;
  }

  const setMode = (mode: "words" | "letters" | "quotes") =>{
    setFocused(false);
    setTyping(false);
    setTypingMode(mode);
    setNewPrompt(!newPrompt);
  }
  const changeWordCount = (num: number) =>{
    setWordCount(num);
    setNewPrompt(!newPrompt);
  }
  const changeQuoteLength = (length: string) =>{
    setQuoteLength(length);
    setNewPrompt(!newPrompt);
  }

  //display results
  if(displayInfo){
    return(
      <ResultsDisplay
        wpm={wpm}
        accuracy={accuracy}
        totalTime={totalTime}
        wpmProgress={wpmProgress}
        nextTest={nextTest}
      />
    )
  }
  else{
    return(
      <div>{/*Main typing display*/}
        <div className = {styles.typeSettingsButtons}>
          <div className = {styles.categoryContainer}>
            <div className = {typingMode === 'words' ? styles.modeButtonSelected : styles.modeButton} onClick={() => setMode('words')}>Words</div>
            <div className = {typingMode === 'letters' ? styles.modeButtonSelected : styles.modeButton}  onClick={() => setMode('letters')}>Letters</div>
            <div className = {typingMode === 'quotes' ? styles.modeButtonSelected : styles.modeButton}  onClick={() => setMode('quotes')}>Quotes</div>
          </div>
          <div className = {styles.separator}/>
          <div>
            {typingMode === 'quotes' ? (
              <div className = {styles.categoryContainer}>
                <div className = {quoteLength === 'all' ? styles.lengthButtonSelected : styles.lengthButton}  onClick={() => changeQuoteLength('all')}>all</div>
                <div className = {quoteLength === 'short' ? styles.lengthButtonSelected : styles.lengthButton}  onClick={() => changeQuoteLength('short')}>short</div>
                <div className = {quoteLength === 'medium' ? styles.lengthButtonSelected : styles.lengthButton}  onClick={() => changeQuoteLength('medium')}>medium</div>
                <div className = {quoteLength === 'long' ? styles.lengthButtonSelected : styles.lengthButton}  onClick={() => changeQuoteLength('long')}>long</div>
                <div className = {quoteLength === 'Xlong' ? styles.lengthButtonSelected : styles.lengthButton}  onClick={() => changeQuoteLength('Xlong')}>Xlong</div>
              </div>
              ) : (
              <div className = {styles.categoryContainer}>
                <div className = {wordCount === 10 ? styles.countButtonSelected : styles.countButton}  onClick={() => changeWordCount(10)}>10</div>
                <div className = {wordCount === 20 ? styles.countButtonSelected : styles.countButton} onClick={() => changeWordCount(20)}>20</div>
                <div className = {wordCount === 40 ? styles.countButtonSelected : styles.countButton} onClick={() => changeWordCount(40)}>40</div>
                <div className = {wordCount === 100 ? styles.countButtonSelected : styles.countButton} onClick={() => changeWordCount(100)}>100</div>
              </div>
              )
            }
          </div>
        </div>
        <div className = {styles.trackerParent} >
          {typing && <div className = {styles.tracker} id = "timer">{seconds}</div>}
          {settings.liveWPM === 'ON' && typing && seconds >= 1 && <div className = {styles.tracker}>{wpm}</div>}
          {settings.liveAccuracy === 'ON' && typing && seconds >= 1 && <div className = {styles.tracker}>{accuracy}%</div>}
        </div>
        <div className = {styles.prompt} id = "prompt">
          {wordContainers.map(word => (
            <WordContainer
                key={word.id}
                wordObj={word} 
                letters = {letters}
                cursorPos = {characterCount}
            />
            ))
          }
        </div>
        <div className = {styles.generate} onClick={() => nextTest()}> Skip </div>
      </div>
    )
  }
}