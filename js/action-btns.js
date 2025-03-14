'use strict'

function showTootip(ttId) {
    var tt = document.querySelector(`#${ttId}`)
    tt.hidden = false
}
function hideTootip(ttId) {
    var tt = document.querySelector(`#${ttId}`)
    tt.hidden = true
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

function disableAllActionbtns(){
    
}