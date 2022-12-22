import { Component, createSignal, For, Show } from "solid-js"
import Tile from "./Tile"

export type TTile = "X" | "O" | ""

type TWinner = {
  tile: TTile | null
  position: string[]
}

const winningPositions = [
  "00,01,02",
  "10,11,12",
  "20,21,22",
  "00,10,20",
  "01,11,21",
  "02,12,22",
  "00,11,22",
  "20,11,02",
]

const startingGrid = new Array(3).fill("").map(() => new Array(3).fill(""))

const App: Component = () => {
  const [grid, setGrid] = createSignal(startingGrid)
  const [currentPlay, setCurrentPlay] = createSignal<TTile>("X")
  const [winner, setWinner] = createSignal<TWinner>({
    tile: null,
    position: [],
  })

  const handleTileChange = (rowIdx: number, tileIdx: number) => {
    setGrid(
      grid().map((row, ridx) => {
        if (ridx === rowIdx) {
          return row.map((tile, tidx) => {
            if (tidx === tileIdx) {
              setCurrentPlay((c) => (c !== "X" ? "X" : "O"))
              return currentPlay()
            } else {
              return tile
            }
          })
        } else {
          return row
        }
      })
    )

    for (let i = 0; i < winningPositions.length; i++) {
      const x = winningPositions[i].split(",").splice(0, 1).toString()
      const y = winningPositions[i].split(",").splice(1, 1).toString()
      const z = winningPositions[i].split(",").splice(2, 1).toString()

      const gridX = grid()[+x[0]][+x[1]]
      const gridY = grid()[+y[0]][+y[1]]
      const gridZ = grid()[+z[0]][+z[1]]

      const checkGrid =
        gridX === gridY &&
        gridX !== "" &&
        gridX === gridZ &&
        gridX !== "" &&
        gridZ === gridY &&
        gridZ !== ""

      if (checkGrid) {
        setWinner({
          tile: currentPlay(),
          position: [x, y, z],
        })
      }
    }
  }

  const handleResetGame = () => {
    setGrid(startingGrid)
    setWinner({ tile: null, position: [] })
  }

  const handleWinningTile = (rowIdx: number, tileIdx: number) => {
    const winnerPosition = winner().position
    const idStr = `${rowIdx}${tileIdx}`

    return (
      idStr === winnerPosition[0] ||
      idStr === winnerPosition[1] ||
      idStr === winnerPosition[2]
    )
  }

  return (
    <div data-theme="dark">
      <div class="flex flex-col gap-4 items-center justify-center h-screen">
        <div class="grid max-w-md rounded border border-white p-4 gap-4 grid-cols-3 grid-flow-dense">
          <For each={grid()}>
            {(row, rowIdx) => (
              <For each={row}>
                {(tile, tileIdx) => (
                  <Tile
                    handleTileChange={() =>
                      handleTileChange(rowIdx(), tileIdx())
                    }
                    tile={tile}
                    winner={winner().tile}
                    isWinningTile={handleWinningTile(rowIdx(), tileIdx())}
                  />
                )}
              </For>
            )}
          </For>
        </div>
        <Show when={winner}>
          <p>Winner is {winner().tile}</p>
        </Show>
        <p>
          Player <span>{currentPlay}</span> has turn
        </p>
        <button
          class="rounded border px-4 py-2 border-white"
          onClick={handleResetGame}
        >
          Start a new game
        </button>
      </div>
    </div>
  )
}

export default App
