import { useMapStore } from "../store/useMapStore"
import Tile from "./Tile"
import "./GameArea.css"
import { useQuery } from "@tanstack/react-query"
import { mapQueryOptions } from "../store/mapQueryOptions"

const GameArea = () => {
  const data = useMapStore((state)=>state.map)

  //const {data} = useQuery(mapQueryOptions())

  return (
    <div className="gameArea" style={{gridTemplateColumns: `repeat(${data?.length}, 1fr)`}}>
      {
        data?.map(row=>
          row.map(tile=><div className={tile.ground}></div>))
      }
    </div>
  )
}

export default GameArea