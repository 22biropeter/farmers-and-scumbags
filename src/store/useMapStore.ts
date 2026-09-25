import { create } from "zustand"
import type { TileType } from "../types/Maps"

type MapStoreType = {
    map: TileType[][]
}

export const useMapStore = create<MapStoreType>((set)=>({
    map: generateMap(30)
}))

function generateMap(size: number):TileType[][]{
    let tempMap:TileType[][] = []
    for(let r = 0; r<size; r++){
        let line:TileType[] = []
        for(let c = 0; c<size; c++){
            line.push({
                building: null,
                ground: "water",
                resource: null
            })
        }
        tempMap.push(line)
    }

    addGrass(tempMap,Math.floor(size/2))

    return tempMap
}

function addGrass(map: TileType[][], seedcount:number):TileType[][]{
    
    const isBalanced = ():boolean => {
        let grass:number = 0
        map.forEach(line => {
            line.forEach(tile=>tile.ground == "grass"?grass++:grass)
        });
        let water:number = 0
        map.forEach(line => {
            line.forEach(tile=>tile.ground == "water"?water++:water)
        });

        return grass>water
    }
    
    for (let i:number = 0; i<seedcount;i++){
        if (isBalanced()) break
        let r = Math.floor(Math.random()*map.length)
        let c = Math.floor(Math.random()*map[r].length)
        map[r][c].ground = "grass"
    }

    let safety = 1000
    while (!isBalanced() && safety>0) {growGrass(map);safety--} 
    console.log(safety)

    return map;
}

function growGrass(map: TileType[][]):TileType[][]{
    for(let r = 0; r<map.length; r++){
        for(let c = 0; c<map[r].length; c++){
            if(map[r][c].ground == "grass"){
                // Down
                if(Math.random() < 0.4) map[Math.min(r+1, map.length - 1)][c].ground = "grass";
                // Up
                if(Math.random() < 0.5) map[Math.max(r-1, 0)][c].ground = "grass";
                // Right
                if(Math.random() < 0.4) map[r][Math.min(c+1, map[r].length - 1)].ground = "grass";
                // Left
                if(Math.random() < 0.5) map[r][Math.max(c-1, 0)].ground = "grass";
            }
        }
    }
    return map;
}