import { PUBLIC_API_URL } from '$env/static/public';
import type { Art } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const res = await fetch(`${PUBLIC_API_URL}/api/works/${params.slug}`);

		if (!res.ok) {
			throw error(404, 'Artwork not found');
		}

		const artwork: Art = await res.json();

		// Prepend backend URL to image path
		artwork.image = `${artwork.image}`;

		return { artwork };
	} catch (err) {
		console.error('Error fetching artwork:', err);
		throw error(404, 'Artwork not found');
	}
};
