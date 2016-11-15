(function(){
    console.log('this: ',this);
    console.log('window: ',window);

    window.sort = true;

    init();

    document.querySelector('#updateHeader').addEventListener('click', toggleSort, false);
})();

function init() {
    document.querySelector('#updaterContainer').innerHTML = '';

    let url = 'http://www-bd.fnal.gov/EnclosureStatus/';

    fetch(url + 'getAllEnclosures')
        .then(function(response) {
            response.json().then(function(allEnclosures) {
                console.log('window.sort: ',window.sort);
                console.log('allEnclosures: ',allEnclosures);

                if (window.sort) {
                    allEnclosures = sortObjectArray(allEnclosures);
                }

                console.log('allEnclosures: ',allEnclosures);

                buildEnclosures(allEnclosures);
            });
            fetch(url + 'getAllStatuses')
                .then(function(response) {
                    response.json().then(function(allStatuses) {
                        buildStatuses(allStatuses);
                    });
                    fetch(url + 'getCurrentEntries')
                        .then(function(response) {
                            response.json().then(function(currentEntries) {
                                setSelected(currentEntries);
                            });
                        });
                });
        });
}

function toggleSort() {
    window.sort = !window.sort;
    init();
}

function sortObjectArray(array) {
    if (array === undefined) {
        array = [];
    }

    array.sort(function(a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    });

    return array;
}

function buildEnclosures(json) {
    for (enclosure of json) {
        let encSpan = document.createElement('span'),
            statSelect = document.createElement('select');

        encSpan.setAttribute('name','enclosureName');
        encSpan.id = enclosure.id;
        encSpan.textContent = enclosure.name;

        statSelect.setAttribute('name','statusID');
        statSelect.id = enclosure.id;

        document.querySelector('#updaterContainer').appendChild(encSpan);
        document.querySelector('#updaterContainer').appendChild(statSelect);
    }
}

function buildStatuses(json) {
    let selects = document.querySelectorAll('select[name="statusID"]');

    for (select of selects) {
        for (stat of json) {
            let option = document.createElement('option');

            option.setAttribute('name','statusID');
            option.value = stat.id;
            option.textContent = stat.name;

            select.appendChild(option);
        }

        select.addEventListener('change', updateStatus, false);
    }
}

function setSelected(json) {
    for (entry of json) {
        document.querySelector(`select[id="${entry.enclosure.id}"] option[value="${entry.status.id}"]`).setAttribute('selected','selected');
    }
}

function updateStatus(response) {
    let enclosureID = response.target.id,
        statusID = response.target.selectedOptions[0].value,
        enclosureName = response.target.previousSibling.textContent,
        statusName = response.target.selectedOptions[0].textContent;

    let url = `http://www-bd.fnal.gov/EnclosureStatus/addEntry?enclosureID=${enclosureID}&statusID=${statusID}`;

    fetch(url,{method: 'POST'})
        .then((value) => {console.log(value);alert(`Successfully changed ${enclosureName} to ${statusName}`);})
        .catch((err) => {console.log(err);alert("ERROR");});
}
