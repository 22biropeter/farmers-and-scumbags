import { useMapStore } from "../store/useMapStore"
import "./GameArea.css"
import { useQuery } from "@tanstack/react-query"
import { useBuildingStore } from "../store/useBuildingStore"
import { mapQueryOptions } from "../store/mapQueryOptions"
import { useState } from "react"
import type { TileType } from "../types/Maps"
import {BuildingCosts} from "../types/Maps"
import { useResourceStore } from "../store/useResourceStore"
import { useEconomyStore } from "../store/useEconomyStore"

const GameArea = () => {
  const buildingStore = useBuildingStore()
  const resourceStore = useResourceStore()
  const economyStore = useEconomyStore()
  const [, forceUpdate] = useState(0)
  
  
  //const {data} = useQuery(mapQueryOptions()) //Tanárúr api-ja
  const data = useMapStore((state)=>state.map) //Saját generálás

  function getTilePosition(target: TileType): [number, number] | null {
    for (let row = 0; row < data.length; row++) {
      const column = data[row].indexOf(target)
      if (column !== -1) return [row, column]
    }
    return null
  }

  function isBoostedTile(tile: TileType): boolean {
    const position = getTilePosition(tile)
    if (!position) return false

    const [row, column] = position
    const neighbors = [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ]

    const adjacentTiles = neighbors
      .filter(([r, c]) => r >= 0 && c >= 0 && r < data.length && c < data[r].length)
      .map(([r, c]) => data[r][c])

    const hasWater = adjacentTiles.some((neighbor) => neighbor.ground === "water")
    const hasMountain = adjacentTiles.some((neighbor) => neighbor.ground === "mountain")
    const hasNeighboringIndustrialBuilding = adjacentTiles.some(
      (neighbor) => neighbor.building === "mine" || neighbor.building === "lumber"
    )

    switch (buildingStore.building) {
      case "farm":
        return hasWater
      case "lumber":
        return hasMountain
      case "house":
        return !hasNeighboringIndustrialBuilding
      default:
        return false
    }
  }

  function setBuilding(tile:TileType){
    if (!buildingStore.canBeBuilt(tile.ground)) return
    if (tile.building) return

    const position = getTilePosition(tile)
    if (!position) return

    const [row, column] = position
    const hasAdjacentBuilding = [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ].some(([r, c]) => {
      if (r < 0 || c < 0 || r >= data.length || c >= data[r].length) return false
      return data[r][c].building !== null
    })

    if (!hasAdjacentBuilding) return

    tile.building = buildingStore.building
    const isBoosted = isBoostedTile(tile)

    resourceStore.spendGold(BuildingCosts[buildingStore.building].gold)
    resourceStore.spendResource("food", BuildingCosts[buildingStore.building].food)
    resourceStore.spendResource("wood", BuildingCosts[buildingStore.building].wood)
    resourceStore.spendResource("stone", BuildingCosts[buildingStore.building].stone)

    economyStore.addBuilding(buildingStore.building, isBoosted)

    forceUpdate(n => n + 1)
  }
  

  return (
    <div className="gameArea" style={{gridTemplateColumns: `repeat(${data?.length}, 1fr)`}}>
      {
        data?.map(row=>
          row.map(tile=><div onClick={()=>setBuilding(tile)} className={tile.ground}>{
            tile.building == "house" ? "🏘️" :
            tile.building == "farm" ? "🌾" : 
            tile.building == "mine" ? "⛏️" : 
            tile.building == "lumber" ? "🪚" : 
            tile.building == "road" ? "⬛" : 
            tile.building == "townhall" ? "🏛️" : ""
          }</div>))
      }
    </div>
  )
}

export default GameArea