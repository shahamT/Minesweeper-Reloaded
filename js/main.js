'use strict'

function onInit() {
    //render level selection buttons
    renderSizeSelectionButtons()

    //reset all gGame properties
    gGame.isOn = false
    gGame.revealedCount = 0
    gGame.flaggedCount = 0
    gGame.secsPassed = 0
    gGame.isLivesModeOn = false
    gGame.previousReveales = []

    //show level selection modal
    elSiSelMoContainer.hidden = false

    //set reset button general img
    setGeneralFace(GENERAL_IMG.CALM)

    //reset timer
    gTimer = 0
    elTimeCount.innerText = gTimer

}

function onCellClick(elCell, i, j) {
    const cell = gModelBoard[i][j]
    const pos = { i, j }

    console.log("gGame.isMegaHintOn: ", gGame.isMegaHintOn)
    console.log("gGame.megaHints: ", gGame.megaHints)
    
    //cases that are non clickable
    if (cell.flagged ||
        cell.revealed ||
        !gGame.isOn
    ) return

    //if it's the first click set the mines correctly + allow hints
    if (gGame.revealedCount === 0) {
        placeMinesInMat(gGame.currLevel, pos)
        setMinesNegsCount()
        activateActionBtns()

    }

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

    //set the result of clicking an empty cell or a mine
    switch (cell.type) {
        case null:
            DIG_SOUND.play()
            revealHole(pos)
            if (cell.minesAroundCount === 0) {
                revealNegsHoles(pos)
            }
            checkIfWin()
            break

        case MINE:
            //is 3 lives mode on??
            if (!gGame.isLivesModeOn) {
                explodeGameOver(elCell, pos)
            } else explodeLoseLive(elCell, pos)
            break

    }
}

function onCellRightClick(ev, elCell, i, j) {
    ev.preventDefault()
    const cell = gModelBoard[i][j]
    if (cell.revealed || !gGame.isOn) return
    if (cell.flagged === false) {

        cell.flagged = true
        gGame.flaggedCount++
        elCell.innerHTML = FLAG_HTML_STR
        elCell.classList.add(`flagged`)

        FLAG_SOUND.currentTime = 0
        FLAG_SOUND.play()

        //check if WIN
        checkIfWin()

    } else {
        cell.flagged = false
        gGame.flaggedCount--
        elCell.innerHTML = ``
        elCell.classList.remove(`flagged`)
        REMOVE_FLAG_SOUND.currentTime = 0
        REMOVE_FLAG_SOUND.play()
    }

}

function revealHole(pos) {
    const cell = gModelBoard[pos.i][pos.j]
    cell.revealed = true
    gGame.revealedCount++

    const cellId = createIdNameFromPos(pos)

    const elCell = document.querySelector(`${cellId}`)
    elCell.innerHTML = HOLE_HTML_STR
    elCell.classList.add(`revealed`)

    ShowNumOfMineNegs(pos, cellId)
}

function revealNegsHoles(pos) {
    for (let i = pos.i - 1; i <= pos.i + 1; i++) {
        for (let j = pos.j - 1; j <= pos.j + 1; j++) {

            if (i < 0 || j < 0 ||
                i > gModelBoard.length - 1 ||
                j > gModelBoard[i].length - 1 ||
                (i === pos.i && j === pos.j)) {
                continue
            }

            var cell = gModelBoard[i][j]
            if (cell.type === MINE ||
                cell.revealed === true) {
                continue
            }

            revealHole({ i, j })
            if (cell.minesAroundCount === 0) {
                revealNegsHoles({ i, j })
            }

        }
    }
}

function createIdNameFromPos(pos) {
    return `#c-${pos.i}-${pos.j}`
}

function setGeneralFace(img) {
    elResetBtn.innerHTML = img
}

function revealCellTemp(pos, time, elCell = undefined) {
    if (!elCell) {
        const cellId = createIdNameFromPos(pos)
        elCell = document.querySelector(cellId)
    }
    const cell = gModelBoard[pos.i][pos.j]
    const cellId = createIdNameFromPos(pos)

    switch (cell.type) {
        case null:
            elCell.innerHTML = HOLE_HTML_STR
            ShowNumOfMineNegs(pos, cellId)
            break
        case MINE:
            elCell.innerHTML = MINE_HTML_STR
            break
    }
    elCell.classList.add(`revealed`)

    //pause the game
    gGame.isOn = false

    //hide cell back after x time
    var revealTime = setTimeout(() => {
        elCell.innerHTML = ``
        elCell.classList.remove(`revealed`)

        //game is back
        gGame.isOn = true

        clearTimeout(revealTime)
        revealTime = null
    }, time)


}

function ShowNumOfMineNegs(pos, cellId) {

    const cell = gModelBoard[pos.i][pos.j]
    var elNum = document.querySelector(`${cellId} p`)

    if (cell.minesAroundCount !== 0) {
        elNum.innerText = cell.minesAroundCount
    }

    //reset the color in case it has previous color
    elNum.classList.remove(`num1`, `num2`, `num3`, `num4`, `num5`, `num6`, `num7`, `num8`)

    switch (cell.minesAroundCount) {
        case 1: elNum.classList.add(`num1`)
            break
        case 2: elNum.classList.add(`num2`)
            break
        case 3: elNum.classList.add(`num3`)
            break
        case 4: elNum.classList.add(`num4`)
            break
        case 5: elNum.classList.add(`num5`)
            break
        case 6: elNum.classList.add(`num6`)
            break
        case 7: elNum.classList.add(`num7`)
            break
        case 8: elNum.classList.add(`num8`)
            break
    }
}

function runTimer() {
    gTimerInterval = setInterval(() => {
        gTimer++
        elTimeCount.innerText = gTimer
    }, 1000)
}

function stopTimer() {
    clearInterval(gTimerInterval)
    gTimerInterval = null
    elTimeCount.innerText = gTimer
}

function activateActionBtns() {
    HINT1.element.classList.remove(`btn-disabled`)
    HINT2.element.classList.remove(`btn-disabled`)
    HINT3.element.classList.remove(`btn-disabled`)
    elExterminatorBtn.classList.remove(`btn-disabled`)
    elMegaHintBtn.classList.remove(`btn-disabled`)
}


