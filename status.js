'use strict';

const INTERVAL = 20000;
const FILE_STATUS = 'status/status';
const FILE_TIMESTAMP = 'status/timestamp';
const WRAPPER_MONITORING = 'monitoring';
const WRAPPER_TIMESTAMP = 'timestamp';

(() => {
    getStatus();
    getTimestamp();
    setInterval(() => { location.reload(); }, INTERVAL);
})();

function getStatus() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let content = xhr.responseText;
            if (content.length > 0) {
                console.log('found ' + FILE_STATUS);
                handleStatus(content);
            }
        }
    };
    xhr.onerror = () => {
        console.log('error: could not get ' + FILE_STATUS);
    };
    xhr.open('get', FILE_STATUS);
    xhr.send();
}

function getTimestamp() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let content = xhr.responseText;
            if (content.length > 0) {
                console.log('found ' + FILE_TIMESTAMP);
                handleTimestamp(content);
            }
        }
    };
    xhr.onerror = () => {
        console.log('error: could not get ' + FILE_TIMESTAMP);
    };
    xhr.open('get', FILE_TIMESTAMP);
    xhr.send();
}

function handleStatus(content) {
    let lines = content.split('\n');
    let sites = [];
    for (let i = 0; i < lines.length; i++) {
        let parts = lines[i].split(';');

        if (parts.length !== 2) {
            continue;
        }

        sites.push({
            url: parts[0],
            code: parts[1]
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

        // url
        let cellUrl = document.createElement('td');
        let anchor = document.createElement('a');
        let url = new URL(site.url);
        anchor.appendChild(document.createTextNode(url.hostname));
        anchor.href = site.url;
        anchor.target = '_blank';
        cellUrl.appendChild(anchor);

        // code
        let cellCode = document.createElement('td');
        cellCode.appendChild(document.createTextNode(site.code));

        // row
        let row = document.createElement('tr');
        row.classList.add('code-' + site.code);
        row.appendChild(cellUrl);
        row.appendChild(cellCode);
        table.appendChild(row);
    }

    wrapper.appendChild(table);
}
