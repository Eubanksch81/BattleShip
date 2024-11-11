window.onload = function() {
    const callHTMLTurn = document.getElementById("showTurn");
    let map1;
    let map2;
    let gameContinues = true;

    populateArrays();

    const savedGameState = [
        JSON.parse(localStorage.getItem("map1")), //Sucessfully stored and retrieved the items using localStorage!
        JSON.parse(localStorage.getItem("map2"))
    ]; //Gets map1 and map2 from localStorage.

    console.log(savedGameState[0]);
    console.log(savedGameState[1]);

    if (savedGameState.every(x => x === null)) { //Checks the save state. This is if the localStorage is clear.
        map1 = new BattleMap(1);
        map1.placeRandomShips();
        map2 = new BattleMap(2);
        map2.placeRandomShips(); //Places random ships for each map,

        localStorage.setItem("map1", map1.toJSON()); //And stores them in localStorage.
        localStorage.setItem("map2", map2.toJSON());

        let badCoords = []; //Sets up the badCoords array for both maps.
        // This is done here because the badCoords will always be empty when the maps are empty.
        localStorage.setItem("badCoords1", JSON.stringify(badCoords));
        localStorage.setItem("badCoords2", JSON.stringify(badCoords));
    }
    else { //localStorage has something. Pull from localStorage.
        map1 = new BattleMap(1);
        map2 = new BattleMap(2);

        map1.populateMapFromLocalStorage(savedGameState[0]);
        map2.populateMapFromLocalStorage(savedGameState[1]);
    }

    callHTMLTurn.innerHTML = `<span> Player 1 Turn! </span>`;

    const buttons = document.querySelectorAll(".boxElement");
    buttons.forEach(button => { //If any map button is clicked
        button.addEventListener("click", () => {
            button.classList.add('flash'); //Adds a neat flashing effect when the button is clicked.
            setTimeout(() => {
                button.classList.remove('flash');
            }, 300); // Adjust duration as needed

            console.log(button.id);
            if (gameContinues && button.id.charAt(0) === '2' && callPlayerTurn(button.id, map2)) { //Player can only perform map2 clicks.
                //Bot turn uses map1, and player turn uses map2.
                //Calls the player turn as the condition. Condition returns false if it's a piece that's already been hit.
                if (map2.isWinCondition()) { //Checks if all pieces are hit in map 2.
                    console.log("End of game: Player wins!");
                    document.getElementById("showTurn").innerHTML = `<span> Player 1 Wins! </span>`;
                    gameContinues = false;
                    localStorage.clear();
                }
                else {
                    callHTMLTurn.innerHTML = `<span> Bot Turn! </span>`;
                    callBotTurn(map1); //Bot goes immediately afterwards; simulates a full round (two turns).
                    //TODO: Finish Bot turn logic.
                    if (map1.isWinCondition()) {
                        console.log("End of game: Bot wins!");
                        document.getElementById("showTurn").innerHTML = `<span> Bot Wins! </span>`;
                        gameContinues = false;
                        localStorage.clear();
                    }
                    else {
                        callHTMLTurn.innerHTML = `<span> Player 1 Turn! </span>`;
                        localStorage.setItem("map1", map1.toJSON()); //Updates the localStorage of both maps.
                        localStorage.setItem("map2", map2.toJSON());
                    }
                }
            }
        });

        button.addEventListener("mouseover", () => { //Simple mouseover effect.
            button.style.border = "5px solid red";
        });
        button.addEventListener("mouseout", () => { //Resets the button after the mouseover effect.
            button.style.border = "1px solid black"; // Reset the border when the mouse moves out
        });
    });

    const clearButton = document.querySelector("#clear");
    clearButton.addEventListener("click", () => { //Clear localStorage
        localStorage.clear();
        location.reload(); //Refreshes the page for new window.onload function
        console.log("Reset");
    });
};

function callPlayerTurn(id, map) {
    return map.playerTurn(id);
}

function callBotTurn(map) {
    map.botTurn();
}

