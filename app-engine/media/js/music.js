// writes video list on local storage with the
// incremental key "tc-slink-i" where 'i' is the 
// song counter 
function loadVideoList() {
	var video_list_dic = $("input#video-list").val()
	var jsonObj = jQuery.parseJSON(video_list_dic);
	var video_list = jsonObj.video_list
	
	for(i=0; i< video_list.length; i++){
		var song_dic = video_list[i]
		song_dic["counter"] = i
		localStorage["tc-slink-"+i] = JSON.stringify(song_dic)
	}
	localStorage["video-list-size"] = video_list.length
}

function setCurrentVideoIndex(index){
	localStorage["video-index"] = parseInt(index)
}

function getCurrentVideoIndex(){
	return parseInt(localStorage["video-index"])
}

// obtains the song according to the provided index in
// JSON format and null otherwise
function getVideoByIndex(index){
	var video = localStorage["tc-slink-"+index]
	if(video != null){
		return jQuery.parseJSON(video);
	}
}