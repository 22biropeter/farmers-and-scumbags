import ResourceBar from "./components/ResourceBar"
import GameArea from "./components/GameArea"
import { useMapStore } from "./store/useMapStore"
import type { BuildingType, GenerationType } from "./types/Maps"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { useBuildingStore } from "./store/useBuildingStore"
import { BuildingCosts } from "./types/Maps"

const buildingOptions: { type: BuildingType; icon: string }[] = [
  { type: "house", icon: "🏘️" },
  { type: "farm", icon: "🌾" },
  { type: "mine", icon: "⛏️" },
  { type: "lumber", icon: "🪚" },
]

const resourceIcons = { gold: "🪙", wood: "🪵", stone: "🪨", food: "🥖" }

const getBuildingCostLabel = (building: BuildingType) =>
  (Object.keys(resourceIcons) as (keyof typeof resourceIcons)[])
    .filter((resource) => BuildingCosts[building][resource] > 0)
    .map((resource) => `${BuildingCosts[building][resource]} ${resourceIcons[resource]}`)
    .join(", ")

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
        {buildingOptions.map(({ type, icon }) => (
          <button
            key={type}
            type="button"
            className={`building-select-btn ${buildingStore.building === type ? "active" : ""}`}
            title={`${getBuildingCostLabel(type)}`}
            aria-label={`${type}, cost: ${getBuildingCostLabel(type)}`}
            onClick={() => buildingStore.setBuilding(type)}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
    </QueryClientProvider>
  )
}

export default App