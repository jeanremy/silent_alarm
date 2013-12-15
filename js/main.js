/*
    Variables declarations
    ======================
*/

hours = document.getElementById('hours');
minutes = document.getElementById('minutes');
seconds = document.getElementById('seconds');
feedback = document.getElementById('feedback');
start = document.getElementById('start');
form = document.getElementById('countdown');


function getSeconds (){
    var hrs = parseInt(hours.value);
    var mins = parseInt(minutes.value);
    var secs = parseInt(seconds.value);
    return (hrs * 3600) + (mins * 60) + secs; 
}

function displayTime() {
    hrs = Math.floor(total / 3600);
    mins = Math.floor((total - (hrs * 3600)) / 60) ;
    secs = Math.floor(total - (hrs * 3600) - (mins * 60));
    if (hrs < 10) {
        mins = '0'+ hrs;
    }
    if (mins < 10) {
        mins = '0'+ mins;
    }
    if (secs < 10) {
        secs = '0'+ secs;
    }
    hours.value = hrs;
    minutes.value = mins;
    seconds.value = secs;

}

function startTimer () {
    total = getSeconds();              
    if (total == 0) {
        feedback.innerText='Please enter a correct number';
    }    
    else if (total > 0) {  
        feedback.innerText='';
        ToggleAnimation();
        pause.value = "Stop";
        decount();
        start.style.display = "none";
        pause.style.display = "block";  
    }    
    else {
        feedback.innerText='Please enter a number';
    }  
}

function decount() {
    total = getSeconds();
    if (total > 0) {
        total--;
        displayTime();
        t = setTimeout('decount()', 1000);
    }
    else if (total == 0) {
        pause.value = "Restart";
    }
}

function pauseTimer() {
    pause.style.display = "none";
    start.style.display = "block";
    clearTimeout(t);
}

function colorChange() {
    if (total != 0) {
        document.body.style.webkitAnimationDuration = total + 1 + "s"; // pour eviter bug
        document.body.style.animationDuration = total + 1 + "s"; // pour eviter bug
    }
}
start = document.getElementById('start');
pause = document.getElementById('pause');
start.addEventListener('click', startTimer, false);
pause.addEventListener('click', pauseTimer, false);

//Experiments for auto prefix
//Taken from http://www.sitepoint.com/css3-animation-javascript-event-handlers/
var anim = document.body;

// button click event
start.addEventListener("click", ToggleAnimation, false);
pause.addEventListener("click", ToggleAnimation, false);

// start/stop animation
function ToggleAnimation(e) {
    var on = (anim.className != "");
    anim.className = (on ? "" : "enable");
    colorChange();
    if(e) {e.preventDefault();}
};

function bodyClass() {
    if (anim.className == "") {
        anim.className = "enable";
    }
    else {
        anim.className = "";
    }
}