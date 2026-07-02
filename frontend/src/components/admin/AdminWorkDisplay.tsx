import DeleteWork from "../hooks/auth/works/DeleteWork.tsx";
import {useState} from "react";
import FetchAllWorks from "../hooks/fetch/FetchAllWorks.tsx";
import UpdateWork from "../hooks/auth/works/UpdateWork.tsx";
import CreateWork from "../hooks/auth/works/CreateWork.tsx";
import FetchCollections from "../hooks/fetch/FetchCollections.tsx";
import FetchMediums from "../hooks/fetch/FetchMediums.tsx";


export default function AdminWorkDisplay(){
    const [createTitle, setCreateTitle] = useState("");
    const [createDescription, setCreateDescription] = useState("");
    const [createYear, setCreateYear] = useState("");
    const [createArtType, setCreateArtType] = useState("");
    const [createMediumId, setCreateMediumId] = useState("");
    const [createCollectionId, setCreateCollectionId] = useState("");
    const [createImage, setCreateImage] = useState<File | null>(null);
    const createWork = CreateWork();

    const [patchSlug, setPatchSlug] = useState("");
    const [patchTitle, setPatchTitle] = useState("");
    const [patchDescription, setPatchDescription] = useState("");
    const [patchYear, setPatchYear] = useState("");
    const patchWork = UpdateWork();

    const [deleteSlug, setDeleteSlug] = useState("");
    const deleteWork = DeleteWork();

    const { data: works } = FetchAllWorks();
    const { data: mediums } = FetchMediums();
    const { data: collections } = FetchCollections();

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!createImage) return;
        await createWork.mutateAsync({
            title: createTitle,
            description: createDescription,
            year: parseInt(createYear),
            art_type: createArtType,
            medium_id: createMediumId ? parseInt(createMediumId) : undefined,
            collection_id: createCollectionId ? parseInt(createCollectionId) : undefined,
            image: createImage,
        });
        setCreateTitle("");
        setCreateDescription("");
        setCreateYear("");
        setCreateArtType("");
        setCreateMediumId("");
        setCreateCollectionId("");
        setCreateImage(null);
    };

    const handlePatch = async (e) => {
        e.preventDefault();
        await patchWork.mutateAsync({
            slug: patchSlug,
            ...(patchTitle && { title: patchTitle }),
            ...(patchDescription && { description: patchDescription }),
            ...(patchYear && { year: parseInt(patchYear) }),
        });
        setPatchSlug("");
        setPatchTitle("");
        setPatchDescription("");
        setPatchYear("");
    };
    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteWork.mutateAsync(deleteSlug);
        setDeleteSlug("");
    }

    const selectClass = "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white";
    const inputClass = "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm";
    const cardClass = "border border-neutral-200 rounded-lg p-4";
    const labelClass = "text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4";
    return(
        <div>
            {/* Create */}
            <div className={cardClass}>
                <h3 className={labelClass}>Create</h3>
                <form onSubmit={handleCreate} className="space-y-3">
                    <input
                        type="text"
                        value={createTitle}
                        onChange={(e) => setCreateTitle(e.target.value)}
                        placeholder="Title"
                        required
                        className={inputClass}
                    />
                    <input
                        type="text"
                        value={createDescription}
                        onChange={(e) => setCreateDescription(e.target.value)}
                        placeholder="Description"
                        required
                        className={inputClass}
                    />
                    <input
                        type="number"
                        value={createYear}
                        onChange={(e) => setCreateYear(e.target.value)}
                        placeholder="Year"
                        required
                        className={inputClass}
                    />
                    <select
                        value={createArtType}
                        onChange={(e) => {
                            setCreateArtType(e.target.value);
                            setCreateMediumId("");
                            setCreateCollectionId("");
                        }}
                        required
                        className={selectClass}
                    >
                        <option value="">Select type</option>
                        <option value="traditional">Traditional</option>
                        <option value="digital">Digital</option>
                    </select>

                    {createArtType === "traditional" && (
                        <select
                            value={createMediumId}
                            onChange={(e) => setCreateMediumId(e.target.value)}
                            required
                            className={selectClass}
                        >
                            <option value="">Select medium</option>
                            {mediums?.map((medium) => (
                                <option key={medium.id} value={medium.id}>
                                    {medium.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {createArtType === "digital" && (
                        <select
                            value={createCollectionId}
                            onChange={(e) => setCreateCollectionId(e.target.value)}
                            required
                            className={selectClass}
                        >
                            <option value="">Select collection</option>
                            {collections?.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCreateImage(e.target.files?.[0] ?? null)}
                        required
                        className={inputClass}
                    />
                    <button
                        type="submit"
                        disabled={createWork.isPending || !createImage}
                        className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                    >
                        {createWork.isPending ? "Creating..." : "Create"}
                    </button>
                    {createWork.isSuccess && <p className="text-green-600 text-sm">Created successfully</p>}
                    {createWork.isError && <p className="text-red-600 text-sm">Failed to create</p>}
                </form>
            </div>


            {/* Patch */}
            <div className={cardClass}>
                <h3 className={labelClass}>Edit</h3>
                <form onSubmit={handlePatch} className="space-y-3">
                    <select
                        value={patchSlug}
                        onChange={(e) => setPatchSlug(e.target.value)}
                        required
                        className={selectClass}
                    >
                        <option value="">Select a work</option>
                        {works?.map((work) => (
                            <option key={work.id} value={work.slug}>
                                {work.title}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={patchTitle}
                        onChange={(e) => setPatchTitle(e.target.value)}
                        placeholder="New title (optional)"
                        className={inputClass}
                    />
                    <input
                        type="text"
                        value={patchDescription}
                        onChange={(e) => setPatchDescription(e.target.value)}
                        placeholder="New description (optional)"
                        className={inputClass}
                    />
                    <input
                        type="number"
                        value={patchYear}
                        onChange={(e) => setPatchYear(e.target.value)}
                        placeholder="New year (optional)"
                        className={inputClass}
                    />
                    <button
                        type="submit"
                        disabled={patchWork.isPending || !patchSlug}
                        className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                    >
                        {patchWork.isPending ? "Updating..." : "Update"}
                    </button>
                    {patchWork.isSuccess && <p className="text-green-600 text-sm">Updated successfully</p>}
                    {patchWork.isError && <p className="text-red-600 text-sm">Failed to update</p>}
                </form>
            </div>

            {/* Delete */}
            <div className={cardClass}>
                <h3 className={labelClass}>Delete</h3>
                <form onSubmit={handleDelete} className="space-y-3">
                    <select
                        value={deleteSlug}
                        onChange={(e) => setDeleteSlug(e.target.value)}
                        required
                        className={selectClass}
                    >
                        <option value="">Select a work</option>
                        {works?.map((work) => (
                            <option key={work.id} value={work.slug}>
                                {work.title}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={deleteWork.isPending || !deleteSlug}
                        className="w-full bg-red-600 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                    >
                        {deleteWork.isPending ? "Deleting..." : "Delete"}
                    </button>
                    {deleteWork.isSuccess && <p className="text-green-600 text-sm">Deleted successfully</p>}
                    {deleteWork.isError && <p className="text-red-600 text-sm">Failed to delete</p>}
                </form>
            </div>

        </div>
    )


}