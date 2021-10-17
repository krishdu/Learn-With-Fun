
let intervalRange = document.querySelector("#intervalRange");
let intervalValue = document.querySelector("#intervalValue");
intervalValue.innerHTML = intervalRange.value;

const timerIntervalSettings = {
  /* set timer interval setting in local storage */
  setTimerInterval: (value) =>{
    return new Promise((resolve, reject) => {
    chrome.storage.sync.set({customInterval : value}, function() {
        if(chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        console.log('Settings Save!');
        resolve(value);
      });
    });
  },

  /* get timer interval from local storage with promise */
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


setPreviousIntervalSetting();

intervalRange.oninput = async function() {
  intervalValue.innerHTML = this.value;
  try{
        var setTimerValue = await timerIntervalSettings.setTimerInterval(this.value);
        console.log(`Interval set to ${setTimerValue}`);
    }catch(e){
       console.log('update setting failed!');
  }
}

//upon loading the pop-up show the updated setting for interval range
async function setPreviousIntervalSetting(){
    try{
        let getInterval = await timerIntervalSettings.getTimerInterval();
        if(getInterval){
            intervalRange.value = getInterval;
            intervalValue.innerHTML = getInterval;
        }
    }catch(err){
        console.error(err);
    } 
}