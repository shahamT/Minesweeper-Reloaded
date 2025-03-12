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
    gGame.lives = 3
    gGame.previousReveales = []

    //show level selection modal
    elSiSelMoContainer.hidden = false

    //hide reset button
    elResetBtn.hidden = true
}

function onCellClick(elCell, i, j) {
    const cell = gModelBoard[i][j]
    const pos = { i, j }

    //cases that are non clickable
    if (cell.flagged ||
        cell.revealed ||
        !gGame.isOn
    ) return

    //if it's the first click set the mines correctly
    if (gGame.revealedCount === 0) {
        placeMinesInMat(gGame.currLevel, pos)
        setMinesNegsCount()
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

    var elNum = document.querySelector(`${cellId} p`)
    if (cell.minesAroundCount !== 0) {
        elNum.innerText = cell.minesAroundCount
    }

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


