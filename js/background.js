let intervalID = '';

/* get timer setting value as true or false from local storage with promise */
const timerOnOffSettings = {
  getTimerOnOff:() => {
    return new Promise(function(resolve, reject){
     chrome.storage.sync.get(['isTimerOn'], function(result) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result.isTimerOn);
     });
    });   
  } 
}

/*------------- get custom interval ------------------*/
const timerIntervalSettings = {
  getTimerInterval:() => {
    return new Promise(function(resolve, reject){
     chrome.storage.sync.get(['customInterval'], function(result) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result.customInterval);
     });
    });   
  } 
}

const timeLeftTimer = {
  /* set timer value in local storage */
  setTimeLeftTimer: (time) =>{
    return new Promise((resolve, reject) => {
    chrome.storage.sync.set({timeLeft : time}, function() {
        if(chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(time);
      });
    });
  },

  /* get timer value from local storage with promise */
  getTimeLeftTimer:() => {
    return new Promise(function(resolve, reject){
     chrome.storage.sync.get(['timeLeft'], function(result) {
        if(chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result.timeLeft);
     });
    });   
  } 
}

/* set a default value in local storage */
async function setDefaultTimerValue(){
  try{
      let interValTime = await timerIntervalSettings.getTimerInterval();
      if (interValTime)
          var updatedTime = await timeLeftTimer.setTimeLeftTimer(interValTime);
      else
          var updatedTime = await timeLeftTimer.setTimeLeftTimer(25); //default timer in 25 sec

      console.log(`Default timer value set to -> ${updatedTime} second`);
      startCountdown();
  }catch(err){
    console.error(err);
  }
}

 /* if there is no timer set to local storage, set default timer */
async function onBrowserLoad(){ 
  try{
    var timeLeft = await timeLeftTimer.getTimeLeftTimer();
    if(!timeLeft || timeLeft <= 0)
      setDefaultTimerValue();
  }catch(err){
    console.error(err);
  }
}

/* at beginning it will check local storage, if it undefined or negative set a default*/
onBrowserLoad();

/* the function keep updating the value in storage whenever interval come*/
async function updateCoutdown() {
    try{
      var timeLeft = await timeLeftTimer.getTimeLeftTimer();
      if(timeLeft > 0){
        var updatedTime = await timeLeftTimer.setTimeLeftTimer(timeLeft - 3);
        console.log(`updated time ${updatedTime}`);
      }else{
          displayAlert();
      }
    }catch(err){
       console.error(err)
    }
}

/* countdown timer will be running as long as the word is not pop-up */
function countdown(){
  intervalID = setInterval(()=>{
    updateCoutdown();
  }, 3*1000);
}

async function startCountdown(){
  try{
    var getOnoffSettings = await timerOnOffSettings.getTimerOnOff();
    if(getOnoffSettings && !intervalID){
      countdown();
    }else{
      console.log(`already a interval${intervalID} running or setting is off`);
    }
  }catch(e){
    console.error(e);
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(changeInfo.status === 'complete' && /^http/.test(tab.url)){
    startCountdown();
  }
});

async function displayAlert(){
  try{
    var getOnoffSettings = await timerOnOffSettings.getTimerOnOff();
    if(getOnoffSettings){
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
    }
  }catch(e){
    console.error(e);
  }
  
  clearInterval(intervalID);
  intervalID = '';
  
  setDefaultTimerValue();
  //startCountdown();
}

/* listen the message to open a new tab and display word details */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'openKnowMoreTab'){
    console.log(request.searchWord)
    chrome.tabs.create({
        url: 'https://www.merriam-webster.com/dictionary/'+request.searchWord
      });
  }
});

