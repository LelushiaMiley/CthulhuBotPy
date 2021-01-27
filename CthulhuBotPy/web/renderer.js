// Despite not actually working, throws an error at require, preload.js will,
// for some odd reason, not function as intended without this file containing what it does.


// const remote = require('electron').remote;
const { remote } = require('electron');
const { BrowserWindow } = remote;


const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

// When document has loaded, initialise
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

function handleWindowControls() {
    document.getElementById('restore-button').style.display="none";
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('max-button').addEventListener("click", event => {
        win.maximize();
        document.getElementById('restore-button').style.display="flex";
        document.getElementById('max-button').style.display="none";
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize();
        document.getElementById('restore-button').style.display="none";
        document.getElementById('max-button').style.display="flex";
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });
}