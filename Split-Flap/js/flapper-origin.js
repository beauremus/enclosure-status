function splitFlap(d, options){

	// Default values
	var defaults = {
		value: 0,
		inc: 1,
		pace: 1,
		auto: true
	};
	
	var div = d;
	
	var counter = options || {};
	var doc = window.document;
	
	var digitsOld = [], digitsNew = [], digitsAnimate = [], x, y, nextCount = null;
	
	for (var opt in defaults){
		counter[opt] = counter.hasOwnProperty(opt) ? counter[opt] : defaults[opt];
	}
	
	/**
	* Stops all running increments.
	*/
	function stop(){
		console.log(nextCount);
		if (nextCount) _clearNext();
		return this;
	}
	
	function _doCount(first){
		var first_run = typeof first === "undefined" ? false : first;
		x = counter.value;
		if (!first_run ) counter.value += counter.inc;
		y = counter.value;
		_digitCheck(x, y);
		// Do first animation
		if (counter.auto === true) nextCount = setTimeout(_doCount, counter.pace);
	}
	
	function _digitCheck(x, y){
		digitsOld = _toArray(x);
		digitsNew = _toArray(y);
		var ylen = digitsNew.length;
		for (var i = 0; i < ylen; i++){
			digitsAnimate[i] = digitsNew[i] != digitsOld[i];
		}
		_drawCounter();
	}
	
	function _toArray(input){
		return input.toString().split('').reverse();
	}

	// Sets the correct digits on load
	function _drawCounter(){
		var bit = 1, html = '', dNew, dOld;
		for (var i = 0, count = digitsNew.length; i < count; i++){
			dNew = digitsNew[i];
			dOld = digitsOld[i];
			html += '<li class="digit" id="'+d+'-digit-a'+i+'">'+
				'<div class="line"></div>'+
				'<span class="front">'+dNew+'</span>'+
				'<span class="back">'+dOld+'</span>'+
				'<div class="hinge">'+
				'<span class="front">'+dOld+'</span>'+
				'<span class="back">'+dNew+'</span>'+
				'</div>'+
				'</li>';
			if (bit !== count && bit % 3 === 0 && _isNumber(dNew)){
				html += '<li class="digit-delimiter">,</li>';
			}
			bit++;
		}
		
		$('.'+div).html(html);

		var alen = digitsAnimate.length;

		// Need a slight delay before adding the 'animate' class or else animation won't fire on FF
		setTimeout(function(){
		
			for (var i = 0; i < alen; i++){
				try
					{
						if (digitsAnimate[i] && $('#'+d+'-digit-a'+i).length !== 0){
							var a = doc.getElementById(d+'-digit-a'+i);
							a.className = a.className+' animate';
						}
					}
				catch(err)
					{
						console.log(err);
						break;
					}
			}
		}, 20);

	}
	
	function _isNumber(n){
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	function _clearNext(){
		clearTimeout(nextCount);
		nextCount = null;
	}

	// Start it up
	_doCount(true);

}
