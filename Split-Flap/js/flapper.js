var globalJson;

$(document).ready(function(){
  getStatus();
});

function parseTable(json){
  $(flaps).html('');
  var maxRows = 27;
  var jsonLength = json.length;
  var numCols = Math.ceil(jsonLength / maxRows);
  var numRows = Math.ceil(jsonLength / numCols);
  var rowsOne = numRows;
  var rowsTwo = numRows + rowsOne;
  var l = 0;
  l = buildTable(json, l, rowsOne, maxRows);
  buildTable(json, l, rowsTwo, maxRows);
}

function buildTable(json, l, numRows, maxRows){
  var table = document.createElement('table');
  table.className = 'wrapper';
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');
  var tr;
  var tdEnc;
  var tdStat;
  var tdElap;
  var filledEnc;
  var filledStat;
  var filledElap;
  var thEnc = document.createElement('th');
  var thStat = document.createElement('th');
  var thElap = document.createElement('th');
  thEnc.appendChild(document.createTextNode('Enclosure'));
  thStat.appendChild(document.createTextNode('Status'));
  thElap.appendChild(document.createTextNode('Elapsed'));
  thead.appendChild(thEnc);
  thead.appendChild(thStat);
  thead.appendChild(thElap);
  for (l; l < numRows; l++)
  {
    if (json[l] != null)
    {
      var jsonStat = json[l];
      var enc = jsonStat.enclosure.name;
      var stat = jsonStat.status.name;
      tr = document.createElement('tr');
      tr.id = 'enc';
      tdEnc = document.createElement('td');
      tdEnc.className += 'flip-counter enc';
      tdStat = document.createElement('td');
      tdStat.className += 'flip-counter stat';
      tdElap = document.createElement('td');
      tdElap.className += 'flip-counter elap';
      filledEnc = drawLetter(fillSpace(enc,'enc').toUpperCase());
      filledStat = drawLetter(fillSpace(stat,'stat').toUpperCase());
      var changeDate = new Date(jsonStat.modifiedDate);
      filledElap = drawLetter(fillSpace(getElapsed(changeDate),'elap').toUpperCase());
      tdEnc.innerHTML = filledEnc;
      tdStat.innerHTML = filledStat;
      tdElap.innerHTML = filledElap;
      tr.appendChild(tdEnc);
      tdStat.className += colorCode(stat);
      tr.appendChild(tdStat);
      tr.appendChild(tdElap);
      tbody.appendChild(tr);
    } else {
      tr = document.createElement('tr');
      tr.id = 'spaces';
      tdEnc = document.createElement('td');
      tdEnc.className += 'flip-counter enc';
      tdStat = document.createElement('td');
      tdStat.className += 'flip-counter stat';
      tdElap = document.createElement('td');
      tdElap.className += 'flip-counter elap';
      filledEnc = drawLetter(fillSpace('','enc').toUpperCase());
      filledStat = drawLetter(fillSpace('','stat').toUpperCase());
      filledElap = drawLetter(fillSpace('','elap').toUpperCase());
      tdEnc.innerHTML = filledEnc;
      tdStat.innerHTML = filledStat;
      tdElap.innerHTML = filledElap;
      tr.appendChild(tdEnc);
      tr.appendChild(tdStat);
      tr.appendChild(tdElap);
      tbody.appendChild(tr);
    }
  }
  var space = Math.ceil(json.length / (Math.ceil(json.length / maxRows)));
  for (var m = 0; m < maxRows-space; m++)
  {
    tr = document.createElement('tr');
    tr.id = 'spaces';
    tdEnc = document.createElement('td');
    tdEnc.className += 'flip-counter enc';
    tdStat = document.createElement('td');
    tdStat.className += 'flip-counter stat';
    tdElap = document.createElement('td');
    tdElap.className += 'flip-counter elap';
    filledEnc = drawLetter(fillSpace('','enc').toUpperCase());
    filledStat = drawLetter(fillSpace('','stat').toUpperCase());
    filledElap = drawLetter(fillSpace('','elap').toUpperCase());
    tdEnc.innerHTML = filledEnc;
    tdStat.innerHTML = filledStat;
    tdElap.innerHTML = filledElap;
    tr.appendChild(tdEnc);
    tr.appendChild(tdStat);
    tr.appendChild(tdElap);
    tbody.appendChild(tr);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  $(flaps).append(table);
  return l;
}

function drawLetter(span){
  var html = '';
  var letters = span.split('');
  for (var i = 0; i < letters.length; i++)
  {
    html += '<li class="digit">'+
      '<div class="line"></div>'+
      '<span class="front">'+letters[i]+'</span>'+
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
      parseTable(globalJson);
      setTimeout('getStatus()',10000);
    }
  });
}