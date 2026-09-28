import { queryOptions } from "@tanstack/react-query";
import type {TileType} from "../types/Maps"
import axios from "axios";

const generateMap = async (): Promise<TileType[][]> =>{
    const response = await axios.post("https://2tcjmzzm-8000.euw.devtunnels.ms/map/generate/");
    return response.data.map;
}

export function mapQueryOptions(){
    return queryOptions ({
        queryKey: ["map"],
        queryFn: generateMap,
    })
}