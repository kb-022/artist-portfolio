import {Navigate, useParams} from "react-router-dom";
import FetchCollection from "../components/hooks/fetch/FetchCollection.tsx";
import FetchCollectionWorks from "../components/hooks/fetch/FetchCollectionWorks.tsx";
import CollectionDisplayCard from "../components/art/CollectionDisplayCard.tsx";
import {RouterPath} from "../enums/RouterPath.ts";



export default function Collection() {
    const {slug = ""} = useParams();
    const {data : collection, isLoading: collectionIsLoading, isError: collectionIsError} = FetchCollection(slug);
    const {data : works, isLoading: workIsLoading, isError: workIsError} = FetchCollectionWorks(slug);
    const isLoading = collectionIsLoading || workIsLoading;
    const isError = collectionIsError || workIsError;

    return(
        <main>
            {
                isLoading && (
                    <div>
                        <p>Loading works...</p>
                    </div>
                )}
            {
                isError && (
                 <Navigate to={RouterPath.NOTFOUND}/>
                )}
            {collection && (
                <div className="bg-neutral-100  text-neutral-900 text-center py-16 px-4 mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-3">{collection.name}</h1>
                    <p className="text-lg text-neutral-900 max-w-2xl mx-auto">{collection.description}</p>
                </div>
            )}

            {works  && (
                <div>
                    {works.map((work) => (
                        <CollectionDisplayCard key={work.id} work={work}/>
                    ))}
                </div>
            )}
        </main>
    )
}