
function generateARandomWord(){
    let words = ['able','about','account','acid','across','act','addition','adjustment','advertisement','agreement','after','again','against','air','all','almost','among','amount','amusement','and','angle','angry','animal']; 
    let pickElmentIndex = Math.floor(Math.random() * words.length);
    return words[pickElmentIndex];
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    /* We received a message, let's do as instructed */
    console.log("content");
    if (request.action === 'displayWord') {
        alert(generateARandomWord());
        sendResponse({acknowledgement: "received background message"});
    }
});
