/**
 * @fileoverview Display current status of Fermi Enclosures from OAC
 * @author beau@fnal.gov (Beau Harrison)
 */

const TOTAL_COLUMNS = 3;

// Self executing function as initializer
(function(){
    getEnclosureStatus();
    setInterval('getEnclosureStatus()',10000);
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
    fetch(`http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries?${new Date().getTime()}`) // Date argument for cache busting
      .then(function(response){
          if (!response.ok) {
              errorState("Response not OK");
              return;
          }
          let lastDate = getTimeFromDate(response.headers.get('date'));
          response.json()
            .then(function(json){
                document.getElementById('mainContainer').innerHTML = '';

                buildColumns(appendAppStatus(splitArray(json, TOTAL_COLUMNS),lastDate));

                successState(lastDate);
            })
      })
      .catch(function(error) {
        errorState(error);
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
            }
        }
    } else {
        let overflow = totalLength % bins,
            index = 0;

        for (let i = 0; i < bins; i++) {
            outputArray.push([]);

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
        container = document.getElementById('mainContainer');

    for (let i = 0; i < columnCount; i++) {
        let column = document.createElement('div');

        column.className = 'column';

        for (let object of inputArray[i]) {
            let row = document.createElement('div'),
                enclosure = document.createElement('div'),
                status = document.createElement('div');

            row.className = 'row';
            enclosure.className = 'enclosure';
            status.className = 'status';
            status.className += ' ' + colorCode(object.status.name);

            enclosure.textContent = nameFilter(object.enclosure.name);
            status.textContent = object.status.name;

            if (object.enclosure.name === 'App Status:') {
                enclosure.id = 'appStatusLabel';
                status.id = 'appStatus';
            }

            row.appendChild(enclosure);
            row.appendChild(status);
            column.appendChild(row);
        }

        container.appendChild(column);
    }
}

function appendAppStatus(statusArray,time) {
    statusArray[statusArray.length - 1].push(
        {
            "status": {
                "name":time
            },
            "enclosure": {
                "name":"App Status:"
            },
        }
    );
    return statusArray;
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

function nameFilter(name) {
    const REPLACEMENTS = ['MINOS Alc','MINOS Abs','Xport US/DS','Xport Mid'];
    const TO_REPLACE = ['MINOS Alcoves','MINOS Absorber','Transport US/DS','Transport Mid'];

    let index = TO_REPLACE.indexOf(name);

    if (index > -1) {
        name = REPLACEMENTS[index];
    }

    return name;
}

function errorState(error) {
    document.body.style.background = 'red';
    document.querySelector('#appStatus').className = 'noacs';
    document.querySelector('#appStatus').textContent = 'No response';
    console.log(`ERROR: ${error}`);
}

function successState(time) {
    document.body.style.background = 'black';
    document.querySelector('#appStatus').className = 'super';
    document.querySelector('#appStatus').textContent = time;
}

function getTimeFromDate(dateString) {
    let d = new Date(dateString);

    //let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    //let localDate = new Date(utc + (3600000*-6));

    //let localDateString = localDate.toString();
    let localDateString = d.toString();

    return localDateString.split(' ')[4];
}
