function getJulianDate(exact) {
	var time = new Date();
	if(exact) {
		return 367.0 * time.getFullYear() - Math.floor(7 * (time.getFullYear() + Math.floor((time.getUTCMonth() + 1 + 9) / 12.0)) / 4.0) + Math.floor((275 * (time.getUTCMonth() + 1)) / 9.0) + time.getUTCDate() + 1721013.5 + (time.getUTCHours() + 17.0 + time.getUTCMinutes() / 60.0 + time.getUTCSeconds() / 3600.0) / 24.0 - 2451545.0;
	} else {
		return 367.0 * time.getFullYear() - Math.floor(7 * (time.getFullYear() + Math.floor((time.getUTCMonth() + 1 + 9) / 12.0)) / 4.0) + Math.floor((275 * (time.getUTCMonth() + 1)) / 9.0) + time.getUTCDate() + 1721013.5 - 2451545.0;
	}
}

function getJulianDateOfDate(exact, time) {
	if(exact) {
		return 367.0 * time.getFullYear() - Math.floor(7 * (time.getFullYear() + Math.floor((time.getUTCMonth() + 1 + 9) / 12.0)) / 4.0) + Math.floor((275 * (time.getUTCMonth() + 1)) / 9.0) + time.getUTCDate() + 1721013.5 + (time.getUTCHours() + 17.0 + time.getUTCMinutes() / 60.0 + time.getUTCSeconds() / 3600.0) / 24.0 - 2451545.0;
	} else {
		return 367.0 * time.getFullYear() - Math.floor(7 * (time.getFullYear() + Math.floor((time.getUTCMonth() + 1 + 9) / 12.0)) / 4.0) + Math.floor((275 * (time.getUTCMonth() + 1)) / 9.0) + time.getUTCDate() + 1721013.5 - 2451545.0;
	}
}

function getLocalSiderealTime(julianDate, longitude, time) {
	if(time == null) {
		time = new Date();
	}
	var degreesUTC = (time.getUTCHours() * 60 + time.getUTCMinutes() + time.getUTCSeconds() / 60 + time.getUTCMilliseconds() / 1000) / 4.0;

	return ((100.46 + 0.985647 * julianDate + longitude + degreesUTC) % 360) / 15.04107;
}

function getGreenwichMeanSidrealTime(julianDay, julianCenturies) {
	return (6.697374558 + 0.06570982441908 * julianDay + 0.000026 * Math.pow(julianCenturies, 2)) % 24;
}

function getJulianCenturies(julianDate) {
	return (julianDate) / 36525.0;
}

function stringifyTime(time) {
	var hours = time.getHours ( );
	var minutes = time.getMinutes ( );
	var seconds = time.getSeconds ( );
	
	minutes = (minutes < 10 ? "0" : "" ) + minutes;
	seconds = (seconds < 10 ? "0" : "" ) + seconds;
	
	return hours + ":" + minutes + ":" + seconds;
}

function stringifyDate(time) {
	var days = time.getDate();
	var month = time.getMonth() + 1;
	var year = time.getFullYear();
	
	return days + "/" + month + "/" + year;
}

function stringifyDecimalTime(time) {
	var hours = Math.floor(time);
	var minutes = (time - Math.floor(time)) * 60;
	var seconds = (minutes - Math.floor(minutes)) * 60;
	minutes = Math.floor(minutes);
	seconds = Math.floor(seconds);
	
	minutes = (minutes < 10 ? "0" : "" ) + minutes;
	seconds = (seconds < 10 ? "0" : "" ) + seconds;
	
	return hours + ":" + minutes + ":" + seconds;
}

