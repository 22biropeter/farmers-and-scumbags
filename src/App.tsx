import ResourceBar from "./components/ResourceBar"
import GameArea from "./components/GameArea"
import { useMapStore } from "./store/useMapStore"
import type { GenerationType } from "./types/Maps"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const App = () => {

  const mapStore = useMapStore()

  return (
    <QueryClientProvider client={queryClient}>
    <div>
      <input id="generation-seed-select" type="number" defaultValue={123456789} onChange={(e) => mapStore.setSeed(Number(e.target.value))}/>
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
    </QueryClientProvider>
  )
}

export default App