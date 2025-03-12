'use strict'

// cell object structure:
//     {
//     type: null,
//     minesAroundCount: 0,
//     flagged: false,
//     revealed: false
//     }


//game

var gModelBoard = []

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    currentLevel: null,
    secsPassed: 0
}

// elements
const gElBoardContainer = document.querySelector(`.board-container`)



//levels

const gLevels = [
    { DIFFICULTY: 'Easy', SIZE: 6, MINES: 5 },
    { DIFFICULTY: 'Moderate', SIZE: 8, MINES: 6 },
    { DIFFICULTY: 'Difficult', SIZE: 12, MINES: 6 },
    { DIFFICULTY: 'Immpossible', SIZE: 15, MINES: 6 }
]

//sounds



// imgs


//entities

const MINE = 'MINE'
const MINE_HTML_STR = `<img class="cell-img mine" src="../img/mine.webp" alt="mine">`
const HOLE = 'HOLE'
const HOLE_HTML_STR = `<div class="num-container"> <p></p></div> <img class="cell-img hole" src="../img/hole.webp" alt="hole">`
const FLAG = 'FLAG'
const FLAG_HTML_STR = `<img class="cell-img flag" src="../img/flag.webp" alt="flag">`