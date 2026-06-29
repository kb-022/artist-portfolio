import {Navigate, useParams} from "react-router-dom";
import FetchCollection from "../components/hooks/FetchCollection.tsx";
import FetchCollectionWorks from "../components/hooks/FetchCollectionWorks.tsx";
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
                <div>
                <h1>{collection.name}</h1>
                    <p>{collection.description}</p>
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