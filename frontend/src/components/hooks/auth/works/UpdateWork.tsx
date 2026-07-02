import {useMutation, useQueryClient} from "@tanstack/react-query";
import config from "../../../../config.ts";

interface UpdateWork {
    slug: string;
    title? : string;
    description? : string;
    year? : number;
}

export default function UpdateWork() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({slug, ...fields} : UpdateWork)=> {
            const response = await fetch(`${config.apiUrl}/admin/works/${slug}`,{
                method: "PATCH",
                body: JSON.stringify(fields),
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["Works"]})
        }
    });
}