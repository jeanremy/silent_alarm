var secs = 10;
var t;
function degrade() {
	document.body.style.webkitTransitionDuration = "10s";
}
function countdown() {
	t = setTimeout('decrement()',1000);
	degrade();
}

function pause() {
	clearTimeout(t);
}


function decrement() {
	minutes = document.getElementById("minutes");
	seconds = document.getElementById("seconds");
		// if less than a minute remaining
		if (seconds < 59) {
			seconds.value = secs;
		} else {
			minutes.value = getminutes();
			seconds.value = getseconds();
		}
		if (secs > 0) {
			secs--;
		}
		else {
			secs = 0;
		}
		t = setTimeout('decrement()',1000);

}
function getminutes() {
	// minutes is seconds divided by 60, rounded down
	mins = Math.floor(secs / 60);
	return mins;
}
function getseconds() {
	// take mins remaining (as seconds) away from total seconds remaining
	return secs-Math.round(mins *60);
}

countdown();