import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../../../config.ts";

interface UpdateCollectionCoverData {
    slug: string;
    work_id: number;
}

export default function UpdateCollectionCover() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ slug, work_id }: UpdateCollectionCoverData) => {
            const response = await fetch(`${config.apiUrl}/admin/collections/${slug}/cover`, {
                method: "PATCH",
                body: JSON.stringify({ work_id }),
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Collections"] });
        },
    });
}