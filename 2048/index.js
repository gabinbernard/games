const elems = document.querySelectorAll(".element")
const game = [[0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0]]
const GRID_WIDTH = 4;
const ARROW_KEYS = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
const init = () => {
  let elem = getEmptyCell()
  game[elem.y][elem.x] = (Math.floor(Math.random()*1.5)+1)*2
  render()
  document.addEventListener("keydown", handleKeydown)
}

init()

function handleKeydown(e) {
  if (ARROW_KEYS.indexOf(e.key) === -1 ) return
  let previousGame = gameToString();
  makeMove(e.key)
  if (isGameLost()) playerLose()
  if (previousGame === gameToString()) return
  let newElem = getEmptyCell()
  game[newElem.y][newElem.x] = (Math.floor(Math.random()*1.5)+1)*2
  render()
}

function gameToString() {
  return game.reduce((total, row) => {
    return total + row.reduce((rowTotal, number) => {
      return rowTotal + number
    }, "")
  }, "")
}

function makeMove(key) {
  for (let i = 0; i < GRID_WIDTH; i++) {
    if (key === "ArrowUp") {
      for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 1; y < GRID_WIDTH; y++) {
          let temp = game[y][x]
          if (game[y-1][x] === 0) {
            game[y][x] = 0
            game[y-1][x] = temp
          } else if (game[y-1][x] === temp) {
            game[y][x] = 0
            game[y-1][x] = temp*2
          }
        }
      }
    }
    if (key === "ArrowRight") {
      for (let x = GRID_WIDTH - 2 ; x >= 0; x--) {
        for (let y = 0; y < GRID_WIDTH; y++) {
          let temp = game[y][x]
          if (game[y][x+1] === 0) {
            game[y][x] = 0
            game[y][x+1] = temp
          } else if (game[y][x+1] === temp) {
            game[y][x] = 0
            game[y][x+1] = temp*2
          }
        }
      }
    }
    if (key === "ArrowDown") {
      for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = GRID_WIDTH-2; y >= 0; y--) {
          let temp = game[y][x]
          if (game[y+1][x] === 0) {
            game[y][x] = 0
            game[y+1][x] = temp
          } else if (game[y+1][x] === temp) {
            game[y][x] = 0
            game[y+1][x] = temp*2
          }
        }
      }
    }
    if (key === "ArrowLeft") {
      for (let x = 1; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_WIDTH; y++) {
          let temp = game[y][x]
          if (game[y][x-1] === 0) {
            game[y][x] = 0
            game[y][x-1] = temp
          } else if (game[y][x-1] === temp) {
            game[y][x] = 0
            game[y][x-1] = temp*2
          }
        }
      }
    }
  }
}

function playerLose() {
  alert("YOU LOSE !")
  /* And then we reset the game */
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_WIDTH; j++) {
      game[i][j] = 0;
    }
  }
  render()
}

function render() {
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_WIDTH; y++) {
      elems[GRID_WIDTH*y+x].innerHTML = game[y][x] === 0 ? "" : game[y][x]
      elems[GRID_WIDTH*y+x].className = `element element-${game[y][x] >= 1024 ? 1024 : game[y][x]}`
    }
  }
}

function getEmptyCell() {
  let x = Math.floor(Math.random()*GRID_WIDTH);
  let y = Math.floor(Math.random()*GRID_WIDTH);
  if (game[y][x] === 0) return {x: x, y: y}
  return getEmptyCell()
}

function isGameLost() {
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_WIDTH; j++) {
      if (game[i][j] === 0) return false
    }
  }
  return true
}