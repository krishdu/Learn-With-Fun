/*  demo api */
// https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5

function generateARandomWord(){
    // let words = ['able','about','account','acid','across','act','addition','adjustment','advertisement','agreement','after','again','against','air','all','almost','among','amount','amusement','and','angle','angry','animal']; 
    // let pickElmentIndex = Math.floor(Math.random() * words.length);
    // return words[pickElmentIndex];
    const URL = 'https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    fetch(URL)
        .then(response => response.json())
        .then(function(json) {
             let randomWord = json[0].word;
             showModal(randomWord);
        }).catch(function(err) {
            console.log('Fetch problem: ' + err.message);
        });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    /* We received a message, let's do as instructed */
   // console.log("content");
    if (request.action === 'displayWord') {
        sendResponse({acknowledgement: "received background message"});
         // alert(generateARandomWord());
        generateARandomWord();
    }
});

const showModal = (randomWord) => {
    const modal = document.createElement("dialog");
    modal.setAttribute(
        "style",`
        height:300px;
        border: none;
        top:150px;
        border-radius:20px;
        background-color:white;
        position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
        overflow:hidden;
        `
    );
    modal.innerHTML = `<div><h2>Learn With Fun 🧠</h2></div> 
        <div style="background-color: aqua; padding: 2rem; text-align: center"><h4 id="popup-content"></h4></div>
        <div style="position:absolute; top:0px; left:5px;">
            <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;">x</button>
        </div>`;

    document.body.appendChild(modal);
    const dialog = document.querySelector("dialog");
    const wordBox = document.getElementById("popup-content");
    wordBox.innerHTML = `${randomWord}`;

    /* if modal is not open previously, show the modal*/
    if(!openDialogCheck(dialog)){
      dialog.showModal();            
    }

    dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
    });
}

function openDialogCheck(dialog) {
    if(dialog.open)
        return true; 
    return false;
}