function populateArrays() {
    let htmlCoords = document.getElementById("mainCoords1");
    let oStrCoords = ``;

    for (let m = 1; m < 3; ++m) {
        for (let i = 0; i < 10; i++) { //Populates Main arrays. i is x, y is j.
            for (let j = 0; j < 10; ++j) {
                let iValue = i + 65;
                let idName = m.toString() + String.fromCharCode(iValue) + j.toString();
                oStrCoords += `<button type="button" class="boxElement" id="${idName}"> * </button>`;
            }
        }
        htmlCoords.innerHTML = oStrCoords;
        htmlCoords = document.getElementById("mainCoords2");
        oStrCoords = ``;
    }
}

class BattleMap {
    #gameBoard;
    //Contains a 2D array with values 0, 1, 2, 3
    // 0 : Blank space
    // 1 : Ship Exists
    // 2 : Ship hit
    // 3 : Missed shot
    #ships;
    //Each ship contains an array of pieces, and the ship's length.
    #chosenMap;
    //Is either mapCoords1 or mapCoords2. Should never be anything else.

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
            this.#chosenMap = "mainCoords" + mapNum.toString();
            // alert(this.#chosenMap);
        }
        else {
            alert("Error! Wrong map number.");
            this.#chosenMap = "Error";
        }
    }

    populateMapFromLocalStorage(mapData) { //Takes the given array from JSON.parse and populates the BattleMap class.
        mapData = deepParse(mapData);
        let mapNum = this.#chosenMap.charAt(this.#chosenMap.length - 1);

        // Ensure we don't exceed the number of ships available
        for (let i = 0; i < Math.min(this.#ships.length, mapData.length); i++) {
            const ship = this.#ships[i];
            const shipData = mapData[i][0];
            //console.log("Current Ship length:", ship.getLength());

            for (let j = 0; j < ship.getLength(); j++) { //Fills out the gameboard and ship pieces based on the pieceData.
                const pieceData = shipData[j];
                if (pieceData) { //If pieceData is valid
                    //console.log(pieceData[0], pieceData[1], pieceData[2], pieceData[3]);
                    ship.populatePieceFromStorage(pieceData);
                    let xCoord = ship.getPieceXCoord(j);
                    let yCoord = ship.getPieceYCoord(j);
                    let isHit = ship.isPieceHit(j);

                    let id = `${mapNum}${String.fromCharCode(xCoord + 65)}${yCoord}`
                    //console.log("Id in populate: " + id);
                    const newButton  = document.getElementById(id);

                    if (isHit) {
                        this.#gameBoard[xCoord][yCoord] = 2;
                        newButton.style.backgroundColor = "orange";
                    }
                    else {
                        this.#gameBoard[xCoord][yCoord] = 1;
                        newButton.style.backgroundColor = "maroon";
                    }
                }
            }
        }

        let missStorageId = "badCoords" + mapNum.toString();
        let missData = localStorage.getItem(missStorageId);
        missData = deepParse(missData);
        // console.log(missData);

        for (let i = 0; i < missData.length; i++) { //Gets ID from x,y data and changes button color.
            let xCoord = missData[i][0];
            let yCoord = missData[i][1];

            let missId = mapNum + String.fromCharCode(xCoord + 65) + yCoord;
            document.getElementById(missId).style.backgroundColor = "pink";
            this.#gameBoard[xCoord][yCoord] = 3;
        }



        // console.log(`this ${this.#chosenMap} map: `);
        // console.log(`${this.#gameBoard}`);

        //console.log("Gameboard post-fill:", this.#gameBoard);
    }

    toJSON() {
        //This will store the entire array of ships. The array of ships contains each ship,
        // it's length, the coordinates of each piece, and the condition of the pieces.

        let battleMapJSON = [];
        for (let i = 0; i < this.#ships.length; i++) {
            battleMapJSON.push(this.#ships[i].toJSON());
        }

        return JSON.stringify(battleMapJSON);
    }

    playerTurn(id) {
        let xCoord = id.charAt(1); //A-J
        xCoord = (xCoord.charCodeAt(0) - 65); //0-9
        let yCoord = parseInt(id.charAt(2)); //0-9

        if (this.#gameBoard[xCoord][yCoord] === 1) { //Hit
            console.log("Hit!");
            this.#gameBoard[xCoord][yCoord] = 2; //Hits piece.
            document.getElementById(id).style.backgroundColor = "orange";

            for (let i = 0; i < this.#ships.length; ++i) { //Finds the corresponding piece in the ships object and hits it.
                for (let j = 0; j < this.#ships[i].getLength(); ++j) {
                    if ((this.#ships[i].getPieceXCoord(j) === xCoord) && (this.#ships[i].getPieceYCoord(j) === yCoord)) {
                        this.#ships[i].hitPiece(j);
                        console.log(`Hit piece ${j} in ship ${i}`);
                    }
                }
            }
            return true;
        }
        else if (this.#gameBoard[xCoord][yCoord] === 0) { //Miss
            this.#gameBoard[xCoord][yCoord] = 3; //Marks piece as a miss.
            document.getElementById(id).style.backgroundColor = "pink";

            let badCoord = [xCoord, yCoord]; //Takes missed coordinates
            let badCoords = localStorage.getItem("badCoords2");
            badCoords = JSON.parse(badCoords); //Pulls and parses badCoords array
            badCoords.push(badCoord); //Adds missed coordinates
            localStorage.setItem("badCoords2", JSON.stringify(badCoords)); //Places back into localStorage.

            //Player turn always uses badCoords2, and bot turn always uses badCoords1.
            //This is because the numbers correlate to the map that the player/bot is attacking.
            return true;
        }
        else { //Ship has already been hit
            console.log("Cell already hit!");
            return false;
        }
    }

    botTurn() { //Plays the bot's turn against the player on board 1.
        let plan;
        let botXCoord;
        let xLetter;
        let botYCoord;
        let id;
        let badCoords = JSON.parse(localStorage.getItem("badCoords1")) || [];
        plan = localStorage.getItem("plan");
        plan = JSON.parse(plan) || null;

        if(plan !== null && plan[0] !== -1) {
            botXCoord = plan[0];
            botYCoord = plan[1];

        }
        else {
            do {
                botXCoord = Math.floor(Math.random() * 10);
                botYCoord = Math.floor(Math.random() * 10);
            } while (badCoords.some(coord => coord[0] === botXCoord && coord[1] === botYCoord));

        }

        xLetter = String.fromCharCode((botXCoord + 65)); //A - J
        id = "1" + xLetter + botYCoord.toString();
        this.checkIfHit(botXCoord, botYCoord, id, badCoords);

    }
    checkIfHit(botXCoord, botYCoord, id, badCoords) {
        let plan;
        if (this.#gameBoard[botXCoord][botYCoord] === 1) { //Hit

            this.#gameBoard[botXCoord][botYCoord] = 2; //Hits piece.
            document.getElementById(id).style.backgroundColor = "orange";

            for (let i = 0; i < this.#ships.length; ++i) { //Finds the corresponding piece in the ships object and hits it.
                for (let j = 0; j < this.#ships[i].getLength(); ++j) {
                    if ((this.#ships[i].getPieceXCoord(j) === botXCoord) && (this.#ships[i].getPieceYCoord(j) === botYCoord)) {
                        this.#ships[i].hitPiece(j);
                        plan = this.nextAttack(botXCoord, botYCoord);
                        localStorage.setItem("plan", JSON.stringify(plan));
                    }
                }
            }
        }
        else if (this.#gameBoard[botXCoord][botYCoord] === 0) {//Miss

            this.#gameBoard[botXCoord][botYCoord] = 3; //Marks piece as a miss.
            document.getElementById(id).style.backgroundColor = "pink";


            badCoords.push(botXCoord, botYCoord); //Adds missed coordinates
            localStorage.setItem("badCoords1", JSON.stringify(badCoords)); //Places back into localStorage.

        }
        else { //Ship has already been hit
            console.log("Repick choice");
            this.botTurn();
        }
    }
    nextAttack(botXCoord, botYCoord) {
        let nextAttack;
        const rows = this.#gameBoard.length;
        const cols = this.#gameBoard[0].length;

        if (botYCoord - 1 >= 0 && this.#gameBoard[botXCoord][botYCoord - 1] === 1) {
            nextAttack = [botXCoord, botYCoord - 1];
        }
        else if (botXCoord - 1 >= 0 && this.#gameBoard[botXCoord - 1][botYCoord] === 1) {
            nextAttack = [botXCoord - 1, botYCoord];
        }
        else if (botXCoord + 1 < rows && this.#gameBoard[botXCoord + 1][botYCoord] === 1) {
            nextAttack = [botXCoord + 1, botYCoord];
        }
        else if (botYCoord + 1 < cols && this.#gameBoard[botXCoord][botYCoord + 1] === 1) {
            nextAttack = [botXCoord, botYCoord + 1];
        }
        else {
            nextAttack = [-1, -1];
        }
        return nextAttack;
    }

    isWinCondition() {
        let winConditionFound = true;
        for (let i = 0; i < this.#ships.length; ++i) {
            for (let j = 0; j < this.#ships[i].getLength(); ++j) {
                if (!this.#ships[i].isPieceHit(j)) {
                    //So if any of the pieces are not hit, then the win condition is false.
                    winConditionFound = false;
                }
            }
        }

        return winConditionFound;
    }

    placeRandomShips() {
        for (let i = 0; i < 5; ++i) {
            let xCoord = Math.floor(Math.random() * 10); //0-9
            let xLetter = String.fromCharCode((xCoord + 65)); //A - J
            let yCoord = Math.floor(Math.random() * 10); //0-9 NOTE: Must add 1 when putting to ID.
            let coordHTMLButton;
            let id;

            let isValid = this.isValidCoords(xCoord, yCoord);
            while(!isValid) { //Input validation of random coordinates
                xCoord = Math.floor(Math.random() * 10); //0-9
                xLetter = String.fromCharCode((xCoord + 65));
                yCoord = Math.floor(Math.random() * 10); //0-9
                isValid = this.isValidCoords(xCoord, yCoord);
            }

            let directions = [0, 1, 2, 3];
            let direction = directions[Math.floor(Math.random() * 4)]; // 0 - 3
            //Choosing a random direction for the ships to be placed.
            let isValidDirection = this.isValidDirection(direction, i, xCoord, yCoord);

            while (!isValidDirection) { //Input validation on random direction.
                directions.splice(directions.indexOf(direction), 1, -1); //Replaces invalid direction with -1
                direction = directions[Math.floor(Math.random() * 4)]; // 0 - 3
                while (direction === -1) {
                    let allMinusOne = directions.every(value => value === -1); //Checks if every value of directions is -1.
                    direction = directions[Math.floor(Math.random() * 4)]; // 0 - 3
                    if (allMinusOne) { //Every direction is invalid. Special case.
                        // console.log("Fatal coordinate. Switching.");
                        xCoord = Math.floor(Math.random() * 10); //0-9
                        xLetter = String.fromCharCode((xCoord + 65)); //A - J
                        yCoord = Math.floor(Math.random() * 10); //0-9 NOTE: Must add 1 when putting to ID.
                        directions = [0, 1, 2, 3];
                        direction = directions[Math.floor(Math.random() * 4)];
                    }
                }

                isValidDirection = this.isValidDirection(direction, i, xCoord, yCoord);
            }

            if (direction === 0) { //Placing up
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord][yCoord + j] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord, yCoord + j);

                    let newId;
                    if (this.#chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "1" + xLetter + (yCoord + j).toString();
                    }
                    else if (this.#chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "2" + xLetter + (yCoord + j).toString();
                    }
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "maroon";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }
            else if (direction === 1) { //Right
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord + j][yCoord] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord + j, yCoord);

                    let newId;
                    if (this.#chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode(((xCoord + j) + 65));
                        newId = "1" + xLetter + yCoord.toString();
                    }
                    else if (this.#chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode(((xCoord + j) + 65));
                        newId = "2" + xLetter + yCoord.toString();
                    }
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "maroon";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }
            else if (direction === 2) { //Down
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord][yCoord - j] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord, yCoord - j);

                    let newId;
                    if (this.#chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "1" + xLetter + (yCoord - j).toString();
                    }
                    else if (this.#chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode((xCoord + 65));
                        newId = "2" + xLetter + (yCoord - j).toString();
                    }
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "maroon";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }
            else if (direction === 3) { //Left
                for (let j = 0; j < this.#ships[i].getLength(); j++) { //For each piece of the ship
                    this.#gameBoard[xCoord - j][yCoord] = 1;
                    this.#ships[i].setPieceLocation(j, xCoord - j, yCoord);

                    let newId;
                    if (this.#chosenMap === "mainCoords1") {
                        xLetter = String.fromCharCode(((xCoord - j) + 65));
                        newId = "1" + xLetter + yCoord.toString();
                    }
                    else if (this.#chosenMap === "mainCoords2") {
                        xLetter = String.fromCharCode(((xCoord - j) + 65));
                        newId = "2" + xLetter + yCoord.toString();
                    }
                    coordHTMLButton = document.getElementById(newId);
                    coordHTMLButton.style.backgroundColor = "maroon";
                    //We need to update the ID for the buttons as we go, in order to change them to red.
                }
            }
        }
    }

    isValidCoords(xCoord, yCoord) {
        let valid = false;
        if ((xCoord > -1 && xCoord < 10) && (yCoord > -1 && yCoord < 10) && this.#gameBoard[xCoord][yCoord] !== 1) { //-1 < x < 10, -1 < y < 10
            //Valid coordinates.
            valid = true;
        }
        else {
            //Invalid coordinates.
        }
        return valid;
    }

    isValidDirection(direction, shipNum, xCoord, yCoord) {
        let canPlace = true;
        if (direction === 0) { //Up
            let i = 0;
            while ( i < this.#ships[shipNum].getLength()) {
                if (!this.isValidCoords(xCoord, (yCoord + i))) {
                    canPlace = false;
                } else if (this.#gameBoard[xCoord][yCoord + i] === 1) {
                    canPlace = false;
                }
                ++i;
            }
        }
        else if (direction === 1) { //Right
            let j = 0;
            while ( j < this.#ships[shipNum].getLength()) {
                if (!this.isValidCoords(xCoord + j, yCoord)) {
                    canPlace = false;
                } else if (this.#gameBoard[xCoord + j][yCoord] === 1) {
                    canPlace = false;
                }
                ++j;
            }

        }
        else if (direction === 2) { //Down
            let k = 0;
            while ( k < this.#ships[shipNum].getLength()) {
                if (!this.isValidCoords(xCoord, (yCoord - k))) {
                    canPlace = false;
                } else if (this.#gameBoard[xCoord][yCoord - k] === 1) {
                    canPlace = false;
                }
                ++k;
            }
        }
        else if (direction === 3) { //Left
            let l = 0;
            while ( l < this.#ships[shipNum].getLength()) {
                if (!this.isValidCoords(xCoord - l, yCoord)) {
                    canPlace = false;
                } else if (this.#gameBoard[xCoord - l][yCoord] === 1) {
                    canPlace = false;
                }
                ++l;
            }
        }
        else {
            alert("Error: Not a possible direction?");
        }
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

function deepParse(data) { //Recursive algorithm that parses a JSON string multiple times to pull nested data.
    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            return deepParse(parsed);
        } catch (e) {
            return data;
        }
    } else if (Array.isArray(data)) {
        return data.map(item => deepParse(item));
    } else {
        return data;
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

    toJSON() {
        let pieceJSON = [];
        pieceJSON.push(JSON.stringify(this.#isHit));
        pieceJSON.push(JSON.stringify(this.#xCoord));
        pieceJSON.push(JSON.stringify(this.#yCoord));
        pieceJSON.push(JSON.stringify(this.#pieceNum));
        return JSON.stringify(pieceJSON);
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

    toString() {
        let rStr = "";
        rStr += this.#isHit;
        rStr += this.#xCoord;
        rStr += this.#yCoord;
        rStr += this.#pieceNum;
        return rStr;
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

    toJSON() {
        //NOTE: Not storing the length of the ship object. This is because the length of each ship is hard coded in the BattleMap constructor.
        let piecesStringArray = [];
        let shipJSON = []; //Contains the string version of the entire object

        for (let i = 0; i < this.#length; ++i) { //For all pieces of the ship
            piecesStringArray.push(this.#shipPieces[i].toJSON()); //Adds the JSON string to the string array piecesStringArray
        }
        shipJSON.push(piecesStringArray);

        return JSON.stringify(shipJSON); //Then returns the stringified version of the JSON string array

    }

    populatePieceFromStorage(pieceData) {
        //gets an array in the form of [isHit, x, y, pieceNum].
        // Assigning parsed values to each Piece object
        let isHit = pieceData[0];
        let xCoord = pieceData[1];
        let yCoord = pieceData[2];
        let pieceNum = pieceData[3];

        this.#shipPieces[pieceNum].setXCoord(xCoord);
        this.#shipPieces[pieceNum].setYCoord(yCoord);
        this.#shipPieces[pieceNum].setHit(isHit);
        // console.log("New shipPiece: " + this.#shipPieces[pieceNum].toString());
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