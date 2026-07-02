import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../../../config.ts";

interface UpdateCollectionData {
    slug: string;
    name?: string;
    description?: string;
}

export default function UpdateCollection() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ slug, ...fields }: UpdateCollectionData) => {
            const response = await fetch(`${config.apiUrl}/admin/collections/${slug}`, {
                method: "PATCH",
                body: JSON.stringify(fields),
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