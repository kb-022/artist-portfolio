import {useMutation, useQueryClient} from "@tanstack/react-query";
import config from "../../../../config.ts";

export default function CreateMedium() {
    const queryClient = useQueryClient();
    return useMutation({
       mutationFn: async (name: string)=> {
           const response = await fetch(`${config.apiUrl}/admin/mediums`,{
                method: "POST",
               body: JSON.stringify({name}),
               credentials: "include",
               headers: { 'Content-Type': 'application/json' },
               });
           if (!response.ok) throw new Error(`API Error: ${response.status}`);
           return response.json();
           },
        onSuccess: () => {
           queryClient.invalidateQueries({queryKey: ["Mediums"]})
        }
    });
}