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
    $.each(json, function(i, entry)
    {
      var $machSpan = $(document.createElement('span')).attr('name','enclosureName').append(entry.enclosure.name);
      $('.simple').append($machSpan);
      var $statSpan = $(document.createElement('span')).attr('name','statusName').attr('class',colorCode(entry.status.name)).append(entry.status.name);
      $('.simple').append($statSpan);
    });
  }

  function colorCode(statName) {
    switch (statName)
    {
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