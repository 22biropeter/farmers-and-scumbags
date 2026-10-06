import ResourceBar from "./components/ResourceBar"
import GameArea from "./components/GameArea"
import { useMapStore } from "./store/useMapStore"
import type { BuildingType, GenerationType } from "./types/Maps"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { useBuildingStore } from "./store/useBuildingStore"

const queryClient = new QueryClient()

const App = () => {

  const mapStore = useMapStore()
  const buildingStore = useBuildingStore()

  return (
    <QueryClientProvider client={queryClient}>
    <div>
      <input id="generation-seed-select" type="number" defaultValue={123456789} onChange={(e) => mapStore.setSeed(Number(e.target.value))}/>
      <input id="generation-size-select" type="number" defaultValue={20} onChange={(e) => mapStore.setSize(Number(e.target.value))}/>
      <select id="generation-type-select"
        defaultValue="default"
        onChange={(e) => mapStore.setGeneration(e.target.value as GenerationType)}
      >
        <option value="default">Default</option>
        <option value="islands">Islands</option>
        <option value="continent">Continet</option>
      </select>
      <button onClick={()=>mapStore.regenerate()}>Generate</button>
      <ResourceBar />
      <GameArea/>
      <div className="building-select">
        <div  className={"building-select-btn "+( buildingStore.building == "house" ? "active" : "")} onClick={() => buildingStore.setBuilding("house")}>🏘️</div>
        <div  className={"building-select-btn "+(buildingStore.building == "farm" ? "active" : "")} onClick={() => buildingStore.setBuilding("farm")}>🌾</div>
        <div  className={"building-select-btn "+(buildingStore.building == "mine" ? "active" : "")} onClick={() => buildingStore.setBuilding("mine")}>⛏️</div>
        <div  className={"building-select-btn "+(buildingStore.building == "lumber" ? "active" : "")} onClick={() => buildingStore.setBuilding("lumber")}>🪚</div>
      </div>
    </div>
    </QueryClientProvider>
  )
}

export default App