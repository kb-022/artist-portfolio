import type {Collection} from "../../types.ts";
import {RouterPath} from "../../enums/RouterPath.ts";


interface CollectionDisplayProps{
    collection: Collection;
}

export default function TraditionalDisplayCard({collection}: CollectionDisplayProps){
    return(
        <a href={`${RouterPath.COLLECTIONS}/${collection.slug}`}>
            <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
                <div className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{collection.name}</div>
                <p className="text-body mb-6">
                    {collection.description}
                </p>
                { collection.cover_image && (
                <img className="w-full" src={collection.cover_image} alt={collection.name}/>
                )}
            </div>
        </a>
    )
}