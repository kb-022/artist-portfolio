export interface TraditionalWork {
    id: number;
    title: string;
    slug: string;
    image: string;
    medium: string;
}

export interface Work {
    id: number,
    title: string,
    slug: string,
    description: string,
    year: number,
    image: string,
    collection_medium_name: string,
    art_type: string,
}

export interface Collection {
    id : number;
    name: string;
    slug: string;
    description: string;
    cover_work_id: number;
    cover_image: string;
}