var ytp; // Youtube Flash Player Object


$(document).ready(function(){
    
	// load video list
	loadVideoList()
	setCurrentVideoIndex(0);

	// adjust viewport
    console.log("Viewport Dimentions adjusted");
    v = viewport();
    $("div#video object").attr("width",v.width);
    $("div#video object").attr("height",v.height);

	// set pause/play button action
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

	$("img#next").click(function(){
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
		ytp.loadVideoById(next_song.link,1,'medium');
		
		// change song title
		$("div#video-title").html(next_song.title)
		
	});

});

// Starts the video set in 'video-id' hidden input 
// when youtube player is ready
function onYouTubePlayerReady(playerid) {
    console.log("Youtube Player Registered")
    ytp = document.getElementById("ytplayer");

    // Initial video
	video_id = $("input#video-id").val()
	ytp.loadVideoById(video_id,1,'medium');
    //ytp.loadVideoById('flmB63_fpm4',1,'medium');

    console.log(ytp);

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
