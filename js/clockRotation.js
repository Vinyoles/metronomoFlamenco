//script variables
let clockHandPosition = 0;
let timeout = 1000;
let intervalCounter = 0;
let bpm = 200;
let intervalIncrease = 0;
let bpmIncrease = 0;
const audioSoft = new Audio("https://vinyoles.com/dev/compas-y-flamenco/assets/audio/15389__pitx__palma-09.wav");
const audioAccent = new Audio("https://vinyoles.com/dev/compas-y-flamenco/assets/audio/15388__pitx__palma-08.wav");


//updates the metronome in loop
let updateTimeoutInLoop = function(){
    calculateClockRotation();
    updateTimeout(intervalIncrease, bpmIncrease); 
    setTimeout(updateTimeoutInLoop, timeout);
}
setTimeout(updateTimeoutInLoop, timeout);


//calculates the advancement of the clock hand
function calculateClockRotation() {
    clockHandPosition++;
    const currentClockPosition = clockHandPosition;
    const angleToSpin = clockToDegrees(currentClockPosition, 0, 12, 0, 360);
    document.querySelector(".reloj__manecilla").style.transform = `rotate(${angleToSpin}deg)`;
    sound(); //reproduces a bit, changing if there is or not an accent
}


//converts the degrees from clock angular coordinates to 360 degrees angular coordinates
function clockToDegrees(clockValue, clockMin, clockMax, degMin, degMax) {
    let degreesValue = degMin + (degMax - degMin) * (clockValue - clockMin) / (clockMax - clockMin);
    return degreesValue;
};


//sets the starting time interval between bits corresponding to the bpm
function calculateNewTimeout(bpm) {
    timeout = 60000 / bpm;
}


//updates the initial interval
function updateTimeout(intervalIncrease, bpmIncrease) {
    if (intervalIncrease == 0) {
        calculateNewTimeout(bpm);
    } 
    else if(clockHandPosition%12 == 0) {
        intervalCounter++;
        while(intervalCounter>=intervalIncrease) {
            if (bpm < 400) bpm = bpm + bpmIncrease;
            else if (bpm < 10) bpm = 10;
            else bpm = 400;
            intervalCounter = 0;
            calculateNewTimeout(bpm);
        }
    }
    else {
        return;
    }
}


//outputs the current BPM on the website
function showBPM() {
    document.getElementById("BPMDisplay").innerText = "BPM: " + bpm;
    setTimeout(showBPM, 10);
}
showBPM();


//updates BPM, interval and increase
function updateBPM() {
    //bpm
    bpm = parseInt(document.getElementById("form__bpm").value);
    if (bpm > 400) bpm = 400;
    else if (bpm < 10) bpm = 10;

    //interval and increase
    if (document.getElementById("form__toggle-display").checked) {
        intervalIncrease = parseInt(document.getElementById("form__interval").value);
        bpmIncrease = parseInt(document.getElementById("form__increment").value);
    }
    else {
        intervalIncrease = 0;
        bpmIncrease = 0;
    }

    intervalCounter = 0;
    updateTimeout(intervalIncrease, bpmIncrease)
}


//toggles the hide/show part of the form
function toggleHideShow() {
    const checkBox = document.getElementById("form__toggle-display");
    const text = document.getElementById("toggleHideShow");
  
    if (checkBox.checked == true) {
        text.style.display = "block";
    }
    else {
        text.style.display = "none";
    }
}


//reproduces claps at each timestep
function sound() {
    //detects the position of the hand
    const handPosition = clockHandPosition%12;;
    let currentBit = "reloj__numero"
    
    //from the position of hand, detects if the number has an accent
    if (handPosition == 0) currentBit = "reloj__numero" + 12;
    else currentBit = "reloj__numero" + handPosition;
    
    const currentBitAccent = document.getElementById(currentBit);

    //makes the sound, depending if the ofject has an accent or not, only if the user allows the sound to be played
    if (document.getElementById("form__active-sound").checked) {
        if (currentBitAccent.classList.contains("acento")) audioAccent.play();
        else audioSoft.play();
    }
    else return;

}


//adds or removes accents from the metronome
function changeAccentStatus(element) {
    if (element.classList.contains("acento")) element.classList.remove("acento");
    else element.classList.add("acento");
}