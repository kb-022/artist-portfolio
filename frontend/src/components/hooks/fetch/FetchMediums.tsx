import {useQuery} from "@tanstack/react-query";
import config from "../../../config.ts";
import type {Medium} from "../../../types.ts";

export default function FetchMediums(){
    return useQuery({
        queryKey: ["Mediums"],
        queryFn: async () => {
            const response = await fetch(`${config.apiUrl}/mediums`);
            if (!response.ok) throw new Error(`API error: ${response.status}`)
            return (await response.json()) as Medium[];
        },

    })
}
