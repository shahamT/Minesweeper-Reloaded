'use strict'

function showTootip(ttId) {
    var tt = document.querySelector(`#${ttId}`)
    tt.hidden = false
}
function hideTootip(ttId) {
    var tt = document.querySelector(`#${ttId}`)
    tt.hidden = true
}


function onHintBtnClick(elHintBtn, hintNum) {

    //do not allow hints before the mines are set and if the hint is used
    if (gGame.revealedCount === 0 || hintNum.used === true) return

    //clear megahint against overlap functions
    clearAllMegaHintsRecords()

    // if the clicked hint is already selected...
    if (hintNum === gCurrSelectedHint) {
        clearAllHintsRecords()
        return
    } else if (gCurrSelectedHint !== null && gCurrSelectedHint !== hintNum) { //if another hint button is set as selected 
        clearAllHintsRecords() //turn off prev selectd hint
        gCurrSelectedHint = hintNum
        gGame.isHintModeOn = true
        elHintBtn.classList.toggle(`hint-selected`)
    } else {
        elHintBtn.classList.toggle(`hint-selected`)
        gCurrSelectedHint = hintNum
        gGame.isHintModeOn = !gGame.isHintModeOn
    }

    //play sound
    HINT_SOUND.play()

    //make all cells get the on hint hover class
    // add(`hint-hover`)
    //TODO finish this design
}

function showHint(pos) {

    //play sound
    WOW_SOUND.play()

    //disable hint btn and turn hint mode off + clearing current selected hint for next use
    gCurrSelectedHint.element.classList.remove(`hint-selected`)
    gCurrSelectedHint.element.classList.add(`btn-disabled`)
    gCurrSelectedHint.used = true
    gGame.isHintModeOn = false
    gCurrSelectedHint = null

    //show all negs including the selected cell
    for (let i = pos.i - 1; i <= pos.i + 1; i++) {
        for (let j = pos.j - 1; j <= pos.j + 1; j++) {

            if (i < 0 || j < 0 ||
                i > gModelBoard.length - 1 ||
                j > gModelBoard[i].length - 1) {
                continue
            }
            if (gModelBoard[i][j].revealed === false) {
                revealCellTemp({ i, j }, 1500) //revealing the cell for 1.5 sec
            }
        }
    }

}



function onMegaHintBtnClick() {
    //do not allow hints before the mines are set
    if (gGame.revealedCount === 0 || gGame.megaHints === 0) return

    if (gGame.isMegaHintOn){
        elMegaHintBtn.classList.remove(`hint-selected`)
        gGame.isMegaHintOn = false
    } else {
        elMegaHintBtn.classList.add(`hint-selected`)
        gGame.isMegaHintOn = true 
    }

    //make sure there is no overlap with regular hint
    clearAllHintsRecords()

    if (!gGame.isMegaHintOn) {  //if i'm canceling, reset all changes related to the mega hint mode
        // clearAllMegaHintsRecords()
        // clearAllHighlightedCells() //TODO weite this function
        return
    }
    //play sound
    HINT_SOUND.play()

    //make all cells get the on hint hover class
    // add(`hint-hover`)
    //TODO finish this design

}

function megahintFlow(pos) {
    //push the selected pos to array
    gMeHitRange.push(pos)

    //play sound 
    HINT_SOUND.currentTime = 0
    HINT_SOUND.play()

    //if it's the first selection, wait for second selection
    if (gMeHitRange.length === 1) return

    //run through the range

    for (let i = gMeHitRange[0].i; i <= gMeHitRange[1].i; i++) {
        for (let j = gMeHitRange[0].j; j <= gMeHitRange[1].j; j++) {
            if (!gModelBoard[i][j].revealed) {
                revealCellTemp({ i, j }, 2000) //revealing the cell for 2 sec
            }
        }
    }
    WOW_SOUND.play()

    //clear all for next use
    gGame.megaHints--
    clearAllMegaHintsRecords()
    
    //disable the btn if no more mega hints allowed
    if (gGame.megaHints === 0) {
        elMegaHintBtn.classList.add(`btn-disabled`)
    }
}

