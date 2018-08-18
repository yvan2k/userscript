// ==UserScript==
// @name        Streamline tvmaze calendar
// @namespace   tvmaze
// @include     /^https?:\/\/www\.tvmaze\.com\/calendar/
// @downloadURL https://github.com/yvan2k/userscript/blob/master/tvmaze_calendar.user.js?raw=true
// @updateURL   https://github.com/yvan2k/userscript/blob/master/tvmaze_calendar.user.js?raw=true
// @version     2
// @grant       none
// ==/UserScript==

map = new Map([
        ["",  "entry "],
        ["1", "entry acquired"],
        ["0", "entry watched"],
        ["2", "entry skipped"]
      ]) ;

$(".show-wrap").each(function () {
  var links = $(this).find("a") ;
  var show_id = links[0].href.split("\/")[4] ;
  var episode_id = links[1].href.split("\/")[4] ;
  $(links[0]).before("<input class=\"postcheckbox\" type=\"checkbox\" checked show_id=\"" + show_id + "\" >") ;
  var str = "" ;

  if (/x01$/.test($(links[1]).text()))
    $(links[0]).attr("style", "background-color: " + (/^1x/.test($(links[1]).text()) ? "plum" : "lightpink") + ";" /*+ "font-size: 14px; font-weight: bold;"*/) ;

  for (var [key, value] of map)
    if ($(this).parent()[0].attributes["class"].value == value) {
      var type = key ;
      console.log(type) ;
      break ;
    }

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

  $(this).prepend(str) ;
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
$(".cinereus").parent()[1].remove() ;
