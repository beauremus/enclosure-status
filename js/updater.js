$(document).ready(function(){
  var encJson;
  var statJson;
  var entryJson;

  getAllEnclosures();
  
  function getAllEnclosures() {
    $.ajax(
    {
      url: 'http://www-bd.fnal.gov/EnclosureStatus/getAllEnclosures',
      dataType: 'json',
      timeout: 1000,
      ifModified: false,
      cache: false,
      success: function(json)
      {
        encJson = json;
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
        buildEnc(encJson);
        getAllStatuses();
      }
    });
  }
    
  function getAllStatuses() {
    $.ajax(
    {
      url: 'http://www-bd.fnal.gov/EnclosureStatus/getAllStatuses',
      dataType: 'json',
      timeout: 1000,
      ifModified: false,
      cache: false,
      success: function(json)
      {
        statJson = json;
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
        buildStat(statJson);
        getCurrentEntries();
      }
    });
  }
    
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
        setSelected(entryJson);
      }
    });
  }
    
  function buildEnc(json)
  {
    $.each(json, function(i, enclosure)
    {
      var $machSpan = $(document.createElement('span')).attr('name','enclosureName').attr('id',enclosure.id).append(enclosure.name);
      $('.form').append($machSpan);
      var $hidInput = $(document.createElement('input')).attr('type','hidden').attr('name','enclosureID').attr('value',enclosure.id);
      $('.form').append($hidInput);
      var $statSelect = $(document.createElement('select')).attr('name','statusID').attr('id',enclosure.id);
      $('.form').append($statSelect);
    });
  }

  function buildStat(json)
  {
    $.each(json, function(i, status)
    {
      var $option = $(document.createElement('option')).attr('name','statusID').attr('value',status.id).append(status.name);
      $("select[name='statusID']").append($option);
    }); 
    $("select[name='statusID']").change(function() {
      var enclosureID = $(this).attr('id');
      var statusID = $(this).find(':selected').val();
      console.log('enclosureID='+enclosureID+'&statusID='+statusID);
      $.ajax(
      {
        type: 'POST',
        url: 'http://www-bd.fnal.gov/EnclosureStatus/addEntry',
        async: true,
        dataType: 'text',
        data: 'enclosureID='+enclosureID+'&statusID='+statusID,
        success: function(text)
        {
          alert(text);
        },
        error: function(response)
        {
          alert(response.responseText);
        }
      });
    });
  }

  function setSelected(json)
  {
    $.each(json, function(i, entry)
    {
      var $option = $('select[id='+entry.enclosure.id+'] option[value='+entry.status.id+']');
      if (entry.status.id == $option.val())
      {
        $($option).attr('selected','selected');
      }
    });
  }
});