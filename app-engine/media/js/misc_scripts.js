var ytp; // Youtube Flash Player Object
var moved = false; // True if the mouse has been moved
var bb = false; // True when the mouse is over any button/div
var popupStatus = 0;  // 0 means disabled; 1 means enabled;  

$(document).ready(function(){
       
	// load video list
	loadVideoList();
	setCurrentVideoIndex(0);
	
    // Loading popup menu
	$("div#gear").click(function(){
		centerPopup();
		loadPopup();
	});
	
	// Closing popup menu
	$("#popupContactClose").click(function(){ disablePopup(); });
	$("#backgroundPopup").click(function(){ disablePopup(); });

	// Adjust viewport
    $("div#video object").attr("width",$(window).width());
    $("div#video object").attr("height",$(window).height());
    console.log("[Viewport] Dimentions adjusted");

	// If the viewport is resized, update player size
	$(window).resize(function() {
		$("div#video object").attr("width",$(window).width());
	    $("div#video object").attr("height",$(window).height());
	    console.log("[Viewport] Dimentions adjusted after resize");
	});

	$("input#search").focusin(function(){
		updateInput();
	});
	
	$("input#search").focusout(function(){
		updateInput();
	});

	// Pause/play
    $("#controls").click(function() {
		togglePlay();
    });

	//Pause/ play on player click
	$("#ytplayer").click(function(){
		togglePlay();
	});

	// Keyboard shortcuts
	$(document).keypress(function(e){
		// 32 = space
		if ((e.which && e.which == 32) || (e.keyCode && e.keyCode == 32))
			togglePlay();
		// 110 = n & 78 = N
		if ((e.which && e.which == 110) || (e.keyCode && e.keyCode == 110) || (e.which && e.which == 78) || (e.which && e.which == 78))
			nextVideo();
		// 43 = +
		if ((e.which && e.which == 43) || (e.keyCode && e.keyCode == 43))
			volumeUp();
		// 45 = -
		if ((e.which && e.which == 45) || (e.keyCode && e.keyCode == 45))
			volumeDown();
	});
	
	// Next video
	$("#next").click(function(){
		nextVideo();
	});

	// Showing volume menu
	$("#volume").click(function(){
		console.log('hola');
		if ( $("#change-volume").css("visibility") == "hidden" )
			$("#change-volume").css("visibility", "visible");
		else
			$("#change-volume").css("visibility", "hidden")
	});

	// Increasing volume
	$("#volume-up").click(function(){
		volumeUp();
	});
	
	// Decreasing volume
	$("#volume-down").click(function(){
		volume = parseInt($("div#actual-volume").text()) - 10;
		ytp.setVolume(volume);
		$("div#actual-volume").html(ytp.getVolume());
	});

	$("#next").click(function(){
		var current_index = getCurrentVideoIndex()
		current_index = current_index + 1
		
		var next_song = getVideoByIndex(current_index)
		if(next_song == null){
			next_song = getVideoByIndex(0)
			current_index = 0
		}
		
		// set current index
		localStorage["video-index"] = current_index
		
		// load song in player
		ytp.loadVideoById(next_song.link,1,'default');
		
		// change song title
		$("div#video-title").html(next_song.title)

		// setting the pause button
		$("#controls").css("background-image","url('/sitemedia/images/pause.png')");

		volumeDown();

	});
	
	$("body").mousemove(function(event) {
	
		// If the popup menu is enabled, we dont care about the mouse movements
		if ( popupStatus == 0 ) {
			moved = true;
			if ( $("div.fader").css("display") == "none" )
				$.when( $("div.fader").fadeIn(600) ).then( timerUI() );
			else {
				$.when( $("div.fader").stop(true).css("opacity",1).css("display","inline") ).then( timerUI() );
			}
		}
		else{
			timerUI();
			move = false;
		}
		
	});
	
	// Determining if the mouse is over any button/div
	$("div#title, div#gear, div#volume, div#change-volume, div#title, div#controls, div#next").hover(
	  function () { bb = true; }, 
	  function () { bb = false; }
	);

	timerUI();
	move = false;
	
});

