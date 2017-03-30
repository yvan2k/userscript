// ==UserScript==
// @name        Streamline tvmaze calendar
// @namespace   tvmaze
// @include     http://www.tvmaze.com/calendar*
// @downloadURL https://github.com/yvan2k/userscript/blob/master/tvmaze_calendar.user.js?raw=true
// @updateURL   https://github.com/yvan2k/userscript/blob/master/tvmaze_calendar.user.js?raw=true
// @version     0
// @grant       none
// ==/UserScript==

$(".entry a").each(function () {
  var episode_id, show_id ;
  try {
    episode_id = this.href.match(/(?:episodes\/)([0-9]+)/)[1] ;
  } catch (e){
  };

  try {
    show_id = this.href.match(/(?:shows\/)([0-9]+)/)[1] ;
  } catch (e){
  };
  
  if (show_id != undefined) {
    console.log(show_id, this, $(this).parent()[0].attributes["class"]) ;      
    var str0 = "<input class=\"postcheckbox\" type=\"checkbox\" checked show_id=\"" + show_id + "\" >" ;
    $(this).before(str0) ;    
  }
  
  if (episode_id != undefined) {
    if (/x01$/.test($(this).text())) {
//      console.log(episode_id, this, $(this).parent()[0].attributes["class"]) ;      
      var style = "background-color: " + (/^1x/.test($(this).text()) ? "plum" : "lightpink") + ";" /*+ "font-size: 14px; font-weight: bold;"*/ ;      
      $($($(this).parent()[0]).find("a")).attr("style", style) ;
    }

    _class = $(this).parent()[0].attributes["class"].value ;
    if      (_class == "entry watched")  type = "0"
    else if (_class == "entry acquired") type = "1"
    else                                 type = "" ;
    
    var str = "<br>" ;
    ["", "0", "1", "2"].forEach(function (e, i, a) {
       str = str + 
       "<input class=\"postradiobutton\" type=\"radio\""
          + " style=\"margin-bottom: 0px;\""
          + " value=\"" + e + "\""
          + " episode_id=\"" + episode_id + "\""
          + " name=rb" + episode_id + ""
          + ((type == e) ? " checked=\"true\"" : "")
          + " />"
    }) ;
    $(this).after(str) ;
  }
})

$(document).on('change', '.postradiobutton', function(e){
  var _class = "" ;

       if (this.value == "")  _class = "entry"
  else if (this.value == "0") _class = "entry watched"
  else if (this.value == "1") _class = "entry acquired"
  else if (this.value == "2") _class = "entry skipped" ;

  $.post('/watch/set?episode_id=' + this.attributes['episode_id'].value, {type: this.value}) ;

  $($(this).parent()[0]).toggleClass() ;
  $($(this).parent()[0]).toggleClass(_class) ;
});

$(document).on('change', '.postcheckbox', function(e){
  $.post('/follow/toggle?show_id=' + this.attributes['show_id'].value + '&widget=small', {}) ;
});

$("li .entry").css("padding-bottom", "0") ;
$("li .entry").css("padding-top", "0") ;
$(".postcheckbox").css("margin-bottom", "0") ;
$(".row").css("max-width", "120rem") ;
