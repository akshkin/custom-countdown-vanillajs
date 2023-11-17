const inputContainer = document.getElementById("input-container")
const countdownForm = document.getElementById("countdown-form")
const dateEl = document.getElementById("date-picker")

const countdownEl = document.getElementById('countdown')
const countdownTitleEl = document.getElementById('countdown-title')
const countdownBtn = document.getElementById('countdown-button')
const timeElements = document.querySelectorAll('ul li span')

const completeEl= document.getElementById("complete")
const completeElInfo= document.getElementById("complete-info")
const completeBtn= document.getElementById("complete-button")


let countdownTitle = ''
let countdownDate = ''
let countdownValue = new Date()
let countdownActive 
let savedCountdown

const second = 1000
const minute = second*60
const hour = minute*60
const day = hour*24

const today = new Date().toISOString().split("T")[0]
//  make sure user cannot set a past date
dateEl.setAttribute("min", today)

// update countdown and UI

function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime()
        const distance = countdownValue - now
   
        const days = Math.floor(distance/day)
        const hours = Math.floor((distance%day)/hour)
        const minutes = Math.floor((distance%hour)/minute)
        const seconds = Math.floor((distance%minute)/second)
    
        if(distance < 0) {
            countdownEl.hidden = true
            clearInterval(countdownActive)
            completeEl.hidden = false
            inputContainer.hidden = true
            completeElInfo.textContent = `${countdownTitle} ended on ${countdownDate}`
            savedCountdown = ""
            localStorage.removeItem("countdown")
        } else {
            // populate countdown
            countdownTitleEl.textContent = `${countdownTitle}` 
            timeElements[0].textContent = `${days}` 
            timeElements[1].textContent = `${hours}` 
            timeElements[2].textContent = `${minutes}` 
            timeElements[3].textContent = `${seconds}` 
            completeEl.hidden = true
            countdownEl.hidden = false
            inputContainer.hidden = true           
        }
    }, second)

}


function updateCountdown(event){
    event.preventDefault()
    countdownTitle = event.srcElement[0].value
    countdownDate = event.srcElement[1].value

    // get number version of current date
    countdownValue = new Date(countdownDate).getTime()

    savedCountdown = {
        title: countdownTitle,
        date: countdownDate
    }
    localStorage.setItem("countdown", JSON.stringify(savedCountdown))

    if(countdownDate === "" || countdownTitle === ""){
        alert("Please select a date and time for countdown")
    } else {
        updateDOM()

    }
}

function resetTimer() {
    countdownEl.hidden = true
    inputContainer.hidden = false
    completeEl.hidden = true
    clearInterval(countdownActive)

    // reset values
    countdownTitle = ""
    countdownDate= ""
    localStorage.removeItem("countdown")
}

function restorePreviousCountdown(){
    savedCountdown = JSON.parse(localStorage.getItem("countdown"))
    if(savedCountdown) {
        inputContainer.hidden = true
        countdownEl.hidden = false
        countdownTitle = savedCountdown.title
        countdownDate = savedCountdown.date
        countdownValue = new Date(countdownDate).getTime()
        updateDOM()
    }
}


// event listeners
countdownForm.addEventListener("submit", updateCountdown)
countdownBtn.addEventListener("click", resetTimer)
completeBtn.addEventListener("click", resetTimer)

// onn load, check local storage

restorePreviousCountdown()