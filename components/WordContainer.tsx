import CharElement from "./CharElement";
import styles from "@styles/index.module.css"
import { CharData, WordData } from "@/pages";

type WordContainerProps = {
    wordObj: WordData; // Adjust the type based on wordObj's structure
    letters: CharData[];
    cursorPos: number;
};


const WordContainer: React.FC<WordContainerProps> = ({wordObj, letters, cursorPos}) => {
    let wordLetters: Array<CharData> = [];
    for(let i = wordObj.start; i <= wordObj.end; i++){
        wordLetters.push(letters[i]);
    }
    //alert(JSON.stringify(wordLetters));
    return(
        <div className={styles.word}>
        {wordLetters.map(letter => (
            <CharElement
                key={letter.id}
                letterObj={letter} 
                cursorPosition={cursorPos}
            />
            ))}
        </div>
    )

}


export default WordContainer;