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
    boosted: boolean[];
    addBuilding: (to: BuildingType, isBoosted?: boolean) => void;
    runEconomy: () => EconomicStats;
};

export const useEconomyStore = create<useEconomyStoreType>((set, get) => ({
    buildings: [],
    boosted: [],

    addBuilding: (to: BuildingType, isBoosted = false) => {
        set((state) => ({
            buildings: [...state.buildings, to],
            boosted: [...state.boosted, isBoosted],
        }));
    },

    runEconomy: () => {
        const buildings = get().buildings;
        const boosted = get().boosted;
        const resourceStore = useResourceStore.getState();

        const baseStats = {
            wood: 0,
            food: 0,
            gold: 0,
            stone: 0,
        };

        buildings.forEach((building, index) => {
            const multiplier = boosted[index] ? 2 : 1;

            switch (building) {
                case "lumber":
                    baseStats.wood += 5 * multiplier;
                    break;
                case "farm":
                    baseStats.food += 5 * multiplier;
                    break;
                case "house":
                    baseStats.gold += 5 * multiplier;
                    break;
                case "mine":
                    baseStats.stone += 5 * multiplier;
                    break;
                case "road":
                case "townhall":
                default:
                    break;
            }
        });

        const maxPopulation = 10 + buildings.filter((b) => b === "house").length * 5;

        const stats: EconomicStats = {
            wood: baseStats.wood,
            food: baseStats.food,
            gold: baseStats.gold,
            stone: baseStats.stone,
            population: resourceStore.population < maxPopulation ? 1 : resourceStore.population > maxPopulation ? -5 : 0,
        };

        if (resourceStore.food <= 0) {
            stats.population -= 2;
        } else {
            stats.food -= resourceStore.population;
        }

        return stats;
    },
}));
    