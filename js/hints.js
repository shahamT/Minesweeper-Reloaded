'use strict'

function onHintBtnClick(elHintBtn, hintNum) {

    //do not allow hints before the mines are set and if the hint is used
    if (gGame.revealedCount === 0 || hintNum.used === true) return

    //clear megahint against overlap functions
    clearAllMegaHintsRecords()
    clearAllHighlightCells()

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

    if (gGame.isMegaHintOn) {
        elMegaHintBtn.classList.remove(`hint-selected`)
        gGame.isMegaHintOn = false
        clearAllMegaHintsRecords()
        clearAllHighlightCells()
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

    //if it's the first selection, wait for second selection
    if (gMeHitRange.length === 1) return

    //organize the selection so it will work for all directions
    var posA = {}
    var posB = {}
    if (gMeHitRange[0].i < gMeHitRange[1].i) {
        posA.i = gMeHitRange[0].i
        posB.i = gMeHitRange[1].i
    } else {
        posA.i = gMeHitRange[1].i
        posB.i = gMeHitRange[0].i
    }

    if (gMeHitRange[0].j < gMeHitRange[1].j) {
        posA.j = gMeHitRange[0].j
        posB.j = gMeHitRange[1].j
    } else {
        posA.j = gMeHitRange[1].j
        posB.j = gMeHitRange[0].j
    }

    //run through the range

    for (let i = posA.i; i <= posB.i; i++) {
        for (let j = posA.j; j <= posB.j; j++) {
            if (!gModelBoard[i][j].revealed) {
                revealCellTemp({ i, j }, 2000) //revealing the cell for 2 sec
            }
        }
    }
    WOW_SOUND.play()

    //clear all for next use
    gGame.megaHints--
    clearAllMegaHintsRecords()

    // //clear all highlighted cells after 2 sec (together with the temp reveal)
    // var tempHighlight = setTimeout(() => {
    //     clearAllHighlightCells()
    //     clearTimeout(tempHighlight)
    //     tempHighlight = null
    // }, 1800)

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
    HINT_SOUND.currentTime = 0

}

function clearAllMegaHintsRecords() {
    gMeHitRange = []
    gGame.isMegaHintOn = false
    elMegaHintBtn.classList.remove(`hint-selected`)
    HINT_SOUND.currentTime = 0
    // clearAllHighlightCells()

}

function onCellHoverIn(elCell, cellId, i, j) {
    const pos = { i, j }
    if (gGame.isMegaHintOn) {
        if (gMeHitRange.length === 0) {
            elCell.classList.add(`highlight`)
        } else {
            clearAllHighlightCells() //i need thiss here becaus if the user take the mouse outside of the matrix bounderies and coming back in diffrent position it's causing problems
            const orgCells = organizePositions({ i, j }, { i: gMeHitRange[0].i, j: gMeHitRange[0].j })
            const posA = orgCells[0]
            const posB = orgCells[1]
            highlightAllCellsInRange(posA, posB)
        }

    } else if (gGame.isHintModeOn) {
        elCell.classList.add(`highlight`)
    }
    return
}


function onCellHoverOut(elCell, cellId, i, j) {
    const pos = { i, j }
    if (gGame.isMegaHintOn) {
        if (gMeHitRange.length === 0) {
            elCell.classList.remove(`highlight`)
        } else {
            clearAllHighlightCells()
            const orgCells = organizePositions({ i, j }, { i: gMeHitRange[0].i, j: gMeHitRange[0].j })
            const posA = orgCells[0]
            const posB = orgCells[1]
            highlightAllCellsInRange(posA, posB)
        }

    } else if (gGame.isHintModeOn) {
        elCell.classList.remove(`highlight`)
    }
    return
}

//gets 2 organized positions and add highlight class to all cells in range
function highlightAllCellsInRange(posA, posB) {
    for (let i = posA.i; i <= posB.i; i++) {
        for (let j = posA.j; j <= posB.j; j++) {
            if (!gModelBoard[i][j].revealed) {
                const CurrCellId = createIdNameFromPos({ i, j })
                var elCurrCell = document.querySelector(CurrCellId)
                elCurrCell.classList.add(`highlight`)
            }
        }
    }
}

//clears all highlight class from all cells in matrix
function clearAllHighlightCells() {
    var cells = document.querySelectorAll(`.cell`)
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove(`highlight`)
    }
}

//gets 2 positions in matrix and organize them so A will be the top left one and B will be the lower right one
function organizePositions(rndPosA, rndPosB) {
    var posA = {}
    var posB = {}
    if (rndPosA.i < rndPosB.i) {
        posA.i = rndPosA.i
        posB.i = rndPosB.i
    } else {
        posA.i = rndPosB.i
        posB.i = rndPosA.i
    }

    if (rndPosA.j < rndPosB.j) {
        posA.j = rndPosA.j
        posB.j = rndPosB.j
    } else {
        posA.j = rndPosB.j
        posB.j = rndPosA.j
    }

    return [posA, posB]
}