## Learn With Fun
> It's a chrome extension which will pop up a new english word daily or as per user setup. 
> Built using Vanilla JavaScript.

```
Features need to develop (Requirements)
```

 + Popup random new english word (use google api later stage)
 + Popup will display with a funny gif image
 + If user click 'know more' it will redirect to it's explanation (include google api later stage) 
 + set word preferance (as a option to the user) as easy, medium, hard
 + user can set time interval at with they want to show pop-ups
 + if browser is inactive put the word in sync storage so that user can can show that when he active the browser


```
Phase 1 : alert a word in window after open chrome
```
+ Create a word array 
+ alert after loading chrome urls

```
Phase 2 : keep a timer count in storage
```
+ declare a function expression with get and send functionality
    + using sync storage so that every chrome browser (login with same G-mail id) from different system can show the same funcionality 
+ using setInterval, keep update the storage
+ console log to check the value

```
Phase 3 : alert a word after certain interval
```
+ when syc storage timer count will be zero 
    + send message to tab from background 
    + catch the action in content script
    + display the word

```
Phase 4 : Instead of alert, build a pop-up UI
```
+ create a dialog element dynamically 
+ put the word to this dialog
+ check if dialog is open or not
    + If open simply overide the new word value
    + otherwise put the value and show the dialog/modal

```
Phase 5 : fetch data from API
```
+ make API request using fetch asynchronous method
+ if this will get the expected data, then display it as pop-up
