import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../../../config.ts";

interface CreateCollectionData {
    name: string;
    description?: string;
}

export default function CreateCollection() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateCollectionData) => {
            const response = await fetch(`${config.apiUrl}/admin/collections`, {
                method: "POST",
                body: JSON.stringify(data),
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