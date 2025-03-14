'use strict'

//show a hole and disable further clicking (+call the ShowNumOfMineNegs function)
function revealHole(pos) {
    const cell = gModelBoard[pos.i][pos.j]
    cell.revealed = true
    gGame.revealedCount++

    //push position to current move array
    gGame.previousReveals[gGame.userClicks-1].push(pos)

    const cellId = createIdNameFromPos(pos)

    const elCell = document.querySelector(`${cellId}`)
    elCell.innerHTML = HOLE_HTML_STR
    elCell.classList.add(`revealed`)

    ShowNumOfMineNegs(pos, cellId)
}

//recursively show all empty cells that are neighboring the selected cell
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

//show cell for specific amount of time (mine / hole with or without number of negs)
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
        elCell.classList.remove(`highlight`)

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