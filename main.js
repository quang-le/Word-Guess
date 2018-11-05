import {apiKey} from './api.js';
// import guessLetter from './gameplay.js';

firebase.initializeApp(apiKey);
const database=firebase.database();

var allRefs= database.ref('words/');
var library=[];

allRefs.on("value",
    function(snapshot){
        let words=snapshot.val(); 
        console.log(words);  
        let wordsArray=Object.keys(words).map(i=>words[i]);
        console.log(wordsArray);
        for (let i=0;i<wordsArray.length;i++){
            library.push(wordsArray[i])
        }
        guessLetter();
    },
    function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    }
)

function guessLetter(){
    console.log(library);
    //Variables
    //let library = ["papa","mama","hallo","roboter","kabel","technik"]
    var solution= library[getRandomInt(library.length)].split("");
    solution=solutionToUpperCase(solution);
    var answer=[];
    var guesses=[];
    var wrongGuesses=[];

    let printAnswer=document.createElement("P");        //affiche les traits "vides"
    printAnswer.style.color="green";
    
    let printGuesses=document.createElement("P");       //affiche les lettres déjà essayées 
    let guessesText=document.createTextNode(guesses.reverse().join("-")); 
    let printwrongGuesses=document.createElement("P");//affiche les lettres déjà essayées 
    printwrongGuesses.style.color="red";
    let wrongGuessesText=document.createTextNode(wrongGuesses.reverse().join("-")); 
    
    //Functions

    function solutionToUpperCase(array){
        let upperCaseSolution=[];
        for(let i=0;i<array.length;i++){
            upperCaseSolution.push(array[i].toUpperCase());
        }
        return upperCaseSolution
    }
    //Random number generator           
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function generateAnswer(){
        for(let j=0;j<solution.length;j++){
            answer.push("_");
            console.log("answer= "+answer);
            console.log(solution.length);
        }
        let answerText=document.createTextNode(" "+answer.join("."));
        generateHTML(printAnswer,answerText,"solution");
    }

    function generateHTML(tag,content,container){
        tag.appendChild(content);
        document.getElementById(container).appendChild(tag);
    }

    function updateHTML(where,what){where.innerHTML=what.join("-");}

    function compareLetters(){
             //old solution: guess=prompt("Entrez une lettre");

        let guess=document.getElementById("lettre").value.toUpperCase();
        if (guess.length>1){
            return alert("Bitte nur eine Buchstab eindrucken")
        }
        if (wrongGuesses.includes(guess)==true || guesses.includes(guess)==true){
            console.log("double essai");
        }
        else{
            guesses.push(guess);
            for (let i=0; i<solution.length; i++){  //compare l'input du joueur à la solution)
                if (guess==solution[i]){
                    let letterIndex=i+1;
                    //alert("Félicitations, la lettre "+solution[i]+" se trouve en position"+ letterIndex);
                    answer.splice(i,1,guess);       //remplit la solution avec les lettres devinées
                    console.log(answer); 
                }
                else if (solution.includes(guess)==false && wrongGuesses.includes(guess)==false){
                    wrongGuesses.push(guess);
                    console.log(wrongGuesses);
                }
            
            }
        }     
    }

    function playGame(){
        document.getElementById("btn").addEventListener("click", function(){ 
            compareLetters();

            console.log(guesses); 
            updateHTML(printAnswer,answer);
            console.log("answer is "+answer);
            updateHTML(printGuesses,guesses); 
            console.log("guesses is "+guesses)
            updateHTML(printwrongGuesses,wrongGuesses); 
            console.log("wrongGuesses is "+wrongGuesses);

            checkComplete();   
        });
    }

    function checkComplete(){
        if(solution.join()==answer.join()){
            document.getElementById("lettre").value="";
            return alert("Super! Der Passwort war "+answer.join(""));
            
        }
        else{  
            document.getElementById("lettre").value="";
            //alert("Essayez encore");
        }
    }
    //Run
    generateAnswer();
    generateHTML(printwrongGuesses,wrongGuessesText,"wrongGuesses");
    generateHTML(printGuesses,guessesText,"allGuesses");
    playGame();  
}
//document.getElementById("start").addEventListener("click",guessLetter);


