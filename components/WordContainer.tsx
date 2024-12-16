import CharElement from "./CharElement";
import styles from "@styles/index.module.css"
import { CharData, WordData } from "@app/page";

type WordContainerProps = {
    wordObj: WordData; 
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