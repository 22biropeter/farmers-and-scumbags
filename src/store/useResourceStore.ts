import { create } from "zustand";
import type { ResourceType } from "../types/Maps";
import type { EconomicStats } from "./useEconomyStore";

export type ResourceStoreType = {
    gold: number,
    wood: number,
    stone: number,
    food: number,
    population: number,

    spendGold: (amount: number) => boolean,
    receiveGold: (amount: number) => void,

    addResource: (type: ResourceType, amount: number) => void,
    spendResource: (type: ResourceType, amount: number) => boolean,
    applyEconomicChange: (stats: EconomicStats) => void,
}

export const useResourceStore = create<ResourceStoreType>((set)=>({
    gold: 500,
    wood: 500,
    stone: 500,
    food: 100,
    population: 10,

    spendGold: (amount: number) => { 
        if(amount > 0 && amount <= useResourceStore.getState().gold) {
            set((state) => ({ gold: state.gold - amount }));
            return true;
        }
        return false;
    },
    receiveGold: (amount: number) => { set((state) => ({ gold: state.gold + amount })) },

    addResource: (type: ResourceType, amount: number) => { set((state) => ({ [type]: state[type] + amount })) },

    spendResource: (type: ResourceType, amount: number) => { 
        if(amount > 0 && amount <= useResourceStore.getState()[type]) {
            set((state) => ({ [type]: state[type] - amount }));
            return true;
        }
        return false;
    },
    applyEconomicChange: (stats: EconomicStats) => {
        set((state) => ({
            wood:  Math.max(0, state.wood + stats.wood),
            stone: Math.max(0, state.stone + stats.stone),
            food: Math.max(0, state.food + stats.food),
            gold: Math.max(0, state.gold + stats.gold)  ,
            population: Math.max(0, state.population + stats.population),
        }));
    }
}))