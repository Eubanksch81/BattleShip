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

class BattleMap {
    #gameBoard;
    #ships;

    constructor() {
        this.#gameBoard = Array.from({ length: 10 }, () => Array(10).fill(0));
        this.#ships = [
            new Ship(5),
            new Ship(4),
            new Ship(3),
            new Ship(3),
            new Ship(2)
        ];
    }

    setFirstPieceOnBoard(shipNum, xCoord, yCoord) {
        if (this.isValidCoords(xCoord, yCoord) && this.#gameBoard[xCoord][yCoord] !== 1) {
            this.#ships[shipNum].setPieceLocation(0, xCoord, yCoord);
            this.#gameBoard[xCoord][yCoord] = 1;

            if (this.createPotentialPieces(this.#ships[shipNum].getLength(), xCoord, yCoord)) {
                return true;
            } else {
                this.#gameBoard[xCoord][yCoord] = 0;
                return false;
            }
        }
        return false;
    }

    setOtherPiecesOnBoard(shipNum, direction, xCoord, yCoord) {
        if (this.isValidCoords(xCoord, yCoord + this.#ships[shipNum].getLength()) && this.#gameBoard[xCoord][yCoord] === 3) {
            const initialX = this.#ships[shipNum].getPieceXCoord(0);
            const initialY = this.#ships[shipNum].getPieceYCoord(0);
            this.removePotentialPieces(this.#ships[shipNum].getLength(), initialX, initialY);

            this.#gameBoard[xCoord][yCoord] = 1;
            this.#ships[shipNum].setPieceLocation(this.#ships[shipNum].getLength() - 1, xCoord, yCoord);

            if (direction === 1) { //Up
                for (let i = 0; i < this.#ships[shipNum].getLength(); i++) {
                    this.#gameBoard[initialX][initialY + i] = 1;
                    this.#ships[shipNum].setPieceLocation(i, initialX, initialY + i);
                }
            }
            else if (direction === 2) { //Left
                for (let i = 0; i < this.#ships[shipNum].getLength(); i++) {
                    this.#gameBoard[initialX - i][initialY] = 1;
                    this.#ships[shipNum].setPieceLocation(i, initialX - i, initialY);
                }
            }
            else if (direction === 3) { //Right
                for (let i = 0; i < this.#ships[shipNum].getLength(); i++) {
                    this.#gameBoard[initialX + i][initialY] = 1;
                    this.#ships[shipNum].setPieceLocation(i, initialX + i, initialY);
                }
            }
            else if (direction === 4) { //Down
                for (let i = 0; i < this.#ships[shipNum].getLength(); i++) {
                    this.#gameBoard[initialX][initialY - i] = 1;
                    this.#ships[shipNum].setPieceLocation(i, initialX, initialY - i);
                }
            }
            else {
                return false;
            }
            return true;
        }
        return false;
    }

    // updateHitOrMiss(xCoord, yCoord) {
    //     if (this.#gameBoard[xCoord][yCoord] === 0) {
    //         this.#gameBoard[xCoord][yCoord] = 4; // Miss
    //     } else if (this.#gameBoard[xCoord][yCoord] === 1) {
    //         this.#gameBoard[xCoord][yCoord] = 2; // Hit
    //         this.hitPiece(xCoord, yCoord);
    //     }
    // }
    //
    // hitPiece(xCoord, yCoord) {
    //     for (const ship of this.#ships) {
    //         for (let j = 0; j < ship.getLength(); j++) {
    //             if (ship.getPieceXCoord(j) === xCoord && ship.getPieceYCoord(j) === yCoord) {
    //                 ship.hitPiece(j);
    //             }
    //         }
    //     }
    // }

    // checkWin() {
    //     return this.#ships.some(ship => ship.getLength().some((_, j) => !ship.isPieceHit(j)));
    // }

    removePotentialPieces(length, xCoord, yCoord) {
        if (xCoord + (length - 1) < 10 && this.#gameBoard[xCoord + (length - 1)][yCoord] === 3) {
            this.#gameBoard[xCoord + (length - 1)][yCoord] = 0;
        }
        if (xCoord - (length - 1) > -1 && this.#gameBoard[xCoord - (length - 1)][yCoord] === 3) {
            this.#gameBoard[xCoord - (length - 1)][yCoord] = 0;
        }
        if (yCoord + (length - 1) < 10 && this.#gameBoard[xCoord][yCoord + (length - 1)] === 3) {
            this.#gameBoard[xCoord][yCoord + (length - 1)] = 0;
        }
        if (yCoord - (length - 1) > -1 && this.#gameBoard[xCoord][yCoord - (length - 1)] === 3) {
            this.#gameBoard[xCoord][yCoord - (length - 1)] = 0;
        }
    }

    createPotentialPieces(length, xCoord, yCoord) {
        let canPlace = false;

        const directions = [
            { dx: 1, dy: 0 }, // Right
            { dx: -1, dy: 0 }, // Left
            { dx: 0, dy: 1 }, // Up
            { dx: 0, dy: -1 } // Down
        ];

        for (const { dx, dy } of directions) {
            let valid = true;
            for (let i = 1; i < length; i++) {
                const newX = xCoord + dx * i;
                const newY = yCoord + dy * i;
                if (this.#gameBoard[newX]?.[newY] === 1) {
                    valid = false;
                    break;
                }
            }
            if (valid && this.isValidCoords(xCoord + dx * (length - 1), yCoord + dy * (length - 1))) {
                this.#gameBoard[xCoord + dx * (length - 1)][yCoord + dy * (length - 1)] = 3;
                canPlace = true;
            }
        }
        return canPlace;
    }

    isValidCoords(xCoord, yCoord) {
        return xCoord >= 0 && xCoord < 10 && yCoord >= 0 && yCoord < 10;
    }

    toString() {
        let toReturn = '   A B C D E F G H I J\n';
        for (let i = 0; i < 10; i++) {
            toReturn += (i) + '  ' + this.#gameBoard[i].join(' ') + '\n';
        }
        return toReturn;
    }

    // getClosedMap() {
    //     let toReturn = '  A B C D E F G H I J\n';
    //     for (let i = 0; i < 10; i++) {
    //         toReturn += i + ' ';
    //         for (let j = 0; j < 10; j++) {
    //             switch (this.#gameBoard[j][i]) {
    //                 case 0:
    //                 case 1:
    //                     toReturn += '□ ';
    //                     break;
    //                 case 2:
    //                     toReturn += 'X ';
    //                     break;
    //                 case 4:
    //                     toReturn += 'O ';
    //                     break;
    //             }
    //         }
    //         toReturn += '\n';
    //     }
    //     return toReturn;
    // }
}

class Game {
    constructor() {
        this.map1 = new BattleMap();
        this.map2 = new BattleMap();
        this.start();
    }

    start() {
        console.log("Game called!");
    }

    placeShip() {
        console.log('working!');
    }

    placeBotShips(map) {
        for (let i = 0; i < 5; ++i) { //i is the ship number
            let xCoord = Math.random(1, 10);
            let yCoord = Math.random(1, 10);
            while (!map.setFirstPieceOnBoard(i, xCoord, yCoord)) {
                xCoord = Math.random(1, 10);
                yCoord = Math.random(1, 10);
            }

            let direction = Math.random(1, 4);
            while (!map.setOtherPiecesOnBoard(i, direction, xCoord, yCoord)) {
                direction = Math.random(1, 4);
            }
        }
    }

    // printOpenMap(map) {
    //     console.log(map.toString());
    // }
    //
    // playTurn(opponentMap) {
    //     // Placeholder for turn logic
    //     console.log("Take your shot!");
    //     // Implement your turn logic here
    // }
    //
    // checkWin(map) {
    //     return map.checkWin();
    // }
}

window.onload = function() {
    console.log("Load");
    const game = new Game();
    game.placeShip();
    let shipsPlaced = false;
    console.log("Code online!");

<<<<<<< HEAD
    const button1 = document.querySelector("button"); //0-0
    button1.addEventListener("click", game.placeShip);

    const button2 = document.querySelector("button"); //0-1
=======
    const button1 = document.querySelector("#A1"); //0-0
    button1.addEventListener("click", game.placeShip);

    const button2 = document.querySelector("#A2"); //0-1
>>>>>>> 5161d010da70cec4778f06ecc882bd08e02952bf
    button2.addEventListener("click", game.placeShip);
};