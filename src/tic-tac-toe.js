// tic-tac-toe.js

function repeat(initVal, length) {
    return Array(length).fill(initVal);
}    

function generateBoard(rows, cols, initialValue) {
    const blankValue = initialValue || " ";
    return repeat(blankValue, rows * cols);
}

function boardFromString(s){
    if (Math.sqrt(s.length) % 1 !== 0){
        return null;
    }

    const boardArray = [];
    for (let i = 0; i < s.length; i++){
        if (s[i].charCodeAt(0) !== 32 && s[i].charCodeAt(0) !== 79 && s[i].charCodeAt(0) !== 88){
            return null;
        }
        else{
            boardArray.push(s[i]);
        }
    }
    return boardArray;
}

function rowColToIndex(board, row, col){
    const dimension = Math.sqrt(board.length);
    const indx = row * dimension + (col);

    return indx;
}

function indexToRowCol(board, i){
    const dimension = Math.sqrt(board.length);
    const rowCol = {};
    rowCol.row = Math.floor(i/dimension);
    rowCol.col = i - rowCol.row*dimension;

    return rowCol;
}

function setBoardCell(board, letter, row, col){
    const boardCopy = board.slice();
    const index = rowColToIndex(board, row, col);
    boardCopy[index] = letter;

    return boardCopy;
}

function algebraicToRowCol(algebraicNotation){
    const reg = /^[A-Z](1[0-9]|2[0-6]|[1-9])$/;

    const result = algebraicNotation.match(reg);

    if (result === null){
        return undefined;
    }
    else{
        const col = parseInt(result[0].slice(1)) - 1;
        const row = result[0][0].charCodeAt(0) - 65;

        return {"row": row, "col": col};
    }

}

function placeLetter(board, letter, algebraicNotation){
    const coordinates = algebraicToRowCol(algebraicNotation);
    return setBoardCell(board, letter, coordinates.row, coordinates.col);
}

function getWinner(board){
    function checkWinner(player, row, col) {
        const dimension = Math.sqrt(board.length);

        if (board.slice(row * dimension, row * dimension + dimension).every(cell => cell === player)) {
            return true;
        }

        if (Array.from({ length: dimension }, (_, i) => board[i * dimension + col]).every(cell => cell === player)) {
            return true;
        }

        if (row === col && Array.from({ length: dimension }, (_, i) => board[i * (dimension + 1)]).every(cell => cell === player)) {
            return true;
        }

        if (row + col === dimension - 1 && Array.from({ length: dimension }, (_, i) => board[(i + 1) * (dimension - 1)]).every(cell => cell === player)) {
            return true;
        }

        return false;
    }

    const dimension = Math.sqrt(board.length);
    for (let row = 0; row < dimension; row++) {
        for (let col = 0; col < dimension; col++) {
            const player = board[row * dimension + col];
            if (player !== ' ' && checkWinner(player, row, col)) {
                return player;
            }
        }
    }

    return undefined; 
}

function isBoardFull(board){
    for(let i = 0; i < board.length; i++){
        if(board[i] === ' '){
            return false;
        }
    }
    return true;
}

function isValidMove(board, algebraicNotation){
    const coordinates = algebraicToRowCol(algebraicNotation);
    const dimension = Math.sqrt(board.length);
    if (coordinates === undefined){
        return false;
    }

    //

    if(coordinates.row < dimension && coordinates.col < dimension){
        const index = rowColToIndex(board, coordinates.row, coordinates.col);

        if(board[index] === " "){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

export {generateBoard, boardFromString, rowColToIndex, indexToRowCol, setBoardCell, algebraicToRowCol, placeLetter, getWinner,
isBoardFull, isValidMove};