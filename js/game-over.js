'use strict'

function explodeGameOver(elCell, pos) {
    //turn off game
    gGame.isOn = false
    stopTimer()

    //explode the selected mine
    elCell.innerHTML = MINE_HTML_STR
    elCell.classList.add(`exploded`)

    //look for all other mines and reveal them
    for (let i = 0; i < gModelBoard.length; i++) {
        for (let j = 0; j < gModelBoard[i].length; j++) {
            const currCellId = createIdNameFromPos({ i, j })
            var elCurrCell = document.querySelector(currCellId)

            //ignore the already exploded cell
            if (i === pos.i && j === pos.j) continue

            //if it's mine show it, if it's null make it unclickable
            switch (gModelBoard[i][j].type) {
                case MINE:
                    elCurrCell.innerHTML = MINE_HTML_STR
                    elCurrCell.classList.add(`unclickable`)
                    break
                case null:
                    elCurrCell.classList.add(`unclickable`)
                    break
            }
        }
    }
    EXPLOSION_SOUND.play()
    shakeItAll()

    //set reset button general img
    setGeneralFace(GENERAL_IMG.ANGRY)
}

function explodeLoseLive(elCell, pos) {
    gGame.lives--
    elLivesSpan.innerText = gGame.lives

    if (gGame.lives > 0) {
        //explode cell
        elCell.innerHTML = MINE_HTML_STR
        elCell.classList.add(`exploded`)
        EXPLOSION_SOUND.play()
        shakeItAll()

        var backToLive = setTimeout(()=> {
            elCell.innerHTML = ''
            elCell.classList.remove(`exploded`)
        },2000)

    }



    if (gGame.lives === 0) {
        explodeGameOver(elCell, pos)
    }

}

function checkIfWin() {
    if (gGame.flaggedCount + gGame.revealedCount === gGame.currLevel.SIZE ** 2) {
        onWin()
    } else return
}

function onWin() {
    //turn off game
    gGame.isOn = false
    stopTimer()

    //make all flagged cells get unclickable class (to remove hover effect)
    for (let i = 0; i < gModelBoard.length; i++) {
        for (let j = 0; j < gModelBoard[i].length; j++) {
            if (gModelBoard[i][j].flagged === true) {
                const currCellId = createIdNameFromPos({ i, j })
                var elCurrCell = document.querySelector(currCellId)
                elCurrCell.classList.add(`unclickable`)
            }
        }
    }

    //set reset button general img
    setGeneralFace(GENERAL_IMG.HAPPY)
}

function onReset() {
    onInit()
    elGameContainer.hidden = true
    
    //hiding the tooltip
    var tt = document.querySelector(`#tt0`)
    tt.hidden = true
}

function shakeItAll() {
    var count = 0
    var shake = setInterval(() => {
        if (count > 9) {
            clearInterval(shake)
            shake = null
        }
        elBody.classList.toggle(`shake`)
        count++
    }, 50)
}