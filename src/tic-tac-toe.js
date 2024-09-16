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
        return null
    }

    let boardArray = [];
    for (let i = 0; i < s.length; i++){
        if (s[i].charCodeAt(0) !== 32 && s[i].charCodeAt(0) !== 79 && s[i].charCodeAt(0) !== 88){
            return null
        }
        else{
            boardArray.push(s[i])
        }
    }
    return boardArray
}

export {generateBoard, boardFromString}