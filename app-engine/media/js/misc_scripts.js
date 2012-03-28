$(document).ready(function(){

    $("div#video iframe").attr("width",viewport().width);
    $("div#video iframe").attr("height",viewport().height);

});

function viewport() {
    var e = window , a = 'inner';
    if ( !( 'innerWidth' in window ) ) {
	a = 'client';
	e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}
