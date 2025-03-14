'use strict'

//render buttons according to availible levels in gLevels array
function renderSizeSelectionButtons() {
  var btnsStr = ''
  for (let i = 0; i < gLevels.length; i++) {
    btnsStr += `<button class="size-btns" id="btn${i}"
              onclick="onSizeSelectionButtonClick(${i})">${gLevels[i].SIZE} (${gLevels[i].DIFFICULTY})
              </button>`
  }
  gElbtnsContainer.innerHTML = btnsStr
  // gElSizeBtns = document.querySelectorAll('.size-btns')
}

//starts the game based on the selected difficulty
function onSizeSelectionButtonClick(idx) {
  //set current level according to selection
  gGame.currLevel = gLevels[idx]

  //start game
  onStart(gLevels[idx])
}

//when clicking on live mode toggle - switch mode ON-OFF
function onLivesModeOn(el) {
  if (el.checked) {
    gGame.isLivesModeOn = true
  } else {
    gGame.isLivesModeOn = false

  }
}