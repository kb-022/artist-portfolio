import {useQuery} from "@tanstack/react-query";
import config from "../../../config.ts";
import type {Work} from "../../../types.ts";

export default function FetchWork(slug: string) {
    return useQuery({
        queryKey: ['Works',slug],
        retry: false,
        queryFn: async () => {
            const response = await fetch(`${config.apiUrl}/works/${slug}`);
            if (!response.ok) throw new Error(`API error: ${response.status}`)
            return (await response.json()) as Work;
        },
    });
}