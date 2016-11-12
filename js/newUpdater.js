function getEnclosureStatus(request) {
    // Check browser for fetch capability
    if (!self.fetch) {
        alert('This browser does not support fetch.');
        return;
    }

    let url = 'http://www-bd.fnal.gov/EnclosureStatus/' + request;

    fetch(url)
      .then(function(response){
          if (!response.ok) {
              console.log('ERROR: Response not OK');
              return;
          }
          response.json()
            .then((json) => json);
      });
}

function sortObjectArray(array) {
    array.sort(function(a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    });
}

function buildEnclosures(json) {
    for (let entry of json) {
        let enclosure = entry.enclosure,
            encSpan = document.createElement('span'),
            statSelect = document.createElement('select');

        encSpan.setAttribute('name') = 'enclosureName';
        encSpan.id = enclosure.id;
        encSpan.textContent = enclosure.name;

        statSelect.setAttribute('name') = 'statusID';
        statSelect.id = enclosure.id;

        document.querySelector('#container').appendChild(encSpan);
        document.querySelector('#container').appendChild(statSelect);
    }
}
