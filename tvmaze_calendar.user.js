// ==UserScript==
// @name        Streamline tvmaze calendar
// @namespace   tvmaze
// @include     /^https?:\/\/www\.tvmaze\.com\/calendar/
// @downloadURL https://github.com/yvan2k/userscript/blob/master/tvmaze_calendar.user.js?raw=true
// @updateURL   https://github.com/yvan2k/userscript/blob/master/tvmaze_calendar.user.js?raw=true
// @version     1
// @grant       none
// ==/UserScript==

map = new Map([
       ["", "entry "],
       ["0", "entry watched"],
       ["1", "entry acquired"],
       ["2", "entry skipped"]]) ;

$(".entry a").each(function () {
  try {
    var episode_id = this.href.match(/(?:episodes\/)([0-9]+)/)[1] ;
    var show_id = this.href.match(/(?:shows\/)([0-9]+)/)[1] ;
  } catch (e){
  };

  if (show_id != undefined)
    $(this).before("<input class=\"postcheckbox\" type=\"checkbox\" checked show_id=\"" + show_id + "\" >") ;    

  if (episode_id != undefined) {
    if (/x01$/.test($(this).text()))
      $($($(this).parent()[0]).find("a")).attr("style", "background-color: " + (/^1x/.test($(this).text()) ? "plum" : "lightpink") + ";" /*+ "font-size: 14px; font-weight: bold;"*/) ;

    for (var [key, value] of map)
      if ($($(this).parent()[0]).parent()[0].attributes["class"].value == value) {
        var type = key ;
        break ;
      }

    var str = "<br>" ;
    
    for (var key of map.keys()) {
       str = str + 
       "<input class=\"postradiobutton\" type=\"radio\""
          + " style=\"margin-bottom: 0px;\""
          + " value=\"" + key + "\""
          + " episode_id=\"" + episode_id + "\""
          + " name=rb" + episode_id + ""
          + ((type == key) ? " checked=\"true\"" : "")
          + " />"
    }
  
    $(this).after(str) ;
  }
})

$(document).on('change', '.postradiobutton', function(e){
  var rb = $($($(this).parent()[0]).parent()[0]), val = this.value ;
  $.post(
    '/watch/set?episode_id=' + this.attributes['episode_id'].value,
    {type: this.value},
    function() {rb.toggleClass().toggleClass(map.get(val))}
  ) ;
});

$(document).on('change', '.postcheckbox', function(e){
  $.post('/follow/toggle?show_id=' + this.attributes['show_id'].value + '&widget=small', {}) ;
});

$(".calendar .entry").css("padding-bottom", "0px").css("padding-top", "0px") ;
$(".postcheckbox").css("margin-bottom", "0") ;
$(".row").css("max-width", "120rem") ;
$(".ad-margin-left").remove() ;
