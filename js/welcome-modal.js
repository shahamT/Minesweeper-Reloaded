'use strict'

function renderSizeSelectionButtons() {
  var elbtnsContainer = document.querySelector('.size-selection .btns-container')
  var btnsStr = ''
  for (let i = 0; i < gLevels.length; i++) {
      btnsStr += `<button class="size-btns" id="btn${i}"
              onclick="onSizeSelectionButtonClick(${i})">${gLevels[i].SIZE} (${gLevels[i].DIFFICULTY})
              </button>`
  }
  elbtnsContainer.innerHTML = btnsStr
  // gElSizeBtns = document.querySelectorAll('.size-btns')
}

function onSizeSelectionButtonClick(idx) {
  //set current level according to selection
  gGame.currLevel = gLevels[idx]

  //hide modal and show game
  elSiSelMoContainer.hidden = true
  elGameContainer.hidden = false

  //start game
  onStart(gLevels[idx])
}

function onStart(level) {
  //crate model matrix
  gModelBoard = generateModelMat(level)

  // console.log("gModelBoard: ", gModelBoard)

  //render board
  renderEmptyBoard()

  //turn game ON
  gGame.isOn = true

}


function onLivesModeOn(el) {
  if (el.checked) {
    gGame.isLivesModeOn = true
  } else {
    gGame.isLivesModeOn = true

  }
}