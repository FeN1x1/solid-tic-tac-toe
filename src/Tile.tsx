import { Component } from "solid-js"
import type { TTile } from "./App"

const Tile: Component<{
  handleTileChange: () => void
  tile: TTile
  winner: TTile | null
  isWinningTile: boolean
}> = (props) => {
  const isTileClicked = props.tile === "X" || props.tile === "O"

  const setTileColor = () => {
    if (!props.isWinningTile && isTileClicked) {
      return "bg-gray-800"
    } else if (props.isWinningTile && isTileClicked) {
      return "bg-green-800"
    } else {
      return "hover:bg-gray-700 "
    }
  }

  return (
    <div class="flex items-center justify-center w-12 mx-auto">
      <button
        disabled={isTileClicked || props.winner !== null}
        onClick={props.handleTileChange}
        class={`${setTileColor()} rounded cursor-pointer transition border h-12 w-12 items-center justify-center flex border-gray-500`}
      >
        {props.tile}
      </button>
    </div>
  )
}

export default Tile
