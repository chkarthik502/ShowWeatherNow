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
	var hourly;
$( document ).on( "pageinit",function(){
	// $.mobile.orientationChangeEnabled = false;
	$( document ).on( "swipeleft swiperight", "#home", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
        	if(e.type==="swipeleft"){
        		$("#right-panel").panel("open");
        	}
            else if ( e.type === "swiperight" ) {
                $( "#left-panel" ).panel( "open" );
            }
        }
    });

	var jqxhr = $.getJSON( "http://ipinfo.io", function (response) {
    defaultCity = response.city + ", " + response.region;
    link = url + forecastApiKey + "/" + response.loc;
    // $("ul").append("<li>"+link+"</li>");
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

   $('#openbottompanel').click(function(){
            $('#box').animate({'bottom':'0'},300);
        });
  
    $('#close').click(function(){
        $('#box').animate({'bottom':'-100%'},300)        
    });

    // $('#box').click(function(){
    //     $('#box').animate({'bottom':'-100%'},300)        
    // });

// To get location details like coordinates, city and state and set global variables.
function getLocation(){
	$.getJSON("http://ipinfo.io", function (response) {
    defaultCity = response.city + ", " + response.region;
    link = url + forecastApiKey + "/" + response.loc;
    // $("ul").append("<li>"+link+"</li>");
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
			// var temp = data.main.temp;
			currentTempInF = Math.round(weather.currently.temperature);
			currentTempInC = Math.round((weather.currently.temperature-32) * 0.5556);
			summary = weather.currently.summary;
			timestamp = new Date($.now());
			if($("#flip-5").val()=="C")
			{
				Temperature = currentTempInC;
				defaultUnit = CelHtmlCode;
			}
			else
			{
				Temperature = currentTempInF;
				defaultUnit = FahHtmlCode;
			}

			var arr = weather.hourly.data;
			// var dt;
			// var myDate;
			// var cHour;
			$.each(arr,function(i,val){
				var dt = eval(val.time*1000);
				var myDate = new Date(dt);
				var cHour = myDate.getHours();
				var hourlyTemp = Math.round(val.temperature);
				if(i<12)
				{
					$("#hour").append("<td>"+cHour+"</td>");
					$("#temp").append("<td>"+hourlyTemp+"&nbsp;"+defaultUnit+"</td>");
				}
			});

			$("#location").append("<h3>"+defaultCity+"</h3>");
			$("#currenttemp").text(Temperature+ " " );
			$("#currenttemp").append("&nbsp;"+ defaultUnit);
			$("#summary").text(summary);
			$("#timestamp").append(timestamp);
		},
		error: function (result) {
			$("ul").append("<li>"+result+"</li>");
		}
	});
	}

//call below function in case if user toggles the unit switch.
$("#flip-5").on('change', function (event) {
if($("#flip-5").val()=="F"){
	Temperature = currentTempInF;
	defaultUnit = FahHtmlCode;
	$("#currenttemp").text(Temperature+ " " );
	$("#currenttemp").append("&nbsp;"+ defaultUnit);
	$("#summary").text(summary);
    $("#flip-5").val("F").flipswitch("refresh");
}
else{
	Temperature = currentTempInC;
	defaultUnit = CelHtmlCode;
	$("#currenttemp").text(Temperature+ " " );
	$("#currenttemp").append("&nbsp;"+ defaultUnit);
	$("#summary").text(summary);
    $("#flip-5").val("C").flipswitch("refresh");
}
});

// To get browser location details.
function getBrowserLocation(){
	if(navigator.geolocation)
	{
		function success(pos)
		{
			defaultLat = pos.coords.latitude;
			defaultLong = pos.coords.longitude;
			link = url + forecastApiKey + "/" + defaultLat + "," + defaultLong;
		}
		function fail(error)
		{
		 $("message").append(error.code);
		}
		navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
	}
	else
	{
		alert("no location support");
	}
}