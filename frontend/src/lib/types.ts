export interface Art {
	id: number;
	title: string;
	slug: string;
	image: string;
	art_type?: 'digital' | 'traditional';
	medium?: string;
	collection_medium_name?: string;
	description?: string;
	year?: number;
	collection_id?: number;
	medium_id?: number;
	created_at?: string;
	updated_at?: string;
}