//declination must be expressed in decimal degrees
function getSetTime(rightAscension, declination, latitude) {
	var setOffset = toDegrees(Math.acos(-Math.tan(toRadians(latitude)) * Math.tan(toRadians(declination)))) / 15.04107;
	var time = (getTimeAtTransit(rightAscension) + setOffset);
	
	return time;
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

function toRadians (angle) {
	return angle * (Math.PI / 180);
}

function getRiseTime(rightAscension, declination, latitude) {
	var setOffset = toDegrees(Math.acos(-Math.tan(toRadians(latitude)) * Math.tan(toRadians(declination))));
	
	var riseIndex;
	var riseDiff;
	for(var x = setOffset - 360; x < setOffset; x+=.5) {
		var alt = toDegrees(Math.asin(Math.sin(toRadians(declination)) * Math.sin(toRadians(latitude)) + Math.cos(toRadians(declination)) * Math.cos(toRadians(latitude)) * Math.cos(toRadians(x))));
		if(Math.abs(alt) < 1 && alt < toDegrees(Math.asin(Math.sin(toRadians(declination)) * Math.sin(toRadians(latitude)) + Math.cos(toRadians(declination)) * Math.cos(toRadians(latitude)) * Math.cos(toRadians(x + 1))))) {
			if(riseDiff == null || Math.abs(alt) < riseDiff) {
				riseIndex = x;
				riseDiff = Math.abs(alt);
			}
		}
	}
	
	var time = getTimeAtTransit(rightAscension) + (riseIndex / 15.04107);
	
	return time;
}

function getNightLength(latitude) {
	var dayOfYear = getDayOfYear();
	var P = Math.asin(.39795 * Math.cos(.2163108 + 2 * Math.atan(.9671396 * Math.tan(.00860 * (dayOfYear - 186)))));
	var dayLength = 24 - (24 / Math.PI) * Math.acos((Math.sin(0.8333 * Math.PI / 180) + Math.sin(latitude * Math.PI / 180) * Math.sin(P)) / (Math.cos(latitude * Math.PI / 180) * Math.cos(P)));
	
	return 24 - dayLength;
}

function getDayOfYear() {
	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var diff = now - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	return day;
}

function getHoursUntilTransit(rightAscension) {
	var longitude;
	getPosition();
	if(window.sessionStorage.getItem("longitude") == null) {
		longitude = 0;
	} else {
		longitude = parseFloat(window.sessionStorage.getItem("longitude"));
	}
	var LST = getLocalSiderealTime(getJulianDate(true), longitude);
	if(LST > rightAscension) {
		return 24 - (LST - rightAscension);
	} else {
		return rightAscension - LST;
	}
}

function getTimeAtTransit(rightAscension) {
	var hrUntilTransit = getHoursUntilTransit(rightAscension);
	var time = new Date();
	
	return (time.getHours() + time.getMinutes() / 60 + time.getSeconds() / 3600 + (hrUntilTransit * 1.002737909350795));
}

//@param: date: day to calculate
//0: new moon .5: full moon .999: almost new moon
function getMoonPercent(time) {
	var day;
	if(time == null) {
		day = new Date();
	} else {
		day = time;
	}
	//2451401.500000 = august 11 1999
	//143.5 = aug - epoch julian date (- 2451401.5 + 2451545.0)
	return ((getJulianDateOfDate(true, day) + 143.5) % 29.530588853) / 29.530588853;
}

function getMoonPhase(time) {
	var p = getMoonPercent(time);
	if(p < .02) return "New moon";
	if(p < .22) return "Waxing crescent";
	if(p < .28) return "First quarter";
	if(p < .475) return "Waxing gibbous";
	if(p < .525) return "Full moon";
	if(p < .72) return "Waning gibbous";
	if(p < .78) return "Third quarter";
	if(p < .98) return "Waning crescent";
	return "New moon";
}

function getLimitFromBortle(bortleRating) {
	switch(parseInt(bortleRating)) {
			case 1: return 8.0;break;
			case 2: return 7.5;break;
			case 3: return 7.0;break;
			case 4: return 6.5;break;
			case 5: return 6.0;break;
			case 6: return 5.5;break;
			case 7: return 5.0;break;
			case 8: return 4.5;break;
			case 9: return 4.0;break;
			default: return 100;
	}
}

function getAltitude(starData, time) {
	var dec = parseFloat(starData.Dec);
	var RA = parseFloat(starData.RA);
	var longitude;
	var latitude;
	
	if(window.sessionStorage.getItem("longitude") == null) {
		longitude = 0;
	} else {
		longitude = parseFloat(window.sessionStorage.getItem("longitude"));
	}
	
	if(window.sessionStorage.getItem("latitude") == null) {
		latitude = 0;
	} else {
		latitude = parseFloat(window.sessionStorage.getItem("latitude"));
	}
	
	var hourAngle = getLocalSiderealTime(getJulianDate(true), longitude, time) - RA;
	
	var alt = toDegrees(
		Math.asin(
			Math.sin(toRadians(dec)) * Math.sin(toRadians(latitude)) + Math.cos(toRadians(dec)) * Math.cos(toRadians(latitude)) * Math.cos(toRadians(hourAngle))
		)
	);
	
	return alt;
}

function getLunarAltitude(time, latitude, longitude) {
	var julianCenturies = (getJulianDateOfDate(true, time) + 2451545.0 - 2415020.0) / 36525.0;
	
	//L'
	var lunarMeanLongitude = (270.434164 + 481267.8831 * julianCenturies) % 360;
	//M
	var solarMeanAnomaly = (358.475833 + 35999.0498 * julianCenturies) % 360;
	//M'
	var lunarMeanAnomaly = (296.104608 + 477198.8491 * julianCenturies) % 360;
	//D
	var lunarMeanElongation = (350.737486 + 445267.1142 * julianCenturies) % 360;
	//F
	var lunarDistAscendingNode = (11.250889 + 483202.0251 * julianCenturies) % 360;
	//L
	var eclipticLongitude = lunarMeanLongitude 
		+ 6.288750 * Math.sin(toRadians(lunarMeanAnomaly)) 
		+ 1.274018 * Math.sin(toRadians((2 * lunarMeanElongation - lunarMeanAnomaly)))
		+ 0.658309 * Math.sin(toRadians(2 * lunarMeanElongation))
		+ 0.213616 * Math.sin(toRadians(2 * lunarMeanAnomaly))
		- 0.185596 * Math.sin(toRadians(solarMeanAnomaly))
		- 0.114336 * Math.sin(toRadians(2 * lunarDistAscendingNode));
	//B
	var eclipticLatitude = 5.128189 * Math.sin(toRadians(lunarDistAscendingNode))
			+ 0.280606 * Math.sin(toRadians((lunarMeanAnomaly + lunarDistAscendingNode))) 
			+ 0.277693 * Math.sin(toRadians((lunarMeanAnomaly - lunarDistAscendingNode)))
			+ 0.173238 * Math.sin(toRadians((2 * lunarMeanElongation - lunarDistAscendingNode))) 
			+ 0.055413 * Math.sin(toRadians((2 * lunarMeanElongation + lunarDistAscendingNode - lunarMeanAnomaly)))
			+ 0.046272 * Math.sin(toRadians((2 * lunarMeanElongation - lunarDistAscendingNode - lunarMeanAnomaly)));
	//pi
	var horizontalParallax = 0.950724 
		+ 0.051818 * Math.cos(toRadians(lunarMeanAnomaly))
		+ 0.009531 * Math.cos(toRadians((2 * lunarMeanElongation - lunarMeanAnomaly)))
		+ 0.007843 * Math.cos(toRadians(2 * lunarMeanElongation)) 
		+ 0.002824 * Math.cos(toRadians(2 * lunarMeanAnomaly))
		+ 0.000857 * Math.cos(toRadians((2 * lunarMeanElongation + lunarMeanAnomaly)));
	
//	slightly incorrect apparently
//	var eclipticObliquity = 23.452294 - 0.0130125 * julianCenturies - 0.00000164 * Math.pow(julianCenturies, 2) + 0.000000503 * Math.pow(julianCenturies, 3);
	var eclipticObliquity = 23.0 + 26.0/60.0 + 21.448/3600.0 - (46.8150 * julianCenturies + 0.00059 * julianCenturies * julianCenturies - 0.001813 * julianCenturies * julianCenturies * julianCenturies)/3600;
	
//	calculations
//	var moonRA = toDegrees(Math.atan((Math.sin(toRadians(eclipticLongitude)) * Math.cos(toRadians(eclipticObliquity)) - Math.tan(toRadians(eclipticLatitude)) * Math.sin(toRadians(eclipticObliquity))) / Math.cos(toRadians(eclipticLongitude))));
//	var moonDec = toDegrees(
//		Math.asin(
//			Math.sin(toRadians(eclipticLatitude)) * Math.cos(toRadians(eclipticObliquity)) 
//			+ Math.cos(toRadians(eclipticLatitude)) * Math.sin(toRadians(eclipticObliquity)) * Math.sin(toRadians(eclipticLongitude))
//		)
//	);
	
	var T = getJulianDateOfDate(true, time) / 36525.0;
	var X = Math.cos(toRadians(eclipticLatitude)) * Math.cos(toRadians(eclipticLongitude));
	var Y = Math.cos(toRadians(eclipticObliquity)) * Math.cos(toRadians(eclipticLatitude)) * Math.sin(toRadians(eclipticLongitude)) - Math.sin(toRadians(eclipticObliquity)) * Math.sin(toRadians(eclipticLatitude));
	var Z = Math.sin(toRadians(eclipticObliquity)) * Math.cos(toRadians(eclipticLatitude)) * Math.sin(toRadians(eclipticLongitude)) - Math.cos(toRadians(eclipticObliquity)) * Math.sin(toRadians(eclipticLatitude));
	var R = Math.sqrt(1.0 - Z * Z);

	var moonDec = (180.0 / Math.PI) * Math.atan(Z / R); // in degrees
	var moonRA = (24.0 / Math.PI) * Math.atan(Y / (X + R)); // in hours
	
	while(moonRA < 0 || moonRA > 360) {
		if(moonRA < 0) {
			moonRA += 360;
		} else if(moonRA > 360) {
			moonRA -= 360;
		}
	}
	
	while(moonDec < 0 || moonDec > 360) {
		if(moonDec < 0) {
			moonDec += 360;
		} else if(moonDec > 360) {
			moonDec -= 360;
		}
	}
	
	//sin(ALT) = sin(DEC)*sin(LAT)+cos(DEC)*cos(LAT)*cos(HA)
	
	var LST = getLocalSiderealTime(getJulianDateOfDate(true, time), longitude, time);
	var HA = (LST * 15.04107) - (moonRA * 15.04107);
	
	while(HA < 0 || HA > 360) {
		if(HA < 0) {
			HA += 360;
		} else if(HA > 360) {
			HA -= 360;
		}
	}
	
	var moonAlt = toDegrees(
		Math.asin(
			Math.sin(toRadians(moonDec)) * Math.sin(toRadians(latitude)) + Math.cos(toRadians(moonDec)) * Math.cos(toRadians(latitude)) * Math.cos(toRadians(HA))
		)
	);
	
	var parallax = toDegrees(Math.asin(Math.cos(toRadians(moonAlt)) * Math.sin(toRadians(horizontalParallax))));
	moonAlt -= parallax;
	
	return moonAlt;
}

getLunarAltitude(new Date(2014, 1, 16, 3, 30), 30.5358976, -97.7036667);
//getLunarAltitude(new Date(), 30.5358976, -97.7036667);

Date.prototype.stdTimezoneOffset = function() {
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
	return this.getTimezoneOffset() < this.stdTimezoneOffset();
}