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
    isLivesModeOn: false,
    lives: 3,
    safeClicks: 3,
    isHintModeOn: false,
    megaHints: 1,
    isMegaHintOn: false,
    exterminators: 1,
    previousReveales: []
}

var gTimer = 0
var gTimerInterval

// elements
const elBody = document.querySelector(`body`)
const gElBoardContainer = document.querySelector(`.board-container`)
const elSiSelMoContainer = document.querySelector(`.size-selection-modal-container`)
const elGameContainer = document.querySelector(`.game-container`)
const elResetBtn = document.querySelector(`.reset-btn`)
const elLivesContainer = document.querySelector(`.lives-count`)
const elLivesSpan = document.querySelector(`.lives-count .lives`)
const elSafeClickSpan = document.querySelector(`#tt1 span`)
const elSafeClickBtn = document.querySelector(`#ab1`)
const elExterminatorBtn = document.querySelector(`#ab2`)
const elUndoBtn = document.querySelector(`#ab3`)
const elTimeCount = document.querySelector(`.time-count`)
const elMegaHintBtn = document.querySelector(`#mhbtn1`)

//levels

const gLevels = [
    { DIFFICULTY: 'Easy', SIZE: 6, MINES: 15 },
    { DIFFICULTY: 'Moderate', SIZE: 8, MINES: 25 },
    { DIFFICULTY: 'Difficult', SIZE: 12, MINES: 45 },
    { DIFFICULTY: 'Immpossible', SIZE: 15, MINES: 70 }
]

//hints
var HINT1 = {used: false, element: document.querySelector(`#hint1`)}
var HINT2 = {used: false, element: document.querySelector(`#hint2`)}
var HINT3 = {used: false, element: document.querySelector(`#hint3`)}
var gCurrSelectedHint = null
var gMeHitRange = []


//sounds
const BG_TENSION_AUDIO = new Audio(`audio/bg-tension-audio.mp3`)
const EXPLOSION_SOUND = new Audio(`audio/explosion.mp3`)
const DIG_SOUND = new Audio(`audio/dig.mp3`)
const FLAG_SOUND = new Audio(`audio/flag.mp3`)
const REMOVE_FLAG_SOUND = new Audio(`audio/remove-flag.mp3`)
const WOW_SOUND = new Audio(`audio/wow.mp3`)
const HINT_SOUND = new Audio(`audio/hint.mp3`)
const RELIEF_SOUND = new Audio(`audio/relief.mp3`)


// imgs
const GENERAL_IMG = {
    HAPPY: `<img src="img/general-happy.png" alt="general-happy">`,
    CALM: `<img src="img/general-calm.png" alt="general-calm">`,
    ANGRY:`<img src="img/general-angry.png" alt="general-angry">')`
}
const ACTIONS_IMG = {
    HINT: `<img src="img/hint.png" alt="hint">`,
    UNDO: `<img src="img/undo.png" alt="undo">`,
    HELMET: `<img src="img/undo.png" alt="helmet">`,
    UNDO: `<img src="img/undo.png" alt="undo">`,
    UNDO: `<img src="img/undo.png" alt="undo">`,
}

//entities

const MINE = 'MINE'
const MINE_HTML_STR = `<img class="cell-img mine" src="img/mine.webp" alt="mine">`
const HOLE = 'HOLE'
const HOLE_HTML_STR = `<div class="num-container"> <p></p></div> <img class="cell-img hole" src="img/hole.webp" alt="hole">`
const FLAG = 'FLAG'
const FLAG_HTML_STR = `<img class="cell-img flag" src="img/flag.webp" alt="flag">`