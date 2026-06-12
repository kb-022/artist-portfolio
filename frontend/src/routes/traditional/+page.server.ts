import { PUBLIC_API_URL } from '$env/static/public';
import type { Art } from '$lib/types';
import type { PageServerLoad } from './$types';

interface Medium {
	id: number;
	name: string;
	slug: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const [artRes, mediumRes] = await Promise.all([
			fetch(`${PUBLIC_API_URL}/api/traditional`),
			fetch(`${PUBLIC_API_URL}/api/mediums`)
		]);

		if (!artRes.ok) throw new Error('Failed to fetch traditional works');
		if (!mediumRes.ok) throw new Error('Failed to fetch mediums');

		const artworks: Art[] = await artRes.json();
		const mediums: Medium[] = await mediumRes.json();

		// Prepend the backend URL to image paths
		const processedArtworks = artworks.map((art) => ({
			...art,
			image: `${PUBLIC_API_URL}${art.image}`
		}));

		return { artworks: processedArtworks, mediums };
	} catch (error) {
		console.error('Error fetching traditional works:', error);
		return { artworks: [], mediums: [] };
	}
};
