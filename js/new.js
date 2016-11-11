/**
 * @fileoverview Display current status of Fermi Enclosures from OAC
 * @author beau@fnal.gov (Beau Harrison)
 */

const TOTAL_COLUMNS = 2;

// Self executing function as initializer
(function(){
    getEnclosureStatus();
    setInterval('getEnclosureStatus()',60000);
})();

/**
 * [getEnclosureStatus description]
 * @return {[type]} [description]
 */
function getEnclosureStatus() {
    // Check browser for fetch capability
    if (!self.fetch) {
        alert('This browser does not support fetch.');
        return;
    }

// https://jsonplaceholder.typicode.com/users
// http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries
    fetch('http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries')
      .then(function(response){
          if (!response.ok) {
              document.body.style.background = 'red';
              console.log('ERROR: Response not OK');
              return;
          }
          response.json()
            .then(function(json){
                document.getElementById('container').innerHTML = '';
                console.log(splitArray(json, TOTAL_COLUMNS));
                buildColumns(splitArray(json, TOTAL_COLUMNS));
                document.body.style.background = 'black';
            })
      });
}

// Consider making this method an extension of the Array.prototype
function splitArray(inputArray, bins) {
    if (!Array.isArray(inputArray) || !Number.isInteger(bins) || !(bins > 0)) {
        return null;
    }

    let totalLength = inputArray.length,
        countInBins = totalLength / bins,
        outputArray = [];

    if (Number.isInteger(countInBins)) {
        let index = 0;

        for (let i = 0; i < bins; i++) {
            outputArray.push([]);
            for (let j = 0; j < countInBins; j++) {
                outputArray[i].push(inputArray[index++]);
                console.log('inputArray[index]: ',inputArray[index]);
            }
        }
    } else {
        let overflow = totalLength % bins,
            index = 0;

        for (let i = 0; i < bins; i++) {
            outputArray.push([]);

// TODO: figure out why there are extra empty arrays
            if (i < overflow) {
                for (let j = 0; j < countInBins; j++) {
                    outputArray[i].push(inputArray[index++]);
                }
            } else {
                for (let j = 0; j < countInBins - 1; j++) {
                    outputArray[i].push(inputArray[index++]);
                }
            }
        }
    }

    return outputArray;
}

function buildColumns(inputArray) {
    let columnCount = inputArray.length,
        container = document.getElementById('container');

    for (let i = 0; i < columnCount; i++) {
        let column = document.createElement('div');

        column.className = 'column';

        console.log('inputArray: ',inputArray);

        for (let object of inputArray[i]) {
            let row = document.createElement('div'),
                enclosure = document.createElement('div'),
                status = document.createElement('div');

            row.className = 'row';
            enclosure.className = 'enclosure';
            status.className = 'status';
            status.className += ' ' + colorCode(object.status.name);

            enclosure.textContent = object.enclosure.name;
            status.textContent = object.status.name;

            row.appendChild(enclosure);
            row.appendChild(status);
            column.appendChild(row);
        }

        container.appendChild(column);
    }
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