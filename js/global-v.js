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
    flaggedCount: 0,
    currLevel: null,
    secsPassed: 0,
    isLivesModeOn: false,
    lives: 3,
    previousReveales: []
}

// elements
const elBody = document.querySelector(`body`)
const gElBoardContainer = document.querySelector(`.board-container`)
const elSiSelMoContainer = document.querySelector(`.size-selection-modal-container`)
const elGameContainer = document.querySelector(`.game-container`)
const elResetBtn = document.querySelector(`.reset-btn`)

//levels

const gLevels = [
    { DIFFICULTY: 'Easy', SIZE: 6, MINES: 15 },
    { DIFFICULTY: 'Moderate', SIZE: 8, MINES: 25 },
    { DIFFICULTY: 'Difficult', SIZE: 12, MINES: 45 },
    { DIFFICULTY: 'Immpossible', SIZE: 15, MINES: 70 }
]

//sounds
const EXPLOSION_SOUND = new Audio(`../audio/explosion.mp3`)
const DIG_SOUND = new Audio(`../audio/dig.mp3`)
const FLAG_SOUND = new Audio(`../audio/flag.mp3`)
const REMOVE_FLAG_SOUND = new Audio(`../audio/remove-flag.mp3`)


// imgs


//entities

const MINE = 'MINE'
const MINE_HTML_STR = `<img class="cell-img mine" src="../img/mine.png" alt="mine">`
const HOLE = 'HOLE'
const HOLE_HTML_STR = `<div class="num-container"> <p></p></div> <img class="cell-img hole" src="../img/hole.png" alt="hole">`
const FLAG = 'FLAG'
const FLAG_HTML_STR = `<img class="cell-img flag" src="../img/flag.png" alt="flag">`