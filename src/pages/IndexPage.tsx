import BuildingSelectorBar from "../components/BuildingSelectorBar"
import GameArea from "../components/GameArea"
import ResourceBar from "../components/ResourceBar"

const IndexPage = () => {
    return (
        <>
            <div>
                <ResourceBar />
                <GameArea />
                <BuildingSelectorBar />
            </div>
        </>
    )
}

export default IndexPage