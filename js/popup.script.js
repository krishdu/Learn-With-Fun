
const timerOnOffSettings = {
  /* set timer setting as true for on and false for off in local storage */
  setTimerOnOff: (value) =>{
    return new Promise((resolve, reject) => {
    chrome.storage.sync.set({isTimerOn : value}, function() {
        if(chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        console.log('Settings Save!');
        resolve(value);
      });
    });
  },

  /* get timer setting value as true or false from local storage with promise */
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

const btnOnOff = document.querySelector("#btnOnOff");
/*check previous settings*/
setPreviousOnOffSetting();
  
btnOnOff.addEventListener("click", () => {

    if(btnOnOff.checked){
        console.log("Checked Clicked!!");
     }else{
        console.log("Uncheck Clicked!!");
    }
    changeOnOffSettings();
});

//upon loading the pop-up show the updated setting for on-off button
async function setPreviousOnOffSetting(){
    try{
        let getSetting = await timerOnOffSettings.getTimerOnOff();
        document.querySelector("#btnOnOff").checked = getSetting;
    }catch(err){
        console.error(err);
    } 
}

async function changeOnOffSettings(){
  try{
    let getSetting = await timerOnOffSettings.getTimerOnOff();
    getSetting ? await timerOnOffSettings.setTimerOnOff(false) : await timerOnOffSettings.setTimerOnOff(true);
  }catch(err){
    console.error(err);
  }
}



