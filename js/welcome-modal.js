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

  //render board
  renderEmptyBoard()

  //turn game ON
  gGame.isOn = true

  //show lives if this mode is ON
  if (gGame.isLivesModeOn) {
    gGame.lives = 3
    elLivesContainer.hidden = false
    elLivesSpan.innerText = gGame.lives
  }
   //hide lives if this mode is OFF
   if (!gGame.isLivesModeOn) {
    elLivesContainer.hidden = true
  }

  //reset hint buttons to be disabled
  clearAllHintsRecords()
  HINT1.element.classList.add(`btn-disabled`)
  HINT2.element.classList.add(`btn-disabled`)
  HINT3.element.classList.add(`btn-disabled`)
  HINT1.used = false
  HINT2.used = false
  HINT3.used = false

  //reset megahints
  gGame.megaHints = 1
  elMegaHintBtn.classList.add(`btn-disabled`)
  clearAllMegaHintsRecords()


  //reset safe clicks
  gGame.safeClicks = 3
  elSafeClickSpan.innerText = gGame.safeClicks
  elSafeClickBtn.classList.remove(`btn-disabled`)

  //reset exterminator
  gGame.exterminators = 1
  elExterminatorBtn.classList.add(`btn-disabled`)

  //hide modal and show game
  elSiSelMoContainer.hidden = true
  elGameContainer.hidden = false

  //reset timer and start
  gTimer = 0
  elTimeCount.innerText = gTimer
  clearInterval(gTimerInterval)
  gTimerInterval = null
  runTimer()

//play bg sound
BG_TENSION_AUDIO.currentTime = 0
BG_TENSION_AUDIO.play()


}


function onLivesModeOn(el) {
  if (el.checked) {
    gGame.isLivesModeOn = true
  } else {
    gGame.isLivesModeOn = false

  }
}