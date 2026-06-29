import {useQuery} from "@tanstack/react-query";
import config from "../../config.ts";
import type {Work} from "../../types.ts";

export default function FetchTraditional(slug: string) {
    return useQuery({
        queryKey: ['CollectionWorks',slug],
        queryFn: async () => {
            const response = await fetch(`${config.apiUrl}/collections/${slug}/works`);
            if (!response.ok) throw new Error(`API error: ${response.status}`)
            return (await response.json()) as Work[];
        },
    });
}