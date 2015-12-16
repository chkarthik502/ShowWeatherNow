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
	var recommendgearHours;

var icons = {"night-clear": "wi-forecast-io-clear-night",
"rain": "wi-forecast-io-rain",
"snow": "wi-forecast-io-snow",
"sleet": "wi-forecast-io-sleet",
"strong-wind": "wi-forecast-io-wind",
"fog": "wi-forecast-io-fog",
"cloudy": "wi-forecast-io-cloudy" ,
"day-cloudy": "wi-forecast-io-partly-cloudy-day" ,
"night-cloudy": "wi-forecast-io-partly-cloudy-night",
"hail": "wi-forecast-io-hail",
"thunderstorm": "wi-forecast-io-thunderstorm",
"tornado": "wi-forecast-io-tornado"};


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
   	$("#hour-slider").on("change", function (event){
    recommendgearHours = $("#hour-slider").val();
    // alert(recommendgearHours);
    console.log("changed hours: "+recommendgearHours);
    RecommendGears(HourlyData);
	});
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

			displayCurrentLocation();
			displayCurrentSummary();	
			displayHourlyReport(HourlyData);
			displayTimeStamp();
			setRecommendGearHours();
			RecommendGears(HourlyData);

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
		var geticonclass = icons[val.icon];
		if(geticonclass=="undefined"){geticonclass="wi-forecast-io-clear-night";}
			// else{geticonclass="wi-forecast-io-rain";}
		// var cHour = myDate.getHours();
		var formatHour = getHourFormat(myDate);
		var hourlyTempInF = Math.round(val.temperature);
		var hourlyTempInC = Math.round((val.temperature-32) * 0.5556);
		if(defaultUnit==FahHtmlCode){
			hourlyTemp = hourlyTempInF;}
		else{hourlyTemp = hourlyTempInC;}
		// if(i<HoursOfDisplay)
		// {
			// <i class="+geticonclass+"></i>
			$("#hour").append("<td><h5>"+formatHour[0]+"<br>"+formatHour[1]+"</h5>"+
				"<small>"+val.icon+"</small>"+
				"<h3><i class='wi "+geticonclass+"'></i></h3></td>");
			// $("#hour").append("<td>"+val.icon+"</td>");
			$("#temp").append("<td><h5>"+hourlyTemp+"&nbsp;"+defaultUnit+"</h5></td>");
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

function setRecommendGearHours()
{
	recommendgearHours = $("#hour-slider").val();
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

function RecommendGears(HourlyData)
{
	var needJacket=false;
	var needGloves=false;

		$.each(HourlyData,function(i,val){
			console.log(val);
			if(i<recommendgearHours && val.temperature<60)
			{
				needJacket = true;
			}

			if(i<recommendgearHours && val.temperature<55)
			{
				needGloves = true;
			}
		});

		if(needJacket==true || needGloves==true)
		{
			console.log("Need Jacket: " + needJacket +"\n" + "Need Gloves: "+needGloves);
			console.log("Recommended Hours: "+recommendgearHours);
		}

		if(needGloves)
		{
			$("#glovespic").css("border","5px solid #00FF66");
			$("#glovespic").css("opacity","1");
		}

		if(!needGloves)
		{
			$("#glovespic").css("border","5px solid gray");
			$("#glovespic").css("opacity","0.20");
		}

		if(needJacket)
		{
			$("#jacketpic").css("border","5px solid #00FF66");
			$("#jacketpic").css("opacity","1");
		}
		if(!needJacket)
		{
			$("#jacketpic").css("border","5px solid gray");
			$("#jacketpic").css("opacity","0.20");
		}
}
