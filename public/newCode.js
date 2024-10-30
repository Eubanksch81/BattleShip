window.onload = function() {
    let htmlCoords = document.getElementById("mainCoords1");
    let oStrCoords = ``;

    for (let m = 1; m < 3; ++m) {
        for (let i = 0; i < 10; i++) { //Populates Main arrays. i is x, y is j.
            for (let j = 0; j < 10; ++j) {
                let iValue = i + 65;
                let idName = m.toString() + String.fromCharCode(iValue) + j.toString();
                // console.log(idName);
                oStrCoords += `<button type="button" class="boxElement" id="${idName}"> ${String.fromCharCode(iValue)} </button>`;
            }
        }
        htmlCoords.innerHTML = oStrCoords;
        htmlCoords = document.getElementById("mainCoords2");
        oStrCoords = ``;
    }

    const buttons = document.querySelectorAll(".boxElement");
    buttons.forEach(button => {
        button.addEventListener("click", getCoords);
    });

    let map2 = new BattleMap(2);
    map2.placeRandomShips();

    let map1 = new BattleMap(1);
    map1.placeRandomShips();

};

function getCoords(event) {
    // alert("Button " + event.target.id + " clicked!");
    let xCoord = event.target.id.substring(1, 2);
    let yCoord = event.target.id.substring(2);
    xCoord = xCoord.charCodeAt(0);
    xCoord = xCoord - 64;
    console.log(xCoord + " " + yCoord);
    //We now know which button has been pressed, and have it's coordinates saved as code.

}

class BattleMap {
    #gameBoard;
    #ships;
    #chosenMap;

