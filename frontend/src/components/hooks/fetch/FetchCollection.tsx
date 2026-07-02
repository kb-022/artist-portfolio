import {useQuery} from "@tanstack/react-query";
import config from "../../../config.ts";
import type {Collection} from "../../../types.ts";

export default function FetchCollection(slug : string){
    return useQuery({
        queryKey: ["Collection",slug],
        retry: false,
        queryFn: async () => {
            const response = await fetch(`${config.apiUrl}/collections/${slug}`);
            if (!response.ok) throw new Error(`API error: ${response.status}`)
            return (await response.json()) as Collection;
        },

    })
}
