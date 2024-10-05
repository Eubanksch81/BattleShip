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

    setOtherPiecesOnBoard(shipNum, xCoord, yCoord) {
        if (this.#gameBoard[xCoord][yCoord] === 3) {
            const initialX = this.#ships[shipNum].getPieceXCoord(0);
            const initialY = this.#ships[shipNum].getPieceYCoord(0);
            this.removePotentialPieces(this.#ships[shipNum].getLength(), initialX, initialY);
            this.#gameBoard[xCoord][yCoord] = 1;
            this.#ships[shipNum].setPieceLocation(this.#ships[shipNum].getLength() - 1, xCoord, yCoord);

            if (initialX === xCoord) {
                for (let i = 0; i < this.#ships[shipNum].getLength(); i++) {
                    this.#gameBoard[xCoord][yCoord + (initialY < yCoord ? -i : i)] = 1;
                    this.#ships[shipNum].setPieceLocation(i, xCoord, yCoord + (initialY < yCoord ? -i : i));
                }
            } else {
                for (let i = 0; i < this.#ships[shipNum].getLength(); i++) {
                    this.#gameBoard[xCoord + (initialX < xCoord ? -i : i)][yCoord] = 1;
                    this.#ships[shipNum].setPieceLocation(i, xCoord + (initialX < xCoord ? -i : i), yCoord);
                }
            }
            return true;
        }
        return false;
    }

    updateHitOrMiss(xCoord, yCoord) {
        if (this.#gameBoard[xCoord][yCoord] === 0) {
            this.#gameBoard[xCoord][yCoord] = 4; // Miss
        } else if (this.#gameBoard[xCoord][yCoord] === 1) {
            this.#gameBoard[xCoord][yCoord] = 2; // Hit
            this.hitPiece(xCoord, yCoord);
        }
    }

    hitPiece(xCoord, yCoord) {
        for (const ship of this.#ships) {
            for (let j = 0; j < ship.getLength(); j++) {
                if (ship.getPieceXCoord(j) === xCoord && ship.getPieceYCoord(j) === yCoord) {
                    ship.hitPiece(j);
                }
            }
        }
    }

    checkWin() {
        return this.#ships.some(ship => ship.getLength().some((_, j) => !ship.isPieceHit(j)));
    }

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

    getClosedMap() {
        let toReturn = '  A B C D E F G H I J\n';
        for (let i = 0; i < 10; i++) {
            toReturn += i + ' ';
            for (let j = 0; j < 10; j++) {
                switch (this.#gameBoard[j][i]) {
                    case 0:
                    case 1:
                        toReturn += '□ ';
                        break;
                    case 2:
                        toReturn += 'X ';
                        break;
                    case 4:
                        toReturn += 'O ';
                        break;
                }
            }
            toReturn += '\n';
        }
        return toReturn;
    }
}

class Game {
    constructor() {
        this.map1 = new BattleMap();
        this.map2 = new BattleMap();
        this.gameContinues = true;
    }

    start() {
        console.log("Welcome to Battleship!\n");
        this.placeShips(this.map1);
        this.printOpenMap(this.map1);

        console.log("Now for player 2!\n");
        this.placeShips(this.map2);
        this.printOpenMap(this.map2);

        console.log("Starting Player 1!");
        while (this.gameContinues) {
            console.log("\nPlayer 1");
            this.playTurn(this.map2);
            this.gameContinues = this.checkWin(this.map2);
            if (!this.gameContinues) {
                console.log("Player 1 wins!");
                break;
            }

            console.log("\nPlayer 2");
            this.playTurn(this.map1);
            this.gameContinues = this.checkWin(this.map1);
            if (!this.gameContinues) {
                console.log("Player 2 wins!");
                break;
            }
        }
    }

    placeShips(map) {
        // Placeholder for ship placement logic
        console.log("Place your ships on the board");
        this.printOpenMap(map);
        console.log("Please place the first piece of your first ship.");
        // Implement your ship placement logic here
    }

    printOpenMap(map) {
        console.log(map.toString());
    }

    playTurn(opponentMap) {
        // Placeholder for turn logic
        console.log("Take your shot!");
        // Implement your turn logic here
    }

    checkWin(map) {
        return map.checkWin();
    }
}

// Start the game
const game = new Game();
game.start();