$(document).ready(function(){
  var entryJson;

  getCurrentEntries();
    
  function getCurrentEntries() {
    $.ajax(
    {
      url: 'http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries',
      dataType: 'json',
      timeout: 1000,
      ifModified: false,
      cache: false,
      success: function(json)
      {
        entryJson = json;
      },
      error: function(xhr,status,error)
      {
        console.log('readyState: ' + xhr.readyState);
        console.log('responseText: '+ xhr.responseText);
        console.log('status: ' + xhr.status);
        console.log('text status: ' + status);
        console.log('error: ' + error);
      },
      complete: function()
      {
        buildStat(entryJson);
      }
    });
  }
    
  function buildStat(json)
  {
    var items = [];
    for(var i = 0; i < json.length/2; i++) {
    	var halfLength = Math.ceil(json.length/2);
	var j = i + halfLength; //<div class="encCont" id="row'+i+'">
	items.push('\
			<div style="clear:both;" class="enclosureName">'+json[i].enclosure.name+'</div>\
			<div class="statusName '+colorCode(json[i].status.name)+'">'+json[i].status.name+'</div>\
			<div class="black"></div>\
			<div class="enclosureName">'+json[j].enclosure.name+'</div>\
			<div class="statusName '+colorCode(json[j].status.name)+'">'+json[j].status.name+'</div>\
		');
    }
    
    $('<div>', {
    		id: "new",
		html: items.join('')
	}).appendTo("#container");
  }

  function colorCode(statName) {
    switch (statName) {
      case 'Undefined':
        return 'undef';
      case 'Controlled':
        return 'cntrl';
      case 'Supervised':
        return 'super';
      case 'Open':
        return 'open';
      case 'No Access':
        return 'noacs';
    }
  }
});
