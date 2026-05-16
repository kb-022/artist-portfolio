import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from "./$types";
import {error} from "@sveltejs/kit";
export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch(`${PUBLIC_API_URL}/api/traditional`);

    if (!response.ok){
        throw error(response.status, 'Failed to fetch data');
    }

    const works = await response.json();
    return { works };
};