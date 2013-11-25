var flipCounter = function(d, options){

  // Default values
  var defaults = {
    value: 500,
    inc: 1,
    pace: 1000,
    auto: true
  };

  var counter = options || {};
  var doc = window.document;

  for (var opt in defaults){
    counter[opt] = counter.hasOwnProperty(opt) ? counter[opt] : defaults[opt];
  }

  var digitsOld = [], digitsNew = [], digitsAnimate = [], x, y, nextCount = null;

	console.log($('.'+d));
  var div = d;

  // Sets the correct digits on load
  function _drawCounter(){
    var bit = 1, html = '', dNew, dOld;
    for (var i = 0, count = digitsNew.length; i < count; i++){
      dNew = digitsNew[i] : '';
      dOld = digitsOld[i] : '';
      html += '<li class="digit" id="'+d+'-digit-a'+i+'">'+
        '<div class="line"></div>'+
        '<span class="front">'+dNew+'</span>'+
        '<span class="back">'+dOld+'</span>'+
        '<div class="hinge">'+
        '<span class="front">'+dOld+'</span>'+
        '<span class="back">'+dNew+'</span>'+
        '</div>'+
        '</li>';
      if (bit !== count && bit % 3 === 0){
        html += '<li class="digit-delimiter">,</li>';
      }
      bit++;
    };
    $(div).append(html);

    var alen = digitsAnimate.length;

    // Need a slight delay before adding the 'animate' class or else animation won't fire on FF
    setTimeout(function(){
      for (var i = 0; i < alen; i++){
        if (digitsAnimate[i]){
          var a = doc.getElementById(d+'-digit-a'+i);
          a.className = a.className+' animate';
        }
      }
    }, 20);

  };
};
