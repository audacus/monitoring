'use strict';

const INTERVAL = 20000;
const FILE_STATUS = 'status/status';
const FILE_TIMESTAMP = 'status/timestamp';
const WRAPPER_MONITORING = 'monitoring';
const WRAPPER_TIMESTAMP = 'timestamp';
const CODES_OK = [200];
const CODES_ERROR = [500, 503, 504];
const TIME_THRESHOLD = 2000;

(() => {
    update();
    setInterval(update, INTERVAL);
})();

function update() {
    console.log('update');
    getStatus();
    getTimestamp();
}

function getFile(file, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let content = xhr.responseText;
            if (content.length > 0) {
                console.log('found ' + file);
                callback(content);
            }
        }
    };
    xhr.onerror = () => {
        console.log('error: could not get ' + file);
    };
    xhr.open('get', file);
    xhr.send();
}

function getStatus() {
    getFile(FILE_STATUS, handleStatus);
}

function getTimestamp() {
    getFile(FILE_TIMESTAMP, handleTimestamp);
}

function handleStatus(content) {
    let lines = content.split('\n');
    let sites = [];

    for (let i = 0; i < lines.length; i++) {
        let parts = lines[i].split(';');

        if (parts.length !== 3) {
            continue;
        }

        sites.push({
            url: parts[0],
            code: parts[1],
            time: parts[2]
        });
    }

    createTable(sites);
}

function handleTimestamp(content) {
    let wrapper = document.getElementById(WRAPPER_TIMESTAMP);

    if (!wrapper) {
        console.error('no #' + WRAPPER_TIMESTAMP + ' wrapper found!');
        return;
    }

    wrapper.innerHTML = '';
    wrapper.appendChild(document.createTextNode((new Date(content * 1000)).toLocaleString('de')));
}

function createTable(sites) {
    let wrapper = document.getElementById(WRAPPER_MONITORING);

    if (!wrapper) {
        console.error('no #' + WRAPPER_MONITORING + ' wrapper found!');
        return;
    }

    let table = document.createElement('table');
    for (let i = 0; i < sites.length; i++) {
        let site = sites[i];

        let url = new URL(site.url);
        let code = parseInt(site.code, 10);
        let time = parseInt(parseFloat(site.time) * 1000, 10);

        // url
        let cellUrl = document.createElement('td');
        cellUrl.classList.add('link')
        let anchor = document.createElement('a');
        anchor.appendChild(document.createTextNode(url.hostname));
        anchor.href = site.url;
        anchor.target = '_blank';
        cellUrl.appendChild(anchor);

        // code
        let cellCode = document.createElement('td');
        cellCode.classList.add('code')
        cellCode.appendChild(document.createTextNode(code));

        // time
        let cellTime = document.createElement('td');
        cellTime.classList.add('time')
        cellTime.appendChild(document.createTextNode(time + ' ms'));
        if (time > TIME_THRESHOLD) {
            cellTime.classList.add('slow');
        }

        // row
        let row = document.createElement('tr');
        row.classList.add('code-' + code);

        if (~CODES_OK.indexOf(code)) {
            row.classList.add('ok');
        } else if (~CODES_ERROR.indexOf(code)) {
            row.classList.add('error');
        }

        row.appendChild(cellUrl);
        row.appendChild(cellCode);
        row.appendChild(cellTime);
        table.appendChild(row);
    }

    wrapper.innerHTML = '';
    wrapper.appendChild(table);
}
