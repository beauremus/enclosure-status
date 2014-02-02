var globalJson;
var totRows = 27; //Set number of rows in each column
var totCols = 2; //Set number of columns

$(document).ready(function(){
  buildTable();
  getStatus();
});

function buildTable(){
  $(flaps).html('');
  for (var tC = 0; tC < totCols; tC++)
  {
    var table = document.createElement('table');
    table.className = 'wrapper';
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var thRow = '<th>Enclosure</th><th>Status</th><th>Elapsed</th>';
    thead.innerHTML += thRow;
    for (var tR = 0; tR < totRows; tR++)
    {
      var filledEnc = drawLetter(fillSpace('','enc'));
      var filledStat = drawLetter(fillSpace('','stat'));
      var filledElap = drawLetter(fillSpace('','elap'));
      var row = '<tr id="col'+tC+'row'+tR+'">'+
                  '<td class="flip-counter enc">'+filledEnc+'</td>'+
                  '<td class="flip-counter stat">'+filledStat+'</td>'+
                  '<td class="flip-counter elap">'+filledElap+'</td>'+
                '</tr>';
      tbody.innerHTML += row;
    }
    table.appendChild(thead);
    table.appendChild(tbody);
    $(flaps).append(table);
  }
}

function parseStatus(json){
  var jsonLength = json.length;
  var numRows = Math.ceil(jsonLength / totCols);
  var rowsOne = numRows;
  var rowsTwo = numRows + rowsOne;
  var l = 0;
  l = fillTable(json, l, rowsOne, 0);
  fillTable(json, l, rowsTwo, 1);
}

function fillTable(json, l, numColRows, columnNumber){
  var m =0;
  for (l; l < numColRows; l++)
  {
    if (json[l] != null)
    {
      var jsonStat = json[l];
      var enc = jsonStat.enclosure.name;
      var row = document.getElementById('col'+columnNumber+'row'+m);
      row.id += ' '+enc;
      var stat = jsonStat.status.name;
      var filledEnc = drawLetter(fillSpace(enc,'enc').toUpperCase());
      var filledStat = drawLetter(fillSpace(stat,'stat').toUpperCase());
      var changeDate = new Date(jsonStat.modifiedDate);
      var filledElap = drawLetter(fillSpace(getElapsed(changeDate),'elap').toUpperCase());
      var encCell = row.querySelector('.enc');
      encCell.innerHTML = filledEnc;
      var statCell = row.querySelector('.stat');
      statCell.innerHTML = filledStat;
      statCell.className += colorCode(stat);
      var elapCell = row.querySelector('.elap');
      elapCell.innerHTML = filledElap;
    }
    m++;
  }
  return l;
}

function drawLetter(span){
  var html = '';
  var letters = span.split('');
  for (var i = 0; i < letters.length; i++)
  {
    html += '<li class="digit" id="'+i+'">'+
            '<div class="line"></div>'+
            '<span class="back">'+letters[i]+'</span>'+
            '<div class="hinge">'+
            '<span class="front">'+letters[i]+'</span>'+
            '</div>'+
            '</li>';
  }
  return html;
}

function fillSpace(filStr,filKey){
  var fill = '               '; //15 spaces
  var encLength = 11;
  var statusLength = 11;
  var elapsedLength = 3;
  var diff;
  var space;
  switch (filKey)
  {
    case 'enc':
      if (filStr.length < encLength)
      {
        diff = encLength - filStr.length;
        space = fill.substring(0,diff);
        filStr += space;
        filStr = filStr.substring(0,encLength);
      }
      return filStr;
    case 'stat':
      if (filStr.length < statusLength)
      {
        diff = statusLength - filStr.length;
        space = fill.substring(0,diff);
        filStr += space;
        filStr = filStr.substring(0,statusLength);
      }
      return filStr;
    case 'elap':
      if (filStr.length < elapsedLength)
      {
        diff = elapsedLength - filStr.length;
        space = fill.substring(0,1);
        for (var i = diff - 1; i >= 0; i--)
        {
          filStr = space + filStr;
          filStr = filStr.substring(0,elapsedLength);
        }
      }
      return filStr;
  }
}

function getElapsed(changeTime){
  var curTime = new Date().getTime();
  var elapMS = (curTime - changeTime);
  var minMS = 60000, hourMS = 3600000, dayMS = 86400000, weekMS = 604800000, yearMS = 31557600000;
  var elapTime;
  //Deliminate M-minutes, H-hours, D-days, W-weeks
  if (elapMS < hourMS)//minutes
  {
    elapTime = Math.floor(elapMS / minMS).toString() + 'M';
  }
  else if (elapMS < dayMS)//hours
  {
    elapTime = Math.floor(elapMS / hourMS).toString() + 'H';
  }
  else if (elapMS < weekMS)//days
  {
    elapTime = Math.floor(elapMS / dayMS).toString() + 'D';
  }
  else if (elapMS > weekMS)//weeks
  {
    elapTime = Math.floor(elapMS / weekMS).toString() + 'W';
  }
  else if (elapMS > yearMS)//more than a year
  {
    elapTime = '>1Y'
  }
  else
  {
    elapTime = '????';
  }
  return elapTime;
}

function colorCode(statName) {
  switch (statName)
  {
    case 'Undefined':
      return ' undef';
    case 'Controlled':
      return ' cntrl';
    case 'Supervised':
      return ' super';
    case 'Open':
      return ' open';
    case 'No Access':
      return ' noacs';
  }
}

function getStatus() {
  $.ajax(
  {
    url: 'http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries',
    beforeSend: function(xhr){
      if (xhr.overrideMimeType)
      {
        xhr.overrideMimeType('application/json');
      }
    },
    dataType: 'json',
    timeout: 1000,
    ifModified: true,
    cache: false,
    success: function(json,status,response)
    {
      $('h1').css('color','white');
      if (response.status == 200)
      {
        globalJson = json;
      } else {
        console.log(response.status);
      }
    },
    error: function(xhr,status,error)
    {
      $('h1').css('color','red');
      console.log('readyState: ' + xhr.readyState);
      console.log('responseText: '+ xhr.responseText);
      console.log('status: ' + xhr.status);
      console.log('text status: ' + status);
      console.log('error: ' + error);
    },
    complete: function(response)
    {
      parseStatus(globalJson);
      setTimeout('getStatus()',10000);
    }
  });
}