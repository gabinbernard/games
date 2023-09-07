const GRID_SIZE = 16
const BOMB_COUNT = 30
const grid = document.getElementById("grid")
const score = document.getElementById("score")

const game = []
const state = []

let left = 0
let isLost = false
let isWon = false

const reset = () => {
    left = 0
    score.innerHTML = `Restant : ${BOMB_COUNT - left}`
    grid.classList.remove("lost")
    grid.classList.remove("won")
    isLost = isWon = false
    // Init game state
    for (let i = 0; i < GRID_SIZE; i++) {
        game[i] = []
        state[i] = []
        for (let j = 0; j < GRID_SIZE; j++) {
            game[i][j] = 0
            state[i][j] = 0
        }
    }
    // Placing bombs
    for (let i = 0; i < BOMB_COUNT; i++) {
        let i, j
        do {
            i = Math.floor(Math.random()*16)
            j = Math.floor(Math.random()*16)
        } while (game[i][j] !== 0)
        game[i][j] = -1
    }
    // Compute counts
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (game[i][j] === -1) continue
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    if (j + y < 0 || j + y >= GRID_SIZE || i + x < 0 || i + x >= GRID_SIZE) continue
                    if (game[i+x][j+y] === -1) game[i][j] += 1
                }
            } 
        }
    }
    render()
}

const lost = () => {
    grid.classList.add("lost")
    isLost = true
    render()
}

const isGameWon = () => {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (game[i][j] === -1 && game[i][j] !== state[i][j] - 3) return false
        }
    }
    return true
}

const show = (i, j, e) => {
    if (isLost || isWon) return reset()
    if (e?.which === 3) {
        if (state[i][j] === 1) return
        state[i][j] = (state[i][j] + 2) % 4
        left += state[i][j] === 2 ? 1 : -1
        score.innerHTML = `Restant : ${BOMB_COUNT - left}`
        if (isGameWon()) {
            grid.classList.add("won")
            isWon = true
        }
        render()
        return
    }
    state[i][j] = 1
    if (game[i][j] === -1) return lost()

    render()
    if (game[i][j] === 0) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (i+x < 0 || j+y < 0 || i+x >= GRID_SIZE || j+y >= GRID_SIZE) continue
                if (state[i+x][j+y] === 0) show(i+x, j+y)
            }
        }
    }
}

const init = () => {

    score.innerHTML = `Restant : ${BOMB_COUNT - left}`
    // Create grid
    for (let i = 0; i < GRID_SIZE; i++) {
        let row = document.createElement("div")
        row.className = "row"
        for (let j = 0; j < GRID_SIZE; j++) {
            let cell = document.createElement("div")
            cell.className = "cell"
            cell.setAttribute("id", `${i}_${j}`)
            row.appendChild(cell)
            cell.addEventListener("mousedown", (e) => show(i, j, e))
        }
        grid.appendChild(row)
    }
    
    // Init game state
    for (let i = 0; i < GRID_SIZE; i++) {
        game[i] = []
        state[i] = []
        for (let j = 0; j < GRID_SIZE; j++) {
            game[i][j] = 0
            state[i][j] = 0
        }
    }
    
    // Placing bombs
    for (let i = 0; i < BOMB_COUNT; i++) {
        let i, j
        do {
            i = Math.floor(Math.random()*16)
            j = Math.floor(Math.random()*16)
        } while (game[i][j] !== 0)
        game[i][j] = -1
    }

    // Compute counts
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (game[i][j] === -1) continue
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    if (j + y < 0 || j + y >= GRID_SIZE || i + x < 0 || i + x >= GRID_SIZE) continue
                    if (game[i+x][j+y] === -1) game[i][j] += 1
                }
            } 
        }
    }
    console.table(game)
}

const render = () => {
    for (let i = 0; i < game.length; i++) {
        for (let j = 0; j < game.length; j++) {
            const cell = document.getElementById(`${i}_${j}`)
            cell.className = `cell ${state[i][j] === 1 ? "shown" : "" }`
            if (isLost) {
                cell.innerHTML = game[i][j] === 0 ? "" :
                game[i][j] === -1 ? "💣" : state[i][j] ? game[i][j] : ""
                continue
            }
            cell.innerHTML = getCellValue(i, j)
            game[i][j] === -1 ? "" : game[i][j]
        }
    }
}

const getCellValue = (i, j) => {
    if (state[i][j] === 2) return "🚩"
    if (game[i][j] === 0 || state[i][j] === 0) return ""
    return game[i][j]
}

init()
render()