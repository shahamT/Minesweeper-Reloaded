'use strict'

//displaying welcome modal
function onInit() {
    //render level selection buttons
    renderSizeSelectionButtons()

    //reset all gGame properties
    gGame.isOn = false

    //show welcome modal
    gElSiSelMoContainer.hidden = false

}

//resets all records + set modes according to user selection
function onStart(level) {
    //crate model matrix
    gModelBoard = generateModelMat(level)

    //render board
    renderEmptyBoard()

    //turn game ON
    gGame.isOn = true

    //reset counts
    gGame.revealedCount = 0
    gGame.flaggedCount = 0

    //reset first click
    gGame.firstClick = true

    //show lives if this mode is ON
    if (gGame.isLivesModeOn) {
        gGame.lives = 3
        gElLivesContainer.hidden = false
        gElLivesSpan.innerText = gGame.lives
    }
    //hide lives if this mode is OFF
    if (!gGame.isLivesModeOn) {
        gElLivesContainer.hidden = true
    }

    //set reset button general img
    setGeneralFace(GENERAL_IMG.CALM)

    //reset hint buttons to be disabled
    clearAllHintsRecords()
    HINT1.element.classList.add(`btn-disabled`)
    HINT2.element.classList.add(`btn-disabled`)
    HINT3.element.classList.add(`btn-disabled`)
    HINT1.used = false
    HINT2.used = false
    HINT3.used = false

    //reset megahints
    gGame.megaHints = 1
    gElMegaHintBtn.classList.add(`btn-disabled`)
    clearAllMegaHintsRecords()


    //reset safe clicks
    gGame.safeClicks = 3
    gElSafeClickSpan.innerText = gGame.safeClicks
    gElSafeClickBtn.classList.remove(`btn-disabled`)

    //reset exterminator
    gGame.exterminators = 1
    gElExterminatorBtn.classList.add(`btn-disabled`)

    //hide modal and show game
    gElSiSelMoContainer.hidden = true
    gElGameContainer.hidden = false

    //reset timer and start
    gTimer = 0
    gElTimeCount.innerText = gTimer
    clearInterval(gTimerInterval)
    gTimerInterval = null
    runTimer()

    //reset previous reveales
    gGame.userClicks = 0
    gGame.previousReveals = []
    gElUndoBtn.classList.add(`btn-disabled`)

    //play bg sound
    BG_TENSION_AUDIO.currentTime = 0
    BG_TENSION_AUDIO.play()

}

//on left click - apply action according to active modes or states
function onCellClick(elCell, i, j) {
    const cell = gModelBoard[i][j]
    const pos = { i, j }

    //cases that are non clickable
    if (cell.flagged ||
        cell.revealed ||
        !gGame.isOn
    ) return

    //if hint mode is on
    if (gGame.isHintModeOn === true) {
        showHint(pos)
        return
    }

    //if Mega-hint mode is on
    if (gGame.isMegaHintOn === true) {
        megahintFlow(pos)
        return
    }

    //if it's the first click set the mines correctly + allow hints
    if (gGame.firstClick === true) {
        gGame.firstClick = false
        placeMinesInMat(gGame.currLevel, pos)
        setMinesNegsCount()
        activateActionBtns()
    }

    //set the result of clicking an empty cell or a mine
    switch (cell.type) {
        case null:
            //create new array to hold all reveales in this click
            gGame.userClicks++
            gGame.previousReveals.push([])

            DIG_SOUND.play()
            revealHole(pos)
            if (cell.minesAroundCount === 0) {
                revealNegsHoles(pos)
            }
            checkIfWin()
            console.log(gGame.previousReveals)
            break

        case MINE:
            //is 3 lives mode on??
            if (!gGame.isLivesModeOn) {
                explodeGameOver(elCell, pos)
            } else explodeLoseLive(elCell, pos)
            break

    }
}

//on right click - flag
function onCellRightClick(ev, elCell, i, j) {
    //prevent right click menu
    ev.preventDefault()

    const cell = gModelBoard[i][j]

    //unclickable situations
    if (cell.revealed || !gGame.isOn) return

    //if cell is not flagged
    if (!cell.flagged) {
        //flag the cell and update model and DOM
        cell.flagged = true
        gGame.flaggedCount++
        elCell.innerHTML = FLAG_HTML_STR
        elCell.classList.add(`flagged`)
        FLAG_SOUND.currentTime = 0
        FLAG_SOUND.play()

        //check if WIN
        checkIfWin()

    } else {
        //if the cell is already flagged, remoce flag, update model and DOM
        cell.flagged = false
        gGame.flaggedCount--
        elCell.innerHTML = ``
        elCell.classList.remove(`flagged`)
        REMOVE_FLAG_SOUND.currentTime = 0
        REMOVE_FLAG_SOUND.play()
    }

}

function runTimer() {
    gTimerInterval = setInterval(() => {
        gTimer++
        gElTimeCount.innerText = gTimer
    }, 1000)
}

function stopTimer() {
    clearInterval(gTimerInterval)
    gTimerInterval = null
    gElTimeCount.innerText = gTimer
}



