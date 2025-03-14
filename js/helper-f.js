'use strict'


function createIdNameFromPos(pos) {
    return `#c-${pos.i}-${pos.j}`
}

function setGeneralFace(img) {
    gElResetBtn.innerHTML = img
}

function activateActionBtns() {
    HINT1.element.classList.remove(`btn-disabled`)
    HINT2.element.classList.remove(`btn-disabled`)
    HINT3.element.classList.remove(`btn-disabled`)
    gElExterminatorBtn.classList.remove(`btn-disabled`)
    gElMegaHintBtn.classList.remove(`btn-disabled`)
    gElUndoBtn.classList.remove(`btn-disabled`)
}