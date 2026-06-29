import FetchTraditional from "../components/hooks/FetchTraditional.tsx";
import TraditionalDisplayCard from "../components/art/TraditionalDisplayCard.tsx";

export default function Traditional() {
    const {data, isLoading, isError, error} = FetchTraditional();
    return(
        <main>
            <div className="mb-12 justify-center">
                <h1 className="mb-4 text-5xl font-bold text-gray-900">Traditional Works</h1>
                <p className="max-w-2xl text-lg text-gray-600">
                    Explore my collection of traditional artworks created with various mediums.
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
                {data.map((work) => (
                    <TraditionalDisplayCard key={work.id} work={work}/>
                    ))}
                </div>
            )}
        </main>
    )
}