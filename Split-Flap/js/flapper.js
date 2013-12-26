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
	var $table = $(document.createElement('table')).addClass('wrapper');
	var $thead = $(document.createElement('thead'));
	var $tbody = $(document.createElement('tbody'));
	$table.append($thead);
	var header = '<th>Enclosure</th><th>Status</th><th>Elapsed</th>';
	$thead.append(header);
	for (l; l < numRows; l++)
	{
		if (json[l] != null)
		{
			var jsonStat = json[l];
			var enc = jsonStat.enclosure.name;
			var stat = jsonStat.status.name;
			var $tr = $(document.createElement('tr')).attr('id',enc);
			var $tdEnc = $(document.createElement('td')).addClass('flip-counter enc');
			var $tdStat = $(document.createElement('td')).addClass('flip-counter stat');
			var $tdElap = $(document.createElement('td')).addClass('flip-counter elap');
			var filledEnc = fillSpace(enc,'enc');
			var filledStat = fillSpace(stat,'stat');
			var changeDate = new Date(jsonStat.modifiedDate);
			var filledElap = fillSpace(getElapsed(changeDate),'elap');
			$tdEnc.append(drawLetter(filledEnc.toUpperCase()));
			$tdStat.append(drawLetter(filledStat.toUpperCase()));
			$tdElap.append(drawLetter(filledElap.toUpperCase()));
			$tr.append($tdEnc);
			$tdStat.addClass(colorCode(stat));
			$tr.append($tdStat);
			$tr.append($tdElap);
			$tbody.append($tr);
		} else {
			var $tr = $(document.createElement('tr')).attr('id','spaces');
			var $tdEnc = $(document.createElement('td')).addClass('flip-counter enc');
			var $tdStat = $(document.createElement('td')).addClass('flip-counter stat');
			var $tdElap = $(document.createElement('td')).addClass('flip-counter elap');
			var filledEnc = fillSpace('','enc');
			var filledStat = fillSpace('','stat');
			var filledElap = fillSpace('','elap');
			$tdEnc.append(drawLetter(filledEnc.toUpperCase()));
			$tdStat.append(drawLetter(filledStat.toUpperCase()));
			$tdElap.append(drawLetter(filledElap.toUpperCase()));
			$tr.append($tdEnc);
			$tr.append($tdStat);
			$tr.append($tdElap);
			$tbody.append($tr);
		}
	}
	var space = Math.ceil(json.length / (Math.ceil(json.length / maxRows)));
	for (var m = 0; m < maxRows-space; m++)
	{
		var $tr = $(document.createElement('tr')).attr('id','spaces');
		var $tdEnc = $(document.createElement('td')).addClass('flip-counter enc');
		var $tdStat = $(document.createElement('td')).addClass('flip-counter stat');
		var $tdElap = $(document.createElement('td')).addClass('flip-counter elap');
		var filledEnc = fillSpace('','enc');
		var filledStat = fillSpace('','stat');
		var filledElap = fillSpace('','elap');
		$tdEnc.append(drawLetter(filledEnc.toUpperCase()));
		$tdStat.append(drawLetter(filledStat.toUpperCase()));
		$tdElap.append(drawLetter(filledElap.toUpperCase()));
		$tr.append($tdEnc);
		$tr.append($tdStat);
		$tr.append($tdElap);
		$tbody.append($tr);
	}
	$table.append($tbody);
	$(flaps).append($table);
	return l;
}

function drawLetter(span){
	var html = '';
	var letters = span.split('');
	for (var i = 0; i < letters.length; i++)
	{
		html += '<li class="digit">'+
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
	var elapsedLength = 4;
	switch (filKey)
	{
		case 'enc':
			if (filStr.length < encLength)
			{
				var diff = encLength - filStr.length;
				var space = fill.substring(0,diff);
				filStr += space;
				filStr = filStr.substring(0,encLength);
			}
			return filStr;
			break;
		case 'stat':
			if (filStr.length < statusLength)
			{
				var diff = statusLength - filStr.length;
				var space = fill.substring(0,diff);
				filStr += space;
				filStr = filStr.substring(0,statusLength);
			}
			return filStr;
			break;
		case 'elap':
			if (filStr.length < elapsedLength)
			{
				var diff = elapsedLength - filStr.length;
				var space = fill.substring(0,1);
				for (var i = diff - 1; i >= 0; i--)
				{
					filStr = space + filStr;
					filStr = filStr.substring(0,elapsedLength);
				}
			}
			return filStr;
			break;
	}
}

function getElapsed(changeTime){
	var curTime = new Date().getTime();
	var elapMS = (curTime - changeTime);
	var minMS = 60000, hourMS = 3600000, dayMS = 86400000, weekMS = 604800000;
	//Deliminate M-minutes, H-hours, D-days, W-weeks
	if (elapMS < hourMS)//minutes
	{
		var elapTime = Math.floor(elapMS / minMS).toString() + 'M';
	}
	else if (elapMS < dayMS)//hours
	{
		var elapTime = Math.floor(elapMS / hourMS).toString() + 'H';
	}
	else if (elapMS < weekMS)//days
	{
		var elapTime = Math.floor(elapMS / dayMS).toString() + 'D';
	}
	else if (elapMS > weekMS)//weeks
	{
		var elapTime = Math.floor(elapMS / weekMS).toString() + 'W';
	}
	else
	{
		var elapTime = '????';
	}
	return elapTime;
}

function getStatus() {
	$.ajax(
	{
		url: 'http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries',
		dataType: 'json',
		timeout: 1000,
		ifModified: true,
		cache: false,
		success: function(json, status, response)
		{
			$('h1').css('color','white');
			if (response.status == 200)
			{
				globalJson = json;
			}
			else
			{
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

function colorCode(statName) {
	switch (statName)
	{
		case 'Undefined':
			return 'undef';
			break;
		case 'Controlled':
			return 'cntrl';
			break;
		case 'Supervised':
			return 'super';
			break;
		case 'Open':
			return 'open';
			break;
		case 'Closed':
			return 'closed';
			break;
	}
}