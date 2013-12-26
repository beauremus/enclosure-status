$(document).ready(function(){
 	$.ajax(
	{
		url: 'json/encstat.json', //http://dpe01.fnal.gov:8000/EnclosureStatus/getEnclosuresStatuses
		beforeSend: function(xhr){
		if (xhr.overrideMimeType)
		{
		  xhr.overrideMimeType("application/json");
		}
		},
		dataType: 'json',
		success: function(json)
		{
			buildTable(json);
		},
		error: function(xhr,status,error)
		{
			alert('An error has occured. Please check the browser log for more information.');
			console.log('readyState: ' + xhr.readyState);
			console.log('responseText: '+ xhr.responseText);
			console.log('status: ' + xhr.status);
			console.log('text status: ' + status);
			console.log('error: ' + error);
		}
	});
	
	function buildTable(json){
		$(flaps).html('');
		var $table = $(document.createElement('table'));
		var $thead = $(document.createElement('thead'));
		var $tbody = $(document.createElement('tbody'));
		$table.append($thead);
		var header = '<th>Time</th><th>Enclosure</th>Status<th></th><th>Elapsed</th>';
		$th.text(header);
		$thead.append($th);
		$.each(json, function(i, enclosure)
		{
			/*if (i == 'headers'){
				var headKeys = Object.keys(json.headers);
				for (var h = 0; h < headKeys.length; h++)
				{
					var hK = headKeys[h];
					$th = $(document.createElement('th'));
					var header = json.headers[hK];
					$th.text(header);
					$thead.append($th);
				}
			}*/
			//else if (i == 'encstats'){
				var encstatKeys = Object.keys(json.encstats);
				for (var k = 0; k < encstatKeys.length; k++)
				{
					var $tr = $(document.createElement('tr')).addClass('wrapper');
					$tr.attr('id',json.encstats[k].enc);
					var encKeys = Object.keys(json.encstats[k]);
					for (var j = 0; j < encKeys.length; j++)
					{
						var key = encKeys[j];
						console.log(encKeys[j]);
						var $td = $(document.createElement('td')).addClass('flip-counter small '+key);
						var stat = json.encstats[k][key];
						console.log('Key '+key+' Stat '+stat);
						var filledSpan = fillSpace(stat,key);
						console.log(filledSpan);
						var draw = drawLetter(filledSpan);
						$td.append(draw);
					}
					$tr.append($td);
				}
				$tbody.append($tr);
			//}
		});
		$table.append($tbody);
		$(flaps).append($table);
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
		var timeLength = 11;
		var encLength = 15;
		var statusLength = 17;
		var elapsedLength = 4;
		console.log('filStr '+filStr+' filKey '+filKey);
		switch (filKey)
		{
			case 'time':
				if (filStr.length < timeLength)
				{
					var diff = timeLength - filStr.length;
					var space = fill.substring(0,diff);
					filStr += space;
				}
				console.log('here');
				return filStr;
				break;
			case 'enc':
				if (filStr.length < encLength)
				{
					var diff = encLength - filStr.length;
					var space = fill.substring(0,diff);
					filStr += space;
				}
				return filStr;
				break;
			case 'stat':
				if (filStr.length < statusLength)
				{
					var diff = statusLength - filStr.length;
					var space = fill.substring(0,diff);
					filStr += space;
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
					}
				}
				return filStr;
				break;
		}
	}
});