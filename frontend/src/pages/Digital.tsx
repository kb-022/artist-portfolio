import FetchCollections from "../components/hooks/fetch/FetchCollections.tsx";
import CollectionsDisplay from "../components/art/CollectionsDisplay.tsx";

export default function Digital() {
    const {data, isLoading, isError, error} = FetchCollections();
    return(
        <main>
            <div className="mb-12 justify-center">
                <h1 className="mb-4 text-5xl font-bold text-gray-900">Digital Works</h1>
                <p className="max-w-2xl text-lg text-gray-600">
                    Explore my collection of digital artworks by their collection.
                </p>
            </div>
            {
                isLoading && (
                    <div>
                        <p>Loading works...</p>
                    </div>
                )}

            {isError && (
                <div>
                    <p>Could not load content. {(error as Error)?.message}</p>
                </div>
            )}

            {data && data.length === 0 && (
                <div>
                    <p>No works to display yet.</p>
                </div>
            )}

            {data && data.length > 0 && (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center">
                    {data.map((collection) => (
                        <CollectionsDisplay key={collection.id} collection={collection}/>
                    ))}
                </div>
            )}
        </main>
    )
}