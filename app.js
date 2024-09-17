// app.js
import * as tic from './src/tic-tac-toe.js';
import { question } from 'readline-sync';
import fs from 'fs';

//This function allows to generate empty board string of arbitrary dimensions.
const generateBoardString = (rows, cols, emptyChar = " ") => {
    return emptyChar.repeat(rows * cols);
};

//Set to be 3x3 board. For testing, dimensions could be changed
const boardString = generateBoardString(3, 3);

// default configuration
let config = {
  board: boardString,
  playerLetter: "X",
  computerLetter: "O",
  computerMoves: [] // No scripted moves
};

// Helper function to get available moves
function getAvailableMoves(board) {
    const moves = [];
    const dimension = Math.sqrt(board.length);
    
    //double loop to go over all cells on the board. Empty cell coordinates are converted to the algebraic form
    for (let row = 0; row < dimension; row++) {
      for (let col = 0; col < dimension; col++) {
        const algebraicNotation = String.fromCharCode(65 + row) + (col + 1);
        if (tic.isValidMove(board, algebraicNotation)) {
          moves.push(algebraicNotation);
        }
      }
    }
    
    return moves;
  }

// Function for computer's random move (if no scripted moves)
function computerMove(board, computerLetter) {
    //checks for available moves and then randomly selects the next move
    const availableMoves = getAvailableMoves(board);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return tic.placeLetter(board, computerLetter, randomMove);
  }

// Function for player's move
function playerMove(board, playerLetter) {
    let validMove = false;
    let move;
    
    //loop to repeatedly ask for a correct algebraic coordinates
    while (!validMove) {
      move = question("What's your move? (e.g., A1): ");
      if (tic.isValidMove(board, move)) {
        validMove = true;
      } 
      else {
        console.log("Invalid move. Please try again.");
      }
    }
    
    return tic.placeLetter(board, playerLetter, move);
  }

// Function to display the board
function displayBoard(board) {
    const dimension = Math.sqrt(board.length);

    // Generate column numbers dynamically
    //The board looks good with relatively smaller dimensions, but gets skewed eventually as number of rows/columns increases
    let colHeader = "    ";
    for (let i = 1; i <= dimension; i++) {
      colHeader += i + "   "; 
    }
    console.log(colHeader);

    // Generate row separator dynamically based on dimension
    const separator = "  +" + "---+".repeat(dimension);

    console.log(separator);
    for (let row = 0; row < dimension; row++) {
      const rowLabel = String.fromCodePoint(65 + row); // A, B, C for rows
      const rowContent = board.slice(row * dimension, row * dimension + dimension).join(" | ");
      console.log(`${rowLabel} | ${rowContent} |`);
      console.log(separator);
    }
}

// Function to start the game with config. Handles game loop and overal logic
function startGame(config) {
    console.log(`Player is ${config.playerLetter}, Computer is ${config.computerLetter}`);
    
    if (config.computerMoves.length > 0) {
      console.log(`Computer will make the following moves: ${config.computerMoves}`);
    }
  
    let board = tic.boardFromString(config.board);
    displayBoard(board);
  
    // Main game loop
    let currentPlayer = config.playerLetter === "X" ? "player" : "computer";
    let scriptedMoveIndex = 0;
  
    //Game loop before a next turn checks is there is a winner or if the board is full. To end the game accordingly
    while (!tic.isBoardFull(board) && !tic.getWinner(board)) {
        
      //currentPlayer can be either player or computer  
      if (currentPlayer === "player") {
        board = playerMove(board, config.playerLetter);
        currentPlayer = "computer";
      } 
      else {
        //computer checks will always choose a predetermined moves provided from the config first
        //However, if the cell is not empty, or there are no more predetermined moves, computer will randomly select empty cells
        question("Please <ENTER> to see computer's move");
        if (scriptedMoveIndex < config.computerMoves.length && tic.isValidMove(board, config.computerMoves[scriptedMoveIndex])) {
          board = tic.placeLetter(board, config.computerLetter, config.computerMoves[scriptedMoveIndex]);
          scriptedMoveIndex++;
        } 
        else {
          board = computerMove(board, config.computerLetter);
          scriptedMoveIndex++;
        }
        currentPlayer = "player";
      }
      displayBoard(board);
    }
  
    const winner = tic.getWinner(board);
    if (winner) {
      console.log(`${winner} won the game!`);
    } 
    else {
      console.log("It's a draw!");
    }
  }


//Handling of passed config file. If it exists, json will be parsed, and it will rewrite default config
//this piece of code starts the game
if (process.argv.length > 2) {
  const configFile = process.argv[2];
  fs.readFile(configFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Configuration file not found');
      return;
    }

    config = JSON.parse(data);
    startGame(config);
    
  });
} 
else {
  startGame(config);
}
