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
        elHintBtn.classList.toggle(`hint-selected`)
        gGame.isHintModeOn = !gGame.isHintModeOn
        // gCurrSelectedHint = hintNum
    }


    //make all cells get the on hint hover class
    // add(`hint-hover`)
    //TODO finish this design
}

function showHint() {
    elHintBtn.classList.remove(`hint-selected`)
    
    gGame.isHintModeOn = false

}