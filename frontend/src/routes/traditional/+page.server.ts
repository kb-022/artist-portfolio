import { PUBLIC_API_URL } from '$env/static/public';
import type { Art } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/api/traditional`);
		if (!res.ok) throw new Error('Failed to fetch traditional works');

		const artworks: Art[] = await res.json();

		// Prepend the backend URL to image paths
		const processedArtworks = artworks.map((art) => ({
			...art,
			image: `${PUBLIC_API_URL}${art.image}`
		}));

		return { artworks: processedArtworks };
	} catch (error) {
		console.error('Error fetching traditional works:', error);
		return { artworks: [] };
	}
};
