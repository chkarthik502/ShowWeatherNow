var defaultLat = "34.0983425";
	var defaultLong = "-118.3267434";
	var url = "https://api.forecast.io/forecast/";
	var forecastApiKey = "66d346b34ef768fa003792f04b07f316";
	var defaultCity = "Hollywood, CA";
	var link = url + forecastApiKey + "/" + defaultLat + "," + defaultLong;	
	var FahHtmlCode = "&#8457;";
	var CelHtmlCode = "&#8451;";
	var defaultUnit = FahHtmlCode;
	var currentTempInF;
	var currentTempInC;
	var Temperature;
	var summary;
	var timestamp;
	var HoursOfDisplay = 24;
	var HourlyData;

$( document ).on( "pageinit",function(){
	// $.mobile.orientationChangeEnabled = false;
	var jqxhr = $.getJSON( "http://ipinfo.io", function (response) {
    defaultCity = response.city + ", " + response.region;
    link = url + forecastApiKey + "/" + response.loc;
})
  .done(function() {
    console.log( "second success" );
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );
  },"jsonp");

  jqxhr.complete(function() {
   getWeather(link);
});
});

// To get location details like coordinates, city and state and set global variables.
function getLocation(){
	$.getJSON("http://ipinfo.io", function (response) {
    defaultCity = response.city + ", " + response.region;
    link = url + forecastApiKey + "/" + response.loc;
}, "jsonp");
}


// Call this function to get weather details and set it on the main html page.
function getWeather(link){
	// var link = "http://api.openweathermap.org/data/2.5/weather?zip=19382,us&units=imperial&APPID=a865457f374ace3ec53c33f47fe04816";
	var link2 = "https://api.forecast.io/forecast/66d346b34ef768fa003792f04b07f316/37.8267,-122.423";
	$.ajax({
		url: link,
		jsonpCallback:"jsonCallback",
		contentType: "application/json",
		dataType: "jsonp",
		success: function(weather){
			setCurrentSummary(weather);
			setTimeStamp();
			setTempFormat();
			setHourlyData(weather);

			displayCurrentLocation
			displayCurrentSummary();	
			displayHourlyReport(HourlyData);
			displayTimeStamp();
		},
		error: function (result) {
			$("#message").text(result);
		}
	});
	}

function displayHourlyReport(HourlyData)
{
	var hourlyTemp;
	 $("#hourlyTable tr").remove();
	 $("#hourlyTable").append("<tr id='hour'></tr>");
	 $("#hourlyTable").append("<tr id='temp'></tr>");
     
	$.each(HourlyData,function(i,val){
		var dt = eval(val.time*1000);
		var myDate = new Date(dt);
		// var cHour = myDate.getHours();
		var formatHour = getHourFormat(myDate);
		var hourlyTempInF = Math.round(val.temperature);
		var hourlyTempInC = Math.round((val.temperature-32) * 0.5556);
		if(defaultUnit==FahHtmlCode){
			hourlyTemp = hourlyTempInF;}
		else{hourlyTemp = hourlyTempInC;}
		// if(i<HoursOfDisplay)
		// {
			$("#hour").append("<td>"+formatHour[0]+"<br>"+"<b>"+formatHour[1]+"<b>"+"</td>");
			$("#temp").append("<td>"+hourlyTemp+"&nbsp;"+defaultUnit+"</td>");
		// }
	});
}

	function displayCurrentLocation()
	{
		$("#location").append("<h3>"+defaultCity+"</h3>");
	}

	function displayCurrentSummary()
	{
			$("#currenttemp").text(Temperature+ " " );
			$("#currenttemp").append("&nbsp;"+ defaultUnit);
			$("#summary").text(summary);
	}

	function setCurrentSummary(weather)
	{
		currentTempInF = Math.round(weather.currently.temperature);
		currentTempInC = Math.round((weather.currently.temperature-32) * 0.5556);
		summary = weather.currently.summary;
	}

	function setHourlyData(weather)
	{
		HourlyData = weather.hourly.data;
	}

	function setTimeStamp()
	{
		timestamp = new Date($.now());
	}

	function displayTimeStamp()
	{
	 	$("#timestamp").append(timestamp);
	}


function getHourFormat(myDate){
	var cHour = myDate.getHours();
	var weekday = ["Sun","Mon","Tues",
						"Wed","Thur",
						"Fri","Sat"];
	var today = weekday[timestamp.getDay()];
	var day = weekday[myDate.getDay()];
	var retVal = new Array(2);
	if(today==day)
	{
		day="Today";
	}
	if(cHour<12){
		if(cHour==0){retVal[0] =  day; retVal[1] ="12AM";}
		else{retVal[0] = day; retVal[1] = cHour + "AM";}
	}
	else{
		if(cHour==12){retVal[0]  = day; retVal[1] = cHour + "PM";}
		else{retVal[0] = day; retVal[1] = (cHour - 12) + "PM";}
	}
	return retVal;
}

function setTempFormat(){
	if($("#flip-5").val()=="C"){
		Temperature = currentTempInC;
		defaultUnit = CelHtmlCode;
	}
	else{
		Temperature = currentTempInF;
		defaultUnit = FahHtmlCode;
	}
}


//call below function in case if user toggles the unit switch.
$("#flip-5").on('change', function (event) {
if($("#flip-5").val()=="F"){
	Temperature = currentTempInF;
	defaultUnit = FahHtmlCode;
	displayCurrentSummary();
	displayHourlyReport(HourlyData);
	// $("#currenttemp").text(Temperature+ " " );
	// $("#currenttemp").append("&nbsp;"+ defaultUnit);
	// $("#summary").text(summary);
    $("#flip-5").val("F").flipswitch("refresh");
}
else{
	Temperature = currentTempInC;
	defaultUnit = CelHtmlCode;
	displayCurrentSummary();
	displayHourlyReport(HourlyData);
	// $("#currenttemp").text(Temperature+ " " );
	// $("#currenttemp").append("&nbsp;"+ defaultUnit);
	// $("#summary").text(summary);
    $("#flip-5").val("C").flipswitch("refresh");
}
});

// To get browser location details.
function getBrowserLocation(){
	if(navigator.geolocation){
		function success(pos){
			defaultLat = pos.coords.latitude;
			defaultLong = pos.coords.longitude;
			link = url + forecastApiKey + "/" + defaultLat + "," + defaultLong;
		}
		function fail(error){
		 $("message").append(error.code);}
		navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
	}
	else{
		alert("no location support");}
}