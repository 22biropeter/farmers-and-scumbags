import { create } from "zustand"
import type { TileType, GenerationType } from "../types/Maps"

type MapStoreType = {
    map: TileType[][],
    size: number,
    generation: GenerationType,
    mapSeed: number,
    regenerate: ()=>void
    setSize: (to:number)=>void
    setGeneration: (to:GenerationType)=>void
    setSeed: (to:number)=>void
}


export const useMapStore = create<MapStoreType>((set) => ({
    map: generateMap(20,"default",123456789),
    size: 20,
    generation: "default",
    mapSeed: 123456789,
    regenerate: () => set((state)=>({ map: generateMap(state.size,state.generation,state.mapSeed)})),
    setSize: (to:number) => set({ size: to}),
    setGeneration: (to:GenerationType) => set({ generation: to}),
    setSeed: (to:number) => set({ mapSeed: to}),
}));

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMap(size: number,generation:GenerationType, seed: number):TileType[][]{
    const random = () => {seed++;return mulberry32(seed)()} 

    let islandconstant:number = Math.floor(generation == "continent" ? size/20 + 1 : 
                                generation == "islands" ? size*size/5 + 1: 
                                generation == "default" ? size/2 + 1: 
                                0)

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

    console.log(generation)
    console.log(islandconstant)
    addGrass(tempMap,islandconstant,random)
    addSand(tempMap)
    addStone(tempMap,islandconstant/2,random)

    if (generation == "continent") addRivers(tempMap,islandconstant,random)

    placeTownHall(tempMap)

    return tempMap
}

function placeTownHall(map: TileType[][]){
    const centerRow = Math.floor(map.length / 2)
    const centerCol = Math.floor(map[0].length / 2)

    for (let radius = 0; radius <= Math.max(map.length, map[0].length); radius++) {
        for (let r = centerRow - radius; r <= centerRow + radius; r++) {
            for (let c = centerCol - radius; c <= centerCol + radius; c++) {
                if (r < 0 || c < 0 || r >= map.length || c >= map[r].length) continue
                if (map[r][c].ground === "grass" && !map[r][c].building) {
                    map[r][c].building = "townhall"
                    return
                }
            }
        }
    }
}

function addGrass(map: TileType[][], seedcount:number, random: ()=>number){
    
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
        let r = Math.floor(random()*map.length)
        let c = Math.floor(random()*map[r].length)
        map[r][c].ground = "grass"
    }

    let safety = 1000
    while (!isBalanced() && safety>0) {growGrass(map,random);safety--} 
}

function addStone(map: TileType[][], seedcount:number, random: ()=>number){

    const isBalanced = ():boolean => {
        let grass:number = 0
        map.forEach(line => {
            line.forEach(tile=>tile.ground == "grass"?grass++:grass)
        });
        let mountain:number = 0
        map.forEach(line => {
            line.forEach(tile=>tile.ground == "mountain"?mountain++:mountain)
        });

        return grass/10>mountain
    }

    for (let i:number = 0; i<seedcount;i++){
        let r = Math.floor(random()*map.length)
        let c = Math.floor(random()*map[r].length)
        if (map[r][c].ground=="grass"){
            if (!isBalanced()) break;
            map[r][c].ground = "mountain"
        }
        else
            i--
    }
    while (isBalanced()) growStone(map,random)
}

function growStone(map: TileType[][], random: ()=>number){
    for(let r = 0; r<map.length; r++){
        for(let c = 0; c<map[r].length; c++){
            if(map[r][c].ground == "mountain"){
                // Down
                if(random() < 0.4) map[Math.min(r+1, map.length - 1)][c].ground = "mountain";
                // Up
                if(random() < 0.5) map[Math.max(r-1, 0)][c].ground = "mountain";
                // Right
                if(random() < 0.4) map[r][Math.min(c+1, map[r].length - 1)].ground = "mountain";
                // Left
                if(random() < 0.5) map[r][Math.max(c-1, 0)].ground = "mountain";
            }
        }
    }
}

function growGrass(map: TileType[][], random: ()=>number){
    for(let r = 0; r<map.length; r++){
        for(let c = 0; c<map[r].length; c++){
            if(map[r][c].ground == "grass"){
                // Down
                if(random() < 0.4) map[Math.min(r+1, map.length - 1)][c].ground = "grass";
                // Up
                if(random() < 0.5) map[Math.max(r-1, 0)][c].ground = "grass";
                // Right
                if(random() < 0.4) map[r][Math.min(c+1, map[r].length - 1)].ground = "grass";
                // Left
                if(random() < 0.5) map[r][Math.max(c-1, 0)].ground = "grass";
            }
        }
    }
}

function addRivers(map: TileType[][], seedcount:number, random: ()=>number){
    let x:number = 0;
    let y:number = 0;

    

    for (let i:number = 0; i<seedcount;i++){

        let x:number = 0;
        let y:number = 0;
        let dir = random();

        if (dir < 0.25)       x = 1;   // right
        else if (dir < 0.50)  x = -1;  // left
        else if (dir < 0.75)  y = 1;   // up
        else                  y = -1;  // down

        let r = 0;
        let c = 0;
        let safety2 = 1000
        do {
            r = Math.floor(random()*map.length)
            c = Math.floor(random()*map[r].length)
            safety2--
        } while (map[r][c].ground == "water" && safety2>0)
        
        map[r][c].ground = "water";

        let safety = 100000
        while(safety>0){
            safety--
            if (random()<0.7){
                r+=y
                c+=x
            }else {
                r+=x
                c+=y
            }
            

            if (map.length<=r) break
            if (r<0) break
            if (map[r].length<=c) break
            if (c<0) break
            if (map[r][c].ground == "water") break

            map[r][c].ground = "water"
        }

    }
}

function addSand(map: TileType[][]){
    for(let r = 0; r<map.length; r++){
        for(let c = 0; c<map[r].length; c++){
            if(map[r][c].ground == "grass"){
                if(
                    map[r][Math.max(c-1, 0)].ground == "water" ||
                    map[r][Math.min(c+1, map[r].length - 1)].ground == "water" ||
                    map[Math.max(r-1, 0)][c].ground == "water" ||
                    map[Math.min(r+1, map.length - 1)][c].ground == "water"
                ){
                    map[r][c].ground = "sand"
                }
            }
        }
    }
}