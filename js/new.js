/**
 * @fileoverview Display current status of Fermi Enclosures from OAC
 * @author beau@fnal.gov (Beau Harrison)
 */

// Self executing function as initializer
(function(){
    getEnclosureStatus();
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

// http://www-bd.fnal.gov/EnclosureStatus/getCurrentEntries
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(function(response){
          response.json()
            .then(function(json){
                // Call json parser
                console.log(splitArray(json, 4));
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
        for (let i = 0; i < bins; i++) {
            outputArray.push([]);
            for (let j = 0; j < countInBins; j++) {
                outputArray[i].push(inputArray[i+j]);
            }
        }
    } else {
        let overflow = totalLength % bins;

        for (let i = 0; i < bins; i++) {
            outputArray.push([]);

            if (i < overflow) {
                for (let j = 0; j < countInBins + 1; j++) {
                    outputArray[i].push(inputArray[i+j]);
                }
            } else {
                for (let j = 0; j < countInBins; j++) {
                    outputArray[i].push(inputArray[i+j]);
                }
            }
        }
    }

    return outputArray;
}
