## Learn With Fun
> It's a chrome extension which will pop up a new english word daily or as per user setup. 
> Built using Vanilla JavaScript.

```
Features need to develop (Requirements)
```

 + Popup random new english word (use google api later stage)
 + Popup will display with a funny gif image
 + If user click 'know more' it will redirect to it's explaination (include google api later stage) 
 + set word preferance (as a option to the user) as easy, medium, hard
 + set time interval 

| MUST HAVE | SHOULD HAVE | COULD HAVE | WON'T HAVE |
| ------ | ------ | ------ | ------ |
|pop-up dialog | know more button | word preferance | word with funny gif image |         
|word fetch api | on-off button (settings page) |

```
Phase 1 : alert a word in window after open chrome
```
+ Create a word array 
+ alert after loading chrome urls

```
Phase 2 : keep a timer count in storage
```
+ declare a function expression with get and send functionality
    + using sync storage so that every chrome browser (login with same G-mail id) from diffrent syatem can show thw same funcionality 
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
Phase 5 : add random funny gif imgage on the pop-up
```
