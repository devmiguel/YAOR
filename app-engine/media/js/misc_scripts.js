var ytp; // Youtube Flash Player Object

$(document).ready(function(){
    
    console.log("Viewport Dimentions adjusted");
    v = viewport();
    $("div#video object").attr("width",v.width);
    $("div#video object").attr("height",v.height);

    $("img#pause").click(function() {

	state = ytp.getPlayerState();

	if (state == 1){ // Playing
	    ytp.pauseVideo();
	    console.log("Pause");
	}
	else if (state == 2){ // Paused
	    ytp.playVideo();
	    console.log("Play");
	}

    });

});

function onYouTubePlayerReady(playerid) {
    console.log("Youtube Player Registered")
    ytp = document.getElementById("ytplayer");

    // Initial video

    ytp.loadVideoById('flmB63_fpm4',1,'medium');

    console.log(ytp);

}

function viewport() {
    var e = window , a = 'inner';
    if ( !( 'innerWidth' in window ) ) {
	a = 'client';
	e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}
