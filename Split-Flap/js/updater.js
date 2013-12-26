$(document).ready(function(){

	$('body').html('');
	var $header = $(document.createElement('h1'));
	$header.append('Enclosure Status - Updater');
	$('body').append($header);
	var $div = $(document.createElement('div')).attr('class','form');
	
	$.ajax(
	{
		url: 'http://www-bd.fnal.gov/EnclosureStatus/getAllEnclosures',
		dataType: 'json',
		success: function(json)
		{
			buildEnc(json);
		},
		error: function(xhr,status,error)
		{
			console.log('readyState: ' + xhr.readyState);
			console.log('responseText: '+ xhr.responseText);
			console.log('status: ' + xhr.status);
			console.log('text status: ' + status);
			console.log('error: ' + error);
		}
	});
	
	$.ajax(
	{
		url: 'http://www-bd.fnal.gov/EnclosureStatus/getAllStatuses',
		dataType: 'json',
		success: function(json)
		{
			buildStat(json);
		},
		error: function(xhr,status,error)
		{
			console.log('readyState: ' + xhr.readyState);
			console.log('responseText: '+ xhr.responseText);
			console.log('status: ' + xhr.status);
			console.log('text status: ' + status);
			console.log('error: ' + error);
		}
	});
	
	$.ajax(
	{
		url: 'http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries',
		dataType: 'json',
		success: function(json)
		{
			setSelected(json);
		},
		error: function(xhr,status,error)
		{
			console.log('readyState: ' + xhr.readyState);
			console.log('responseText: '+ xhr.responseText);
			console.log('status: ' + xhr.status);
			console.log('text status: ' + status);
			console.log('error: ' + error);
		}
	});
	
	function buildEnc(json)
	{
		$.each(json, function(i, enclosure)
		{
			var $machSpan = $(document.createElement('span')).attr('name','enclosureName').attr('id',enclosure.id).append(enclosure.name);
			$div.append($machSpan);
			var $hidInput = $(document.createElement('input')).attr('type','hidden').attr('name','enclosureID').attr('value',enclosure.id);
			$div.append($hidInput);
			var $statSelect = $(document.createElement('select')).attr('name','statusID').attr('id',enclosure.id);
			$div.append($statSelect);
			$('body').append($div);
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