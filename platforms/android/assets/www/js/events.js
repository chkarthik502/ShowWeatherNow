//-------------------------------------Events-----------------------------------------

//swipe left gesture: To display right panel.
//Swipe right gesture: To display left panel.
//left and righ swipe should not work when the bottom panel is open.
$( document ).on( "swipeleft swiperight", "#home", function( e ) {
// We check if there is no open panel on the page because otherwise
// a swipe to close the left panel would also open the right panel (and v.v.).
// We do this by checking the data that the framework stores on the page element (panel: open).
if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) 
{
	if(e.type==="swipeleft")
	{
		if($(".box").css('bottom') != "0px")
		{
			$("#right-panel").panel("open");
		}
	}
    else if ( e.type === "swiperight" )
    {
    	if($(".box").css('bottom') != "0px")
    	{
        $( "#left-panel" ).panel( "open" );
    	}
    }
}
});

//Show the bottom panel when the button is clicked.
$('#openbottompanel').click(function(){
    $('.box').animate({'bottom':'0'},300);
 });

//Close the bottom panel when a button or div is clicked.
$('#close').click(function(){
    $('.box').animate({'bottom':'-100%'},300)        
});