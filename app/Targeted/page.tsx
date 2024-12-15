"use client"
import React, { useContext, useEffect, useState, useRef, use } from "react";
import styles from '@styles/target.module.css';
import WordContainer from "../../components/WordContainer";
import SettingsContext from "../../utils/settingsContext";
import ResultsGraph from "../../components/ResultsGraph";
import { WordData, CharData, ProgressSnapShot } from "../page";
import ResultsDisplay from "@/components/ResultsDisplay";


export default function Target() {
    const {loadTargetWords, loadTargetLetters} = require("../../utils/loadPrompts");
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
    const [choosingTargets, SetChoosingTargets] = useState(true);

    // action booleans
    const [newPrompt, setNewPrompt] = useState(true);

    // info and data
    const [startTime, setStartTime] = useState(0);
    const [wordCount, setWordCount] = useState<number>(20);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [totalTime, setTotaltime] = useState(0);

    // target page specific
    const [targets, setTargets] = useState(Array(5).fill(''));
    const [targetIndex, setTargetIndex] = useState(-1);

    
    useEffect(() => {
        console.log(targetIndex);
    }, [targetIndex]);
    

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
        if(choosingTargets && targetIndex != -1){
            const char = event.key;
            console.log(char);
            // backspace removes target
            if(char === "Backspace"){
                let targetsCopy = targets;
                targetsCopy[targetIndex] = '';
                setTargets(targetsCopy);
                setTargetIndex(-1);
            }
            else if(char.length === 1){
                if(/^[a-z]$/.test(char)){
                    let targetsCopy = targets;
                    targetsCopy[targetIndex] = char;
                    setTargets(targetsCopy);
                    setTargetIndex(-1);
                }
            }
        }
        if(!typing && !displayInfo && !choosingTargets && focused){
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
    }, [letters, characterCount, focused, typing, startTime, targetIndex]);

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
            wordList = await loadTargetWords(targets, wordCount);
        }
        else{
            wordList = await loadTargetLetters(targets, wordCount);
        }
        
        //alert(wordList);
        let wordStart = 0;
        let wordId = 0;
        setPromptText(wordList);
        for(let i = 0; i < wordList.length; i++){
            let charData = {id: i, char: wordList.charAt(i), status: "new"};
            charArr.push(charData);
            if(wordList.charAt(i) === " "){
            let wordData = {id: wordId, start: wordStart, end: i};
            wordStart = i+1;
            wordId++;
            wordsArr.push(wordData);
            
            }
            if(i === wordList.length - 1){
            let wordData = {id: wordId, start: wordStart, end: i};
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
        if(!choosingTargets){
            generate();
        }
        
        
    }, [newPrompt, choosingTargets]);

    const nextTest = () =>{
        setTyping(false);
        setNewPrompt(!newPrompt);
        setDisplayInfo(false);
    };

    //when the test finishes process test and display results
    const finishTest = () =>{
        const wpm = checkWPM();
        let timeTaken = Math.floor((Date.now() - startTime)/10)/100;
        //alert(firstTryCorrectCount);
        const accuracy = Math.floor(firstTryCorrectCount/characterCount*10000)/100.0
        document.removeEventListener('click', handleClick);
        setTotaltime(timeTaken);
        setWpm(wpm);
        setAccuracy(accuracy);
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
        console.log(typedText);
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
        //alert('clicked');
        setTypingMode(mode);
        setNewPrompt(!newPrompt);
    }
    const changeWordCount = (num: number) =>{
        //alert(' word count change clicked');
        setWordCount(num);
        setNewPrompt(!newPrompt);
    }

    const changeTargetIndex = (index: number) => {
        setTargetIndex(index);
    }

    if(choosingTargets){
        return(
            <div>{/*Choosing Target Characters*/}
                <div className = {styles.instructions}>To select characters to target, click on box then press key. Backspace to remove target.</div>
                <div className = {styles.targetButtonContainer}>
                    <div className = {targetIndex === 0? styles.selectedTarget:styles.targetButton} onClick={() => changeTargetIndex(0)}>{targets[0]}</div>
                    <div className = {targetIndex === 1? styles.selectedTarget:styles.targetButton} onClick={() => changeTargetIndex(1)}>{targets[1]}</div>
                    <div className = {targetIndex === 2? styles.selectedTarget:styles.targetButton} onClick={() => changeTargetIndex(2)}>{targets[2]}</div>
                    <div className = {targetIndex === 3? styles.selectedTarget:styles.targetButton} onClick={() => changeTargetIndex(3)}>{targets[3]}</div>
                    <div className = {targetIndex === 4? styles.selectedTarget:styles.targetButton} onClick={() => changeTargetIndex(4)}>{targets[4]}</div>
                </div>
                <div className = {styles.continue} onClick={() => SetChoosingTargets(false)}>Continue</div>
            </div>
        );
    }
    else if(displayInfo){
        return (
            <ResultsDisplay
                wpm={wpm}
                accuracy={accuracy}
                totalTime={totalTime}
                wpmProgress={wpmProgress}
                nextTest={nextTest}
            />
        );
    }

    else{
        //main typing display
        return(
            <div>
                <div className = {styles.typeSettingsButtons}>
                <div className = {styles.categoryContainer}>
                    <div className = {typingMode === 'words' ? styles.modeButtonSelected : styles.modeButton} onClick={() => setMode('words')}>Words</div>
                    <div className = {typingMode === 'letters' ? styles.modeButtonSelected : styles.modeButton}  onClick={() => setMode('letters')}>Letters</div>
                </div>
                <div className = {styles.separator}/>
                <div className = {styles.categoryContainer}>
                    <div className = {wordCount === 10 ? styles.countButtonSelected : styles.countButton}  onClick={() => changeWordCount(10)}>10</div>
                    <div className = {wordCount === 20 ? styles.countButtonSelected : styles.countButton} onClick={() => changeWordCount(20)}>20</div>
                    <div className = {wordCount === 40 ? styles.countButtonSelected : styles.countButton} onClick={() => changeWordCount(40)}>40</div>
                    <div className = {wordCount === 100 ? styles.countButtonSelected : styles.countButton} onClick={() => changeWordCount(100)}>100</div>
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