'use strict'

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


function placeMinesInMat(level) {
    var minesCount = level.MINES
    while (minesCount > 0) {
        const i = getRndIntIncMax(0, level.SIZE - 1)
        const j = getRndIntIncMax(0, level.SIZE - 1)

        if (gModelBoard[i][j].type === null) {
            gModelBoard[i][j].type = MINE
            minesCount--
        }

    }
}


function setMinesNegsCount() {
    for (let i = 0; i < gModelBoard.length; i++) {
        for (let j = 0; j < gModelBoard[i].length; j++) {
            gModelBoard[i][j].minesAroundCount = countNegsMines(i, j)
        }
    }
}

function countNegsMines(iIdx, jIdx) {
    var count = 0
    for (let i = iIdx - 1; i <= iIdx + 1; i++) {
        for (let j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i < 0 || j < 0 ||
                i > gModelBoard.length - 1 ||
                j > gModelBoard[i].length - 1 ||
                (i === iIdx && j === jIdx)) continue

            if (gModelBoard[i][j].type === MINE) count++
        }
    }
    return count
}

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
                        >\n`
        }
        strHtml += `</th>\n`

    }
    strHtml += `</tr>\n </table>`

    gElBoardContainer.innerHTML = strHtml
}