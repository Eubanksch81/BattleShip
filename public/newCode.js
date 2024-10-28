window.onload = function() {
    let htmlCoords = document.getElementById("mainCoords1");
    let oStrCoords = ``;
    const ASCIIbase = 65;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; ++j) {
            let iValue = i + ASCIIbase;
            oStrCoords += `<button type="button" class="boxElement id="${String.fromCharCode(iValue)}${j}"}> ${String.fromCharCode(iValue)} </button>`;
        }
    }
    htmlCoords.innerHTML = oStrCoords;

    htmlCoords = document.getElementById("mainCoords2");
    oStrCoords = ``;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; ++j) {
            let iValue = i + ASCIIbase;
            oStrCoords += `<button type="button" class="boxElement id="${String.fromCharCode(iValue)}${j}"}> ${String.fromCharCode(iValue)} </button>`;
        }
    }
    htmlCoords.innerHTML = oStrCoords;
};