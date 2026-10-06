import { create } from "zustand";
import type { BuildingType } from "../types/Maps";
import { useResourceStore } from "./useResourceStore";

export type EconomicStats = {
    wood: number;
    stone: number;
    food: number;
    gold: number;
    population: number;
};

type useEconomyStoreType = {
    buildings: BuildingType[];
    addBuilding: (to: BuildingType) => void;
    runEconomy: () => EconomicStats;
};

export const useEconomyStore = create<useEconomyStoreType>((set, get) => ({
    buildings: [],

    addBuilding: (to: BuildingType) => {
        set((state) => ({ buildings: [...state.buildings, to] }));
    },

    runEconomy: () => {
        const buildings = get().buildings;
        const resourceStore = useResourceStore.getState();

        const maxPopulation = 10 + buildings.filter((b) => b === "house").length * 5;

        const stats: EconomicStats = {
            wood: buildings.filter((b) => b === "lumber").length * 10,
            food: buildings.filter((b) => b === "farm").length * 10,
            gold: buildings.filter((b) => b === "house").length * 10,
            stone: buildings.filter((b) => b === "mine").length * 5,
            population: resourceStore.population < maxPopulation ? 1 : resourceStore.population > maxPopulation ? -5 : 0,
        };

        if (resourceStore.food <= 0) {
            stats.population -= 2;
        }else{
            stats.food -= resourceStore.population;
        }


        return stats;
    },
}));
    