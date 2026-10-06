import { useMapStore } from "../store/useMapStore"
import "./GameArea.css"
import { useQuery } from "@tanstack/react-query"
import { useBuildingStore } from "../store/useBuildingStore"
import { mapQueryOptions } from "../store/mapQueryOptions"
import { useState } from "react"
import type { TileType } from "../types/Maps"
import {BuildingCosts} from "../types/Maps"
import { useResourceStore } from "../store/useResourceStore"

const GameArea = () => {
  const buildingStore = useBuildingStore()
  const resourceStore = useResourceStore()
  const [, forceUpdate] = useState(0)
  
  
  //const {data} = useQuery(mapQueryOptions()) //Tanárúr api-ja
  const data = useMapStore((state)=>state.map) //Saját generálás

  function setBuilding(tile:TileType){
    if (!buildingStore.canBeBuilt(tile.ground)) return

    tile.building = buildingStore.building

    resourceStore.spendGold(BuildingCosts[buildingStore.building].gold)
    resourceStore.spendResource("food", BuildingCosts[buildingStore.building].food)
    resourceStore.spendResource("wood", BuildingCosts[buildingStore.building].wood)
    resourceStore.spendResource("stone", BuildingCosts[buildingStore.building].stone)

    forceUpdate(n => n + 1)
  }
  

  return (
    <div className="gameArea" style={{gridTemplateColumns: `repeat(${data?.length}, 1fr)`}}>
      {
        data?.map(row=>
          row.map(tile=><div onClick={()=>setBuilding(tile)} className={tile.ground}>{
            tile.building == "house" ? "🏘️" : tile.building == "farm" ? "🌾" : tile.building == "mine" ? "⛏️" : tile.building == "lumber" ? "🪚" : ""
          }</div>))
      }
    </div>
  )
}

export default GameArea