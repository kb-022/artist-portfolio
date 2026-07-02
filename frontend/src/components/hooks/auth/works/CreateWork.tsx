import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../../../../config.ts";

interface CreateWorkData {
    title: string;
    description: string;
    year: number;
    art_type: string;
    medium_id?: number;
    collection_id?: number;
    image: File;
}

export default function CreateWork() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateWorkData) => {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("year", data.year.toString());
            formData.append("art_type", data.art_type);
            formData.append("image", data.image);
            if (data.medium_id) formData.append("medium_id", data.medium_id.toString());
            if (data.collection_id) formData.append("collection_id", data.collection_id.toString());

            const response = await fetch(`${config.apiUrl}/admin/works`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Works"] });
        },
    });
}