function clearAllHintsRecords() {
    if (gCurrSelectedHint !== null) {
        gCurrSelectedHint.element.classList.toggle(`hint-selected`)
    }
    gCurrSelectedHint = null
    gGame.isHintModeOn = false
}

function clearAllMegaHintsRecords() {
    gMeHitRange = []
    gGame.isMegaHintOn = false
    elMegaHintBtn.classList.remove(`hint-selected`)
}


function onSafeClick() {

    if (gGame.safeClicks === 0) return //if there are no more safe clicks, abort

    //play sound
    RELIEF_SOUND.play()

    //update safe clicks in model and DOM
    gGame.safeClicks--
    elSafeClickSpan.innerText = gGame.safeClicks
    if (gGame.safeClicks === 0) {   //make btn diasbled if no more safe clicks
        elSafeClickBtn.classList.add(`btn-disabled`)
    }

    //create an array of all safe cells positions
    var safeCells = []
    for (let i = 0; i < gModelBoard.length; i++) {
        for (let j = 0; j < gModelBoard[i].length; j++) {
            if (!gModelBoard[i][j].revealed && gModelBoard[i][j].type === null) { //if the cell is not revealed and not a mine
                safeCells.push({ i, j })
            }
        }
    }

    const safeCell = safeCells[getRndIntExcMax(0, gModelBoard.length)] //choose one safe cell randomly

    //update safe cell visual
    const cellId = createIdNameFromPos(safeCell)
    var elCell = document.querySelector(cellId)
    elCell.classList.add(`safe`)

    //removing visual after 1.5 sec
    var removeSafe = setTimeout(() => {
        elCell.classList.remove(`safe`)
        clearTimeout(removeSafe)
        removeSafe = null
    }, 1500)

}


function onExterminatorClick() {
    //if there are no more exterminators, or mines were not yet set - abort
    if (gGame.exterminators === 0 || gGame.revealedCount === 0) return

    //update exterminators in model and DOM
    gGame.exterminators--
    if (gGame.exterminators === 0) {   //make btn diasbled if no more exterminators
        elExterminatorBtn.classList.add(`btn-disabled`)
    }

    //create an array of all mines positions
    var minesCells = []
    for (let i = 0; i < gModelBoard.length; i++) {
        for (let j = 0; j < gModelBoard[i].length; j++) {
            if (!gModelBoard[i][j].revealed && !gModelBoard[i][j].flagged && gModelBoard[i][j].type === MINE) { //if the cell is not revealed and is a mine
                minesCells.push({ i, j })
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        //TODO fix the bug below... the function doesn't work correctly when it's not in comment
        // if (i => minesCells) continue //in case there are less then 3 mines on the board

        const mineCell = minesCells[getRndIntExcMax(0, minesCells.length)]
        const cellId = createIdNameFromPos(mineCell)

        var elCell = document.querySelector(cellId)

        elCell.innerHTML = MINE_HTML_STR
        elCell.classList.add(`exploded`)

        // i had to use an external function here because i need the elCell element to be in a scope of it's own
        explodeTemporarily(elCell)

        //clearing the mine from the cell
        gModelBoard[mineCell.i][mineCell.j].type = null
    }

    //after reavealing all 3
    updateNegsCountforRevealedCells()
    EXPLOSION_SOUND.play()
    shakeItAll()

}

function explodeTemporarily(elCell) {
    var backToGame = setTimeout(() => {
        elCell.innerHTML = ''
        elCell.classList.remove(`exploded`)
        clearTimeout(backToGame)
        backToGame = null
    }, 1500)
}


function updateNegsCountforRevealedCells() {
    for (let i = 0; i < gModelBoard.length; i++) {
        for (let j = 0; j < gModelBoard[i].length; j++) {
            if (gModelBoard[i][j].revealed && gModelBoard[i][j].type === null) { //if the cell is revealed and is null

                //update Negs count
                gModelBoard[i][j].minesAroundCount = countNegsMines({ i, j })

                //update DOM
                const cellId = createIdNameFromPos({ i, j })
                ShowNumOfMineNegs({ i, j }, cellId)
            }
        }
    }


}