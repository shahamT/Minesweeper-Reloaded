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

  //show lives if this mode is ON
  if (gGame.isLivesModeOn){
    gGame.lives = 3
    elLivesContainer.hidden = false
    elLivesSpan.innerText = gGame.lives
  } 

  //reset hint buttons to be disabled
  HINT1.element.classList.add(`btn-disabled`)
  HINT2.element.classList.add(`btn-disabled`)
  HINT3.element.classList.add(`btn-disabled`)
    
  //hide modal and show game
  elSiSelMoContainer.hidden = true
  elGameContainer.hidden = false


}


function onLivesModeOn(el) {
  if (el.checked) {
    gGame.isLivesModeOn = true
  } else {
    gGame.isLivesModeOn = false

  }
}