import {useQuery} from "@tanstack/react-query";
import config from "../../../config.ts";
import type {TraditionalWork} from "../../../types.ts";

export default function FetchTraditional() {
    return useQuery({
        queryKey: ['traditionalWorks'],
        queryFn: async () => {
            const response = await fetch(`${config.apiUrl}/traditional`);
            if (!response.ok) throw new Error(`API error: ${response.status}`)
            return (await response.json()) as TraditionalWork[];
        },
    });
}