    constructor(mapNum) {
        this.#gameBoard = Array.from({ length: 10 }, () => Array(10).fill(0)); //10x10 2D array.
        this.#ships = [
            new Ship(5),
            new Ship(4),
            new Ship(3),
            new Ship(3),
            new Ship(2)
        ];
        if (mapNum === 1 || mapNum === 2) {
            this.chosenMap = "mainCoords" + mapNum.toString();
            // alert(this.chosenMap);
        }
        else {
            alert("Error! Wrong map number.");
            this.chosenMap = "Error";
        }
    }

    placeRandomShips() {
        for (let i = 0; i < 5; ++i) {
            let xCoord = Math.floor(Math.random() * 10); //0-9
            let xLetter = String.fromCharCode((xCoord + 65)); //A - J
            let yCoord = Math.floor(Math.random() * 10); //0-9 NOTE: Must add 1 when putting to ID.
            let coordHTMLButton;
            let id;
            //let numAttempts = 0; //DEBUGGING ONLY

            console.log(xCoord + ", " + yCoord);
            let isValid = this.isValidCoords(xCoord, yCoord);
            while(!isValid) { //Input validation of random coordinates
                console.log("Invalid coordinates.");
                xCoord = Math.floor(Math.random() * 10); //0-9
                xLetter = String.fromCharCode((xCoord + 65));
                yCoord = Math.floor(Math.random() * 10); //0-9
                isValid = this.isValidCoords(xCoord, yCoord);
                // ++numAttempts;
                // if (numAttempts > 200) {
                //     alert("FATAL ERROR");
                //     break;
                // }
            }
            console.log("Passed input check.");
            //numAttempts = 0;

            // if (this.chosenMap === "mainCoords1") { //Changing HTML based on random position.
            //     id = "1" + xLetter + (yCoord).toString();
            //     coordHTMLButton = document.getElementById(id);
            //     console.log(id);
            //     coordHTMLButton.style.backgroundColor = "red";
            // } else if (this.chosenMap === "mainCoords2") {
            //     id = "2" + xLetter + (yCoord).toString();
            //     coordHTMLButton = document.getElementById(id);
            //     console.log(id);
            //     coordHTMLButton.style.backgroundColor = "red";
            // } //Commenting this out because it's causing an error in the special case where no directions are valid.

            let directions = [0, 1, 2, 3];
            let direction = directions[Math.floor(Math.random() * 4)]; // 0 - 3
            console.log("Directions: " + directions);
            //Choosing a random direction for the ships to be placed.
            let isValidDirection = this.isValidDirection(direction, i, xCoord, yCoord);

            while (!isValidDirection) { //Input validation on random direction.
                directions.splice(directions.indexOf(direction), 1, -1); //Replaces invalid direction with -1
                direction = directions[Math.floor(Math.random() * 4)]; // 0 - 3
                console.log("New Directions: " + directions);
                while (direction === -1) {
                    let allMinusOne = directions.every(value => value === -1); //Checks if every value of directions is -1.
                    direction = directions[Math.floor(Math.random() * 4)]; // 0 - 3
                    if (allMinusOne) { //Every direction is invalid. Special case.
                        console.log("Fatal coordinate. Switching.");
                        xCoord = Math.floor(Math.random() * 10); //0-9
                        xLetter = String.fromCharCode((xCoord + 65)); //A - J
                        yCoord = Math.floor(Math.random() * 10); //0-9 NOTE: Must add 1 when putting to ID.
                        directions = [0, 1, 2, 3];
                        direction = directions[Math.floor(Math.random() * 4)];
                    }
                    // ++numAttempts;
                    // if (numAttempts > 200) {
                    //     alert("FATAL ERROR");
                    //     break;
                    // }
                }

                console.log("Trying again... New Direction: " + direction);
                isValidDirection = this.isValidDirection(direction, i, xCoord, yCoord);
                // ++numAttempts;
                // if (numAttempts > 200) {
                //     alert("FATAL ERROR");
                //     break;
                // }
            }

            if (direction === 0) { //Placing up
                console.log("Placing Up!");
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord][yCoord + j] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord, yCoord + j);

                    let newId;
                    if (this.chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "1" + xLetter + (yCoord + j).toString();
                    }
                    else if (this.chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "2" + xLetter + (yCoord + j).toString();
                    }
                    console.log("new ID: " + newId);
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "red";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }
            else if (direction === 1) { //Right
                console.log("Placing Right!");
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord + j][yCoord] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord + j, yCoord);

                    let newId;
                    if (this.chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode(((xCoord + j) + 65));
                        newId = "1" + xLetter + yCoord.toString();
                    }
                    else if (this.chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode(((xCoord + j) + 65));
                        newId = "2" + xLetter + yCoord.toString();
                    }
                    console.log("new ID: " + newId);
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "red";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }
            else if (direction === 2) { //Down
                console.log("Placing Down!");
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord][yCoord - j] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord, yCoord - j);

                    let newId;
                    if (this.chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "1" + xLetter + (yCoord - j).toString();
                    }
                    else if (this.chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "2" + xLetter + (yCoord - j).toString();
                    }
                    console.log("new ID: " + newId);
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "red";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }
            else if (direction === 3) { //Left
                console.log("Placing Left!");
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord - j][yCoord] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord - j, yCoord);

                    let newId;
                    if (this.chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode(((xCoord - j) + 65));
                        newId = "1" + xLetter + yCoord.toString();
                    }
                    else if (this.chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode(((xCoord - j) + 65));
                        newId = "2" + xLetter + yCoord.toString();
                    }
                    console.log("new ID: " + newId);
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "red";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }

            console.log(this.toString());
        }
    }

    isValidCoords(xCoord, yCoord) {
        let valid = false;
        //console.log(xCoord);
        //console.log(yCoord);
        if ((xCoord > -1 && xCoord < 10) && (yCoord > -1 && yCoord < 10) && this.#gameBoard[xCoord][yCoord] !== 1) { //-1 < x < 10, -1 < y < 10
            //Valid coordinates.
            valid = true;
        }
        else {
            //Invalid coordinates.
            console.log("INVALID");
        }
        return valid;
    }

    isValidDirection(direction, shipNum, xCoord, yCoord) {
        let canPlace = true;
        if (direction === 0) { //Up
            let i = 0;
            console.log("Ship length: " + this.#ships[shipNum].getLength());
            while ( i < this.#ships[shipNum].getLength()) {
                console.log("Checking y coord: " + (yCoord + i));
                if (!this.isValidCoords(xCoord, (yCoord + i))) {
                    console.log("Bad coords found in isValidDirection");
                    canPlace = false;
                } else if (this.#gameBoard[xCoord][yCoord + i] === 1) {
                    console.log("Double placement attempt found in isValidDirection");
                    canPlace = false;
                }
                ++i;
            }
        }
        else if (direction === 1) { //Right
            let j = 0;
            console.log("Ship length: " + this.#ships[shipNum].getLength());
            while ( j < this.#ships[shipNum].getLength()) {
                console.log("Checking x coord: " + (xCoord + j));
                if (!this.isValidCoords(xCoord + j, yCoord)) {
                    console.log("Bad coords found in isValidDirection");
                    canPlace = false;
                } else if (this.#gameBoard[xCoord + j][yCoord] === 1) {
                    console.log("Double placement attempt found in isValidDirection");
                    canPlace = false;
                }
                ++j;
            }

        }
        else if (direction === 2) { //Down
            let k = 0;
            console.log("Ship length: " + this.#ships[shipNum].getLength());
            while ( k < this.#ships[shipNum].getLength()) {
                console.log("Checking y coord: " + (yCoord - k));
                if (!this.isValidCoords(xCoord, (yCoord - k))) {
                    console.log("Bad coords found in isValidDirection");
                    canPlace = false;
                } else if (this.#gameBoard[xCoord][yCoord - k] === 1) {
                    console.log("Double placement attempt found in isValidDirection");
                    canPlace = false;
                }
                ++k;
            }
        }
        else if (direction === 3) { //Left
            let l = 0;
            console.log("Ship length: " + this.#ships[shipNum].getLength());
            while ( l < this.#ships[shipNum].getLength()) {
                console.log("Checking x coord: " + (xCoord - l));
                if (!this.isValidCoords(xCoord - l, yCoord)) {
                    console.log("Bad coords found in isValidDirection");
                    canPlace = false;
                } else if (this.#gameBoard[xCoord - l][yCoord] === 1) {
                    console.log("Double placement attempt found in isValidDirection");
                    canPlace = false;
                }
                ++l;
            }
        }
        else {
            alert("Error");
        }

        console.log(canPlace);
        return canPlace;
    }

    toString() {
        let toReturn = '   0 1 2 3 4 5 6 7 8 9\n';
        for (let i = 0; i < 10; i++) {
            toReturn += (i) + '  ' + this.#gameBoard[i].join(' ') + '\n';
        }
        return toReturn;
    }
}

class Piece {
    #isHit;
    #xCoord;
    #yCoord;
    #pieceNum;


    constructor() {
        this.#isHit = false;
        this.#xCoord = 0;
        this.#yCoord = 0;
        this.#pieceNum = 0;
    }

    setXCoord(x) {
        this.#xCoord = x;
    }

    setYCoord(y) {
        this.#yCoord = y;
    }

    getYCoord() {
        return this.#yCoord;
    }

    getXCoord() {
        return this.#xCoord;
    }

    setPieceNum(pieceNum) {
        this.#pieceNum = pieceNum;
    }

    getPieceNum() {
        return this.#pieceNum;
    }

    setHit(hit) {
        this.#isHit = hit;
    }

    isHit() {
        return this.#isHit;
    }
}

class Ship {
    #length;
    #shipPieces;

    constructor(length) {
        this.#length = length;
        this.#shipPieces = [];
        this.addPieces();
    }

    addPieces() {
        for (let i = 0; i < this.#length; i++) {
            let piece = new Piece();
            piece.setPieceNum(i);
            this.#shipPieces.push(piece);
        }
    }

    getLength() {
        return this.#length;
    }

    getPieceXCoord(pieceNum) {
        return this.#shipPieces[pieceNum].getXCoord();
    }

    getPieceYCoord(pieceNum) {
        return this.#shipPieces[pieceNum].getYCoord();
    }

    hitPiece(pieceNum) {
        this.#shipPieces[pieceNum].setHit(true);
    }

    isPieceHit(pieceNum) {
        return this.#shipPieces[pieceNum].isHit();
    }

    setPieceLocation(pieceNum, xCoord, yCoord) {
        this.#shipPieces[pieceNum].setXCoord(xCoord);
        this.#shipPieces[pieceNum].setYCoord(yCoord);
    }
}