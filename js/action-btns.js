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

    //do not allow hints before the mines are set
    if (gGame.revealedCount === 0) return
    //TODO show the user some message...

    if (hintNum.used === false) {
        if (gCurrSelectedHint !== null && gCurrSelectedHint !== hintNum) { //if another hint button is set as selected 
            gCurrSelectedHint.element.classList.toggle(`hint-selected`) //turn off prev selectd hint
            gCurrSelectedHint = hintNum
            elHintBtn.classList.toggle(`hint-selected`)
            //in this case hint mode is still on so i don't need to toggle it
        } else {
            elHintBtn.classList.toggle(`hint-selected`)
            gCurrSelectedHint = hintNum
            gGame.isHintModeOn = !gGame.isHintModeOn
        }
    }


    //make all cells get the on hint hover class
    // add(`hint-hover`)
    //TODO finish this design
}

function showHint(pos) {
    gCurrSelectedHint.element.classList.remove(`hint-selected`)
    gCurrSelectedHint.element.classList.add(`btn-disabled`)
    gGame.isHintModeOn = false

    for (let i = pos.i - 1; i <= pos.i + 1; i++) {
        for (let j = pos.j - 1; j <= pos.j + 1; j++) {

            if (i < 0 || j < 0 ||
                i > gModelBoard.length - 1 ||
                j > gModelBoard[i].length - 1) {
                continue
            }
            if (gModelBoard[i][j].revealed === false) {
                revealCellTemp({ i, j }, 1500)
            }
        }
    }
    gCurrSelectedHint = null //clearing the selected hint for next use

}