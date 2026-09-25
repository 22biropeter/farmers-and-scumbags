export type GroundType = "grass" | "water" | "mountain" | "sand"
export type BuldingType = "house" | "mine" | "lumber" | "farm"
export type ResourceType = "wood" | "stone" | "food"
export type GenerationType = "continent" | "default" | "islands"

export type TileType ={
    ground: GroundType,
    building: BuldingType | null,
    resource: ResourceType | null
}