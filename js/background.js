const timeLeftTimer = {
  /* set timer value in local storage */
  setTimeLeftTimer: (time) =>{
    return new Promise((resolve, reject) => {
    chrome.storage.sync.set({timeLeft : time}, function() {
        resolve(time);
      });
    });
  },

  /* get timer value from local storage with promise*/
  getTimeLeftTimer:() => {
    return new Promise(function(resolve, reject){
     chrome.storage.sync.get(['timeLeft'], function(result) {
        resolve(result.timeLeft);
     });
    });   
  } 
}

async function setDefaultTimerValue(){
  try{
      var updatedTime = await timeLeftTimer.setTimeLeftTimer(10); //default timer in 10 sec
      console.log(`Default timer value set to -> ${updatedTime} second`);
  }catch(err){
    console.error(err)
  }
}

 /* if there is no timer set to local storage, set default timer */
async function onBrowserLoad(){ 
  try{
    var timeLeft = await timeLeftTimer.getTimeLeftTimer();
    if(!timeLeft || timeLeft <= 0)
      setDefaultTimerValue();
  }catch(err){
    console.error(err)
  }
}

/* at beginning it will check local storage, if it undefined or negative set a default*/
onBrowserLoad();

/* the function keep updating the value in storage whenever interval come*/
async function updateCoutdown(intervalID) {
    try{
      var timeLeft = await timeLeftTimer.getTimeLeftTimer();
      if(timeLeft > 0){
        var updatedTime = await timeLeftTimer.setTimeLeftTimer(timeLeft - 3);
        console.log(`updated time ${updatedTime}`);
      }else{
        displayAlert(intervalID);
      }
    }catch(err){
       console.error(err)
    }
}

/* countdown timer will be running as long as the word is not pop-up */
function countdown(){
  var intervalID = setInterval(()=>{
    updateCoutdown(intervalID);
  }, 3000);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(changeInfo.status === 'complete' && /^http/.test(tab.url)){
    countdown();
   // injectContentScript(tabId);
  }
});

async function displayAlert(intervalID){
  clearInterval(intervalID);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
   // injectContentScript(tabs[0].id);
     if(tabs.length != 0){
        chrome.tabs.sendMessage(tabs[0].id, { action: 'displayWord' }, 
            function(response) {
              response?console.log(response.acknowledgement):console.log("No response from content script");
            });
      }else{
        console.log("No active tab found");
      }
  });

  setDefaultTimerValue();
  countdown();
}

/* Inject content script in the active chrome tab */
// function injectContentScript(tabId){
//     chrome.scripting.executeScript({
//       target: {tabId: tabId},
//       files: ['js/content.js']
//     })
//     .then(() => {
//         console.log("Injected Contenct Script");
//     })
//     .catch(err => console.error(err));
// }

//---------- on extension icon clcik--------------//

// chrome.action.onClicked.addListener(function (tab) {
//   /* Send a message to the active tab's content script */
//   chrome.tabs.sendMessage(tab.id, { action: 'saySomething' },
//    function(response) {
//     console.log(response.farewell);
//   });
// });


