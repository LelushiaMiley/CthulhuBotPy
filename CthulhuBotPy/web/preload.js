// Duplicate of renderer.js; loaded at a different time
// Required due to a weird bug or something

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

    document.getElementById('close-button').addEventListener("mouseover", event => {
        document.getElementById('close-img').setAttribute("srcset", "Images/Icons/close-w-10.png 1x, Images/Icons/close-w-12.png 1.25x, Images/Icons/close-w-15.png 1.5x, Images/Icons/close-w-15.png 1.75x, Images/Icons/close-w-20.png 2x, Images/Icons/close-w-20.png 2.25x, Images/Icons/close-w-24.png 2.5x, Images/Icons/close-w-30.png 3x, Images/Icons/close-w-30.png 3.5x");
    });

    document.getElementById('close-button').addEventListener("mouseout", event => {
        document.getElementById('close-img').setAttribute("srcset", "Images/Icons/close-k-10.png 1x, Images/Icons/close-k-12.png 1.25x, Images/Icons/close-k-15.png 1.5x, Images/Icons/close-k-15.png 1.75x, Images/Icons/close-k-20.png 2x, Images/Icons/close-k-20.png 2.25x, Images/Icons/close-k-24.png 2.5x, Images/Icons/close-k-30.png 3x, Images/Icons/close-k-30.png 3.5x");
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });
}