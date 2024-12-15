import React from "react";
import ResultsGraph from "./ResultsGraph"; 
import styles from "@styles/resultsDisplay.module.css"; 
import { ProgressSnapShot } from "@app/page";
type ResultsDisplayProps = {
    wpm: number;
    accuracy: number;
    totalTime: number;
    wpmProgress: ProgressSnapShot[]; 
    nextTest: () => void;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    wpm,
    accuracy,
    totalTime,
    wpmProgress,
    nextTest,
}) => {
    return (
        <div>
            <div className={styles.typeStats}>
                <div className={styles.typeStat}>WPM: {wpm}</div>
                <div className={styles.typeStat}>Acurracy: {accuracy}%</div>
                <div className={styles.typeStat}>Total Time: {totalTime}</div>
            </div>
            <ResultsGraph data={wpmProgress} />
            <div className={styles.generate} onClick={nextTest}>
                Next Test
            </div>
        </div>
    );
};

export default ResultsDisplay;
