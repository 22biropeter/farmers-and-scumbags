export type GroundType = "grass" | "water" | "mountain" | "sand"
export type BuildingType = "house" | "mine" | "lumber" | "farm"
export type ResourceType = "wood" | "stone" | "food"
export type GenerationType = "continent" | "default" | "islands"

export type TileType ={
    ground: GroundType,
    building: BuildingType | null,
    resource: ResourceType | null
}

export type ResourceCost = {
    gold: number;
    wood: number;
    stone: number;
    food: number;
};

export const BuildingCosts: Record<BuildingType, ResourceCost> = {
    farm:   { gold: 100, wood: 20, stone: 0, food: 0 },
    house:  { gold: 0,   wood: 50, stone: 0, food: 100 },
    lumber: { gold: 20,   wood: 0, stone: 0, food: 20 },
    mine:   { gold: 100,   wood: 100, stone: 0, food: 100 },
};