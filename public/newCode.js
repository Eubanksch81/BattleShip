window.onload = function() {
    let htmlCoords = document.getElementById("mainCoords1");
    let oStrCoords = ``;

    for (let m = 1; m < 3; ++m) {
        for (let i = 0; i < 10; i++) { //Populates Main arrays. i is x, y is j.
            for (let j = 1; j < 11; ++j) {
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
            let xCoord = Math.floor(Math.random() * 10);
            let xLetter = xCoord = String.fromCharCode((xCoord + 65));
            let yCoord = Math.floor(Math.random() * 10) + 1;
            let coordHTMLButton;
            console.log(`${xCoord}, ${yCoord}`);

            // this.#ships[i].setPieceLocation(i, xCoord, yCoord);
            // this.#gameBoard[xCoord][yCoord - 1] = 1;

            if (this.chosenMap === "mainCoords1") {
                let id = "1" + xLetter + yCoord.toString();
                coordHTMLButton = document.getElementById(id);
                console.log(id);
                coordHTMLButton.style.backgroundColor = "red";
            } else if (this.chosenMap === "mainCoords2") {
                let id = "2" + xCoord.toString() + yCoord.toString();
                coordHTMLButton = document.getElementById(id);
                console.log(id);
                coordHTMLButton.style.backgroundColor = "red";
            }

            let direction = Math.floor(Math.random() * 4);

            let isValidDirection = false;
            while (!isValidDirection) {
                direction = Math.floor(Math.random() * 4);
                isValidDirection = this.isValidDirection(direction);
            }
            console.log(direction);

            switch (direction) {
                case 0:
                    //TODO: Must place the full ship. Once done, all 5 ships will be placed this way.
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }
    }

    isValidDirection(direction) {
        let canPlace = true; //TODO: Must finish this method.
        for (let i = 1; i < length; i++) { //needs to check full length of ship. So needs shipnum.
            const newX = xCoord + dx * i; //This code is based on us not knowing the direction. Since this is randomized, we do know it.
            const newY = yCoord + dy * i;
            if (this.#gameBoard[newX]?.[newY] === 1) { //Checks each piece over the ship length to see if there is another place.
                canPlace = false; //Invalid direction.
                break;
            }
        }

        return canPlace;
    }
}

class Piece {
    #isHit;
    #xCoord;
    #yCoord;

    constructor() {
        this.#isHit = false;
        this.#xCoord = 0;
        this.#yCoord = 0;
    }

    setXCoord(x) {
        this.xCoord = x;
    }

    setYCoord(y) {
        this.yCoord = y;
    }

    getYCoord() {
        return this.yCoord;
    }

    getXCoord() {
        return this.xCoord;
    }

    setPieceNum(pieceNum) {
        this.pieceNum = pieceNum;
    }

    getPieceNum() {
        return this.pieceNum;
    }

    setHit(hit) {
        this.isHit = hit;
    }

    isHit() {
        return this.isHit;
    }
}

class Ship {
    #length = 0;
    #shipPieces;

    constructor(length) {
        this.#length = length;
        this.#shipPieces = [];
        this.addPieces();
    }

    addPieces() {
        for (let i = 0; i < this.#length; i++) {
            let piece = new Piece();
            piece.setPieceNum(i + 1);
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