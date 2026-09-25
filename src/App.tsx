import ResourceBar from "./components/ResourceBar"
import GameArea from "./components/GameArea"
import { useMapStore } from "./store/useMapStore"
import type { GenerationType } from "./types/Maps"

const App = () => {

  const mapStore = useMapStore()

  return (
    <div>
      <input id="generation-size-select" type="number" defaultValue={50} onChange={(e) => mapStore.setSize(Number(e.target.value))}/>
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
    </div>
  )
}

export default App