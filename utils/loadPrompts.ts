
const loadLetters = (size: bigint) =>{
    //console.log("loading letters");
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let wordList = "";
    for(let i = 1; i <= size; i++ ){
        let wordLength = Math.floor(Math.random()*5)+2;
        for (let i = 1; i <= wordLength; i++){
            let characterChosen = alphabet.charAt(Math.floor(Math.random()*26));
            wordList = wordList + characterChosen
        }
        wordList = wordList + " ";
    }
    wordList = wordList.substring(0,wordList.length-1);  
    return wordList;
};

const readFile = async (fileName: string) =>{
    try {
        const response = await fetch(fileName); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text(); // Fetches the content as text

        return text
    } catch (error) {
        console.error('Error loading text file:' + fileName, error);
    }
    
}
const loadWords = async (size: bigint) =>{
    //console.log("loading words");
    let en100Txt = await readFile('/textFiles/en100.txt');
    let en1kTxt = await readFile('/textFiles/en1k.txt');
    let en10kTxt = await readFile('/textFiles/en10k.txt');
    if(!en10kTxt || !en1kTxt || !en100Txt){
        console.log("error getting text from files");
        return undefined;
    }
    let wordList = "";
    let en100Arr = en100Txt.split(/\r?\n/);
    //alert(t100Array);
    let en1kArr = en1kTxt.split(/\r?\n/);
    let en10kArr = en10kTxt.split(/\r?\n/);

    for(let i = 1; i <= size; i++ )
    {
        let fileRandom = Math.floor(Math.random()*100);
        let word;
        if (fileRandom > 60){
            //alert("t100");
            word = en100Arr[Math.floor(Math.random()*en100Arr.length)];
        }
        else if (fileRandom > 10){
            //alert("super common");
            word = en1kArr[Math.floor(Math.random()*en1kArr.length)];
        }
        else{
            //alert("common");
            word = en10kArr[Math.floor(Math.random()*en10kArr.length)];
        }
        // no capital letter for now
        if(/[A-Z]/.test(word)){
            i--;
        }
        else{
            wordList = wordList + word + " ";
        }
        
    }
    wordList = wordList.substring(0,wordList.length-1);  
    //alert(wordList);
    return wordList;
};

const loadQuote = async (size: string) =>{
    
    try {
        const response = await fetch('/textFiles/quotes.json'); 
        const data = await response.json();
        
        // Randomly select a quote
        const quotes: Array<{text: string, source: string, length: bigint, id: bigint}> = data.quotes;
        let filteredQuotes = [];
        if (size === 'short') {
            filteredQuotes = quotes.filter(quote => quote.length < 70);
        } 
        else if (size === 'medium') {
            filteredQuotes = quotes.filter(quote => quote.length >= 70 && quote.length < 150);
        } 
        else if (size === 'long') {
            filteredQuotes = quotes.filter(quote => quote.length >= 150 && quote.length < 300);
        }
        else if (size === 'Xlong') {
            filteredQuotes = quotes.filter(quote => quote.length >= 300);
        }
        else{
            filteredQuotes = quotes
        }
        let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        let randomQuote = filteredQuotes[randomIndex];
        
        console.log(randomQuote.text);
        return randomQuote.text;
    } catch (error) {
        console.error('Error loading quotes:', error);
    }
    
}

const loadTargetWords = async (targets: Array<string>, size: bigint) => {
    let wordList = "";
    let targetArray: Array<string> = [];
    let targetWordLists = [];
    for(let i  = 0; i < targets.length; i++){
        let char = targets[i];
        if(char != ""){
            targetArray.push(char);
            let fileName = "/textFiles/letterFiles/" + char + ".txt";
            let fileResult = await readFile(fileName);
            if(fileResult){
                let wordArray = fileResult.split(/\r?\n/)
                //console.log(wordArray);
                targetWordLists.push(wordArray);
            }
            else{
                console.log("error gettting letterFile of: " + char);
            }
        }
    }
    //console.log("target Array: "+targetArray)
    //console.log("target wordList: "+targetWordLists)

    let splits = 100/targetArray.length;
    for(let i = 1; i <= size; i++ )
    {
        let list_random = Math.floor(Math.random()*100);
        let word = "";
        if (list_random < splits){
            word = targetWordLists[0][Math.floor(Math.random()*targetWordLists[0].length)];
        }
        else if (list_random < splits * 2){
            word = targetWordLists[1][Math.floor(Math.random()*targetWordLists[1].length)];
        }
        else if (list_random < splits * 3){
            word = targetWordLists[2][Math.floor(Math.random()*targetWordLists[2].length)];
        }
        else if (list_random < splits * 4){
            word = targetWordLists[3][Math.floor(Math.random()*targetWordLists[3].length)];
        }
        else{
            word = targetWordLists[4][Math.floor(Math.random()*targetWordLists[4].length)];
        }
        
        wordList = wordList + word.trim() + " ";
    }
    wordList = wordList.substring(0,wordList.length-1);  
    return wordList;
}

const loadTargetLetters = async (targets: Array<string>, size: bigint) => {
    
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    for(let i  = 0; i < targets.length; i++){
        let char = targets[i];
        if(char != ""){
            alphabet = alphabet + char.repeat(5);
        }
    }
    //console.log(alphabet)
    let wordList = "";
    for(let i = 1; i <= size; i++ ){
        let wordLength = Math.floor(Math.random()*5)+2;
        for (let i = 1; i <= wordLength; i++){
            let characterChosen = alphabet.charAt(Math.floor(Math.random()*alphabet.length));
            wordList = wordList + characterChosen
        }
        wordList = wordList + " ";
    }
    wordList = wordList.substring(0,wordList.length-1);  
    return wordList;
}

module.exports = {
    loadLetters,
    loadWords,
    loadQuote, 
    loadTargetWords,
    loadTargetLetters
}