// Starts the video set in 'video-id' hidden input 
// when youtube player is ready
function onYouTubePlayerReady(playerid) {
    console.log("[Player] Youtube Player Registered")
    ytp = document.getElementById("ytplayer");

    // Initial video
	video_id = $("input#video-id").val()
	ytp.loadVideoById(video_id,1,'default');	// Happy-not-german-free-great-sexy-songs :)
    //ytp.loadVideoById('flmB63_fpm4',1,'medium'); // Sad-german-not-blocked-song :(

    // Setting volume property
    $("div#actual-volume").html(ytp.getVolume());

}

// get viewport for player expansion
function viewport() {
    var e = window , a = 'inner';
    if ( !( 'innerWidth' in window ) ) {
	a = 'client';
	e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

// Timer for the UI to start fading out
function timerUI(){
	setTimeout(function(){
		if ( moved == false && !bb ) {
			fadeUI();
		}
		moved = false;
	}, 1500);
}

function fadeUI(){

	$("div.fader").fadeOut(3000,function(){
		$("div#change-volume").css("visibility","hidden");
	});
}

// Loading popup menu
function loadPopup(){
	// Loads popup menu only if it is disabled
	if(popupStatus==0){
		$("#backgroundPopup").css({
		"opacity": "0.7"
	});
	$("#backgroundPopup").fadeIn("slow");
	$("#popupContact").fadeIn("slow");
		popupStatus = 1;
	}
}

// Disabling popup menu
function disablePopup(){
	// Disables popup menu only if it is enabled
	if(popupStatus==1){
		$("#backgroundPopup").fadeOut("slow");
		$("#popupContact").fadeOut("slow");
		popupStatus = 0;
	}
}

// Centering popup menu
function centerPopup(){
	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
	popupHeight = $("#popupContact").height();
	popupWidth = $("#popupContact").width();
	$("#popupContact").css({
		"position": "absolute",
		"top": windowHeight/2-popupHeight/2,
		"left": windowWidth/2-popupWidth/2
	});
	
	// Only need force for IE6
	$("#backgroundPopup").css({
		"height": windowHeight
	});
}

// Search form
function updateInput(){
	if ( $("input#search").val() == "Search video..." ){
		$("input#search").val("");
	}
	else if ( $("input#search").val() == "" ){
		$("input#search").val("Search video...");
	}
}

// Play/Pause Animations

function togglePlay(){

	var $elem = $('#playpause').children(':first');
	console.log('here');
	$elem.stop()
	.show()
	.animate({'marginTop':'-35px','marginLeft':'-35px','width':'70px','height':'70px','opacity':'0'},function(){
	$(this).css({'width':'45px','height':'45px','margin-left':'-22px','margin-top':'-22px','opacity':'1','display':'none'});
	});
	$elem.parent().append($elem);
	
	state = ytp.getPlayerState();

	// Setting play/pause properties
	if (state == 1){ // Playing
		ytp.pauseVideo();
		$("#controls #play").css("display","block");
		$("#controls #pause").css("display","none");
		console.log("[Player] Pause");
	}
	else if (state == 2){ // Paused
		ytp.playVideo();
		$("#controls #pause").css("display","block");
		$("#controls #play").css("display","none");    
		console.log("[Player] Play");
	}

}

function nextVideo(){

	var current_index = getCurrentVideoIndex()
	current_index = current_index + 1
	
	var next_song = getVideoByIndex(current_index)
	if(next_song == null){
		next_song = getVideoByIndex(0)
		current_index = 0
	}
	
	// set current index
	localStorage["video-index"] = current_index
	
	// load song in player
	ytp.loadVideoById(next_song.link,1,'default');
	
	// change song title
	$("div#video-title").html(next_song.title)

	// setting the pause button
	$("#controls #pause").css("display","block");
	$("#controls #play").css("display","none");   
	
}

function volumeUp(){
	volume = parseInt($("div#actual-volume").text()) + 10;
	ytp.setVolume(volume);
	$("div#actual-volume").html(ytp.getVolume());
}

function volumeDown(){
	volume = parseInt($("div#actual-volume").text()) - 10;
	ytp.setVolume(volume);
	$("div#actual-volume").html(ytp.getVolume());
}
