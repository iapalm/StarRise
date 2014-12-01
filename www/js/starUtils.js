function toggleNightmode(isNight, directoriesUp) {
	if(directoriesUp == null || directoriesUp == 0) {
		if(isNight) {
			$('link[href="css/redTheme.css"]').attr('href','css/defaultTheme.css');
			window.localStorage.setItem("nightMode", 0);
		} else {
			$('link[href="css/defaultTheme.css"]').attr('href','css/redTheme.css');
			window.localStorage.setItem("nightMode", 1);
		}
	}
	
	if(directoriesUp == 1) {
		if(isNight) {
			$('link[href="../css/redTheme.css"]').attr('href','../css/defaultTheme.css');
			window.localStorage.setItem("nightMode", 0);
		} else {
			$('link[href="../css/defaultTheme.css"]').attr('href','../css/redTheme.css');
			window.localStorage.setItem("nightMode", 1);
		}
	}
	
	if(directoriesUp == 2) {
		if(isNight) {
			$('link[href="../../css/redTheme.css"]').attr('href','../../css/defaultTheme.css');
			window.localStorage.setItem("nightMode", 0);
		} else {
			$('link[href="../../css/defaultTheme.css"]').attr('href','../../css/redTheme.css');
			window.localStorage.setItem("nightMode", 1);
		}
	}
}

if(window.localStorage.getItem("nightMode") == 1) {
	try {$('link[href="css/defaultTheme.css"]').attr('href','css/redTheme.css');} catch(err) {}
	try {$('link[href="../css/defaultTheme.css"]').attr('href','../css/redTheme.css');} catch(err) {}
	try {$('link[href="../../css/defaultTheme.css"]').attr('href','../../css/redTheme.css');} catch(err) {}
}

function getImageFromPhase(time) {
	var p = getMoonPercent(time);
	if(p < .02) return "moon_d_new";
	if(p < .22) return "moon_d_waxCrescent";
	if(p < .28) return "moon_d_firstQuarter";
	if(p < .475) return "moon_d_waxGibbous";
	if(p < .525) return "moon_d_full";
	if(p < .72) return "moon_d_wanGibbous";
	if(p < .78) return "moon_d_thirdQuarter";
	if(p < .98) return "moon_d_wanCrescent";
	return "moon_d_new";
}

function sanitize(tex) {
	$("#wikiInfo a").contents().unwrap();
	$("#wikiInfo sup").contents().unwrap();
	$("#wikiInfo span").contents().unwrap();
	$('#wikiInfo').text().replace(/\[.]/g,'');
	var src = $('#wikiInfo img').attr('src');
	$('#wikiInfo img').attr('src', "http:" + src);
	var srcset = $('#wikiInfo img').attr('srcset');
	$('#wikiInfo img').attr('srcset', "http:" + src);
}

function getPosition() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

// onSuccess Geolocation
//
function onSuccess(position) {
	lat = position.coords.latitude;
    lng = position.coords.longitude;
    sessionStorage.setItem('latitude', lat);
    sessionStorage.setItem('longitude', lng);
}

// onError Callback receives a PositionError object
//
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}