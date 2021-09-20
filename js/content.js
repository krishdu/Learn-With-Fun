/*  demo api */
// https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
// https://api.wordnik.com/v4/word.json/beautiful/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5

function getDefination(generatedWord){
    const DEFINATION_URL = 'https://api.wordnik.com/v4/word.json/'+generatedWord+'/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    fetch(DEFINATION_URL)
        .then(response => response.json())
        .then(function(json) {
             let WordDefination = json[0].text;
             showModal(generatedWord, WordDefination);
        })
        .catch(function(err) {
            console.log('Defination Fetch problem: ' + err.message);
        });
}

function generateARandomWord(){
    const RANDOM_WORD_URL = 'https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    
    fetch(RANDOM_WORD_URL)
        .then(response => response.json())
        .then(function(json) {
             let randomWord = json[0].word;
             return randomWord;
        })
        .then((word) => {
            getDefination(word);
        })
        .catch(function(err) {
            console.log('Word Fetch problem: ' + err.message);
        });
}

/* listen message from background script */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    /* We received a message, let's do as instructed */
    if (request.action === 'displayWord') {
        sendResponse({acknowledgement: "received background message"});
        generateARandomWord();
    }
});


/* show the dialog once api back with it's response*/
const showModal = (randomWord, WordDefination) => {
    const modal = document.createElement("dialog");
    modal.setAttribute(
        "style",`
        height:300px;
        width:350px;
        border: none;
        top:150px;
        border-radius:20px;
        background-color:white;
        position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
        overflow: auto;
        `
    );
    modal.innerHTML = `<div style="text-align: center"><h2>Learn With Fun 🧠</h2></div> 
        <div style="background-color: aqua; padding: 0.25rem; text-align: center">
            <u><h4 id="popup-content"></h4></u>
            <h5 id="popup-content-defination"></h5>
        </div>
        <div style="padding: 0.25rem; text-align: center">
            <button id="btnKnowMore">Know More</button>
        </div>
        <div style="position:absolute; top:0px; left:5px;">
            <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;" id="btnClose">x</button>
        </div>`;
    
    document.body.appendChild(modal);
    const dialog = document.querySelector("dialog");
    const wordBox = document.getElementById("popup-content");
    const wordDefinationBox = document.getElementById("popup-content-defination");

    wordBox.innerHTML = `${randomWord}`;
    wordDefinationBox.innerHTML = `${WordDefination}`
         
    /* if modal is not open previously, show the modal*/
    if(!openDialogCheck(dialog)){
      dialog.showModal();            
    }

    dialog.querySelector("#btnKnowMore").addEventListener("click", () => {
        knowMoreAboutWord(randomWord);
    });

    dialog.querySelector("#btnClose").addEventListener("click", () => {
        dialog.close();
    });
}

/* redirect the user to dictionary page*/
function knowMoreAboutWord(word){
    chrome.runtime.sendMessage({ action:'openKnowMoreTab', searchWord : word}, (response) =>{
        console.log(response.acknowledgement);
    });
}

/* check if dialog is open */
function openDialogCheck(dialog) {
    if(dialog.open)
        return true; 
    return false;
}