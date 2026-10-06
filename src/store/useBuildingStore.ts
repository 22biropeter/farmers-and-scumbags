import { create } from "zustand";
import type { BuildingType, GroundType } from "../types/Maps";
import { useResourceStore, type ResourceStoreType } from "./useResourceStore";
import {BuildingCosts} from "../types/Maps"
import type { ResourceCost } from "../types/Maps";



type BuildingStoreType = {
    building: BuildingType;
    setBuilding: (to: BuildingType) => void;
    canBeBuilt: (type: GroundType) => boolean;
};

export const useBuildingStore = create<BuildingStoreType>((set, get) => ({
    building: "house",

    setBuilding: (to: BuildingType) => {
        set({ building: to });
    },

    canBeBuilt: (type: GroundType) => {
        const { building } = get();

        if (type === "water") return false;
        if (type === "mountain" && building !== "mine") return false;
        if (type === "sand" && building !== "farm") return false;
        if (type === "grass" && building === "mine") return false;
        if (building === "mine" && type !== "mountain") return false;

        const cost = BuildingCosts[building];
        return checkForResources(cost);
    },
}));

function checkForResources(cost: ResourceCost): boolean {
    const resourceStore: ResourceStoreType = useResourceStore.getState();
    return (
        resourceStore.food >= cost.food &&
        resourceStore.wood >= cost.wood &&
        resourceStore.gold >= cost.gold &&
        resourceStore.stone >= cost.stone
    );
}