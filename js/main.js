'use strict'


function onInit() {
    onStart(gLevels[0])
}


function onSizeSelectionButtonClick() {

}

function onStart(level) {
    gModelBoard = generateModelMat(level)
    placeMinesInMat(level)
    setMinesNegsCount()
    console.log("gModelBoard: ", gModelBoard)
    renderEmptyBoard()

    // var elCell = document.querySelector(`.cell`)
}

function onCellClick(elCell, i, j) {
    const cell = gModelBoard[i][j]
    const pos = { i, j }

    if (cell.flagged) return
    if (cell.revealed) return

    switch (cell.type) {
        case null:
            revealHole(pos)
            if (cell.minesAroundCount === 0) {
                revealNegsHoles(pos)

            }
            break
        case MINE:
            elCell.innerHTML = MINE_HTML_STR
            cell.revealed = true //need to make sure it doesn't creates problems
            break

    }
}


function onCellRightClick(ev, elCell, i, j) {
    ev.preventDefault()
    const cell = gModelBoard[i][j]
    if (cell.revealed) return
    if (cell.flagged === false) {
        cell.flagged = true
        gGame.markedCount++
        elCell.innerHTML = FLAG_HTML_STR
        elCell.classList.add(`flagged`)
    } else {
        cell.flagged = false
        gGame.markedCount--
        elCell.innerHTML = ``
        elCell.classList.remove(`flagged`)
    }

}

function revealHole(pos) {
    const cell = gModelBoard[pos.i][pos.j]
    cell.revealed = true
    gGame.revealedCount++

    const cellId = createIdNameFromPos(pos)

    const elCell = document.querySelector(`${cellId}`)
    elCell.innerHTML = HOLE_HTML_STR

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

            // console.log("cell: ", cell)
            // console.log("i,j: ", i, j)
            revealHole(pos)
            if (cell.minesAroundCount === 0) {
                revealNegsHoles({ i, j })
            }

        }
    }
}





function createIdNameFromPos(pos) {
    return `#c-${pos.i}-${pos.j}`
}