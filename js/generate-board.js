'use strict'

//create a mat based on selected size and fill it with cell objects with initial records
function generateModelMat(level) {
    const size = level.SIZE
    var mat = []
    for (let i = 0; i < size; i++) {
        mat[i] = []
        for (let j = 0; j < size; j++) {
            mat[i][j] = {
                type: null,
                minesAroundCount: 0,
                flagged: false,
                revealed: false
            }
        }
    }
    return mat
}

// placing random mines, ignoring the first selected cell pos and it's negs
function placeMinesInMat(level, pos) {

    //setting the initial minecount
    var minesCount = level.MINES

    //getting random position
    while (minesCount > 0) {
        const i = getRndIntIncMax(0, level.SIZE - 1)
        const j = getRndIntIncMax(0, level.SIZE - 1)

        //making sure the random position is not the selected cell or it's neighbors
        var isPosValid = true
        for (let row = pos.i - 1; row <= pos.i + 1; row++) {
            for (let col = pos.j - 1; col <= pos.j + 1; col++) {
                if (i === row && j === col) isPosValid = false
            }
        }
        if (!isPosValid) continue

        //setting a mine in case there wasn't any mine before
        if (gModelBoard[i][j].type === null) {
            gModelBoard[i][j].type = MINE
            minesCount--
        }

    }
}

//running through the matrix and updates all cells negs count
function setMinesNegsCount() {
    for (let i = 0; i < gModelBoard.length; i++) {
        for (let j = 0; j < gModelBoard[i].length; j++) {
            gModelBoard[i][j].minesAroundCount = countNegsMines({i, j})
        }
    }
}

//calculating the negs mines of a specific cell
function countNegsMines(pos) {
    var count = 0
    for (let i = pos.i - 1; i <= pos.i + 1; i++) {
        for (let j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i < 0 || j < 0 ||
                i > gModelBoard.length - 1 ||
                j > gModelBoard[i].length - 1 ||
                (i === pos.i && j === pos.j)) continue

            if (gModelBoard[i][j].type === MINE) count++
        }
    }
    return count
}

// showing the empty board ready for first click
function renderEmptyBoard() {
    var strHtml = ''

    strHtml += `<table class="board">\n`

    for (let i = 0; i < gModelBoard.length; i++) {
        strHtml += `<tr>\n`
        for (let j = 0; j < gModelBoard[i].length; j++) {
            strHtml += `<th
                        id="c-${i}-${j}"
                        class="cell covered"
                        data-i="${i}" data-j="${j}"
                        onclick="onCellClick(this,${i},${j})"
                        oncontextmenu="onCellRightClick(event,this,${i},${j})" 
                        onmouseover="onCellHoverIn(this,'c-${i}-${j}',${i},${j})" 
                        onmouseout="onCellHoverOut(this,'c-${i}-${j}',${i},${j})" 
                        >\n`
        }
        strHtml += `</th>\n`

    }
    strHtml += `</tr>\n </table>`

    gElBoardContainer.innerHTML = strHtml
}