import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../../../config.ts";

export default function DeleteCollection() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (slug: string) => {
            const response = await fetch(`${config.apiUrl}/admin/collections/${slug}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Collections"] });
        },
    });
}