import {useQuery} from "@tanstack/react-query";
import config from "../../config.ts";
import type {Collection} from "../../types.ts";

export default function FetchCollections(){
    return useQuery({
        queryKey: ["Collections"],
        queryFn: async () => {
            const response = await fetch(`${config.apiUrl}/collections`);
            if (!response.ok) throw new Error(`API error: ${response.status}`)
            return (await response.json()) as Collection[];
        },

        })
}
