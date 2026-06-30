import FetchTraditional from "../components/hooks/FetchTraditional.tsx";
import TraditionalDisplayCard from "../components/art/TraditionalDisplayCard.tsx";
import FetchMediums from "../components/hooks/FetchMediums.tsx";
import {useState} from "react";

export default function Traditional() {
    const [selectedMedium, setSelectedMedium] = useState<string | null>(null);
    const {data, isLoading, isError, error} = FetchTraditional();
    const {data : mediums, isLoading : mediumsIsLoading} = FetchMediums();

    const filteredWorks = data?.filter((data) =>
        selectedMedium ? data.medium === selectedMedium : true
    );
    return(
        <main>
            <div className="mb-12 justify-center">
                <h1 className="mb-4 text-5xl font-bold text-gray-900">Traditional Works</h1>
                <p className="max-w-2xl text-lg text-gray-600">
                    Explore my collection of traditional artworks created with various mediums.
                </p>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={() => setSelectedMedium(null)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
            ${selectedMedium === null
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-transparent text-neutral-700 border-neutral-300 hover:border-neutral-500"
                }`}>
                    All
                </button>
                {!mediumsIsLoading && mediums?.map((medium) => (
                    <button
                        key={medium.id}
                        onClick={() => setSelectedMedium(medium.name)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                ${selectedMedium === medium.name
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-transparent text-neutral-700 border-neutral-300 hover:border-neutral-500"
                    }`}
                    >
                        {medium.name}
                    </button>
                ))}
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

            {filteredWorks && (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center">
                {filteredWorks.map((work) => (
                    <TraditionalDisplayCard key={work.id} work={work}/>
                    ))}
                </div>
            )}
        </main>
    )
}