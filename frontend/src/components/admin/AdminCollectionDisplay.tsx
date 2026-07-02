import {type SubmitEventHandler, useState} from "react";
import FetchCollections from "../hooks/fetch/FetchCollections.tsx";
import CreateCollection from "../hooks/auth/collection/CreateCollection.tsx";
import UpdateCollection from "../hooks/auth/collection/UpdateCollection.tsx";
import DeleteCollection from "../hooks/auth/collection/DeleteCollection.tsx";
import UpdateCollectionCover from "../hooks/auth/collection/UpdateCollectionCover.tsx";
import FetchCollectionWorks from "../hooks/fetch/FetchCollectionWorks.tsx";


export default function AdminCollectionDisplay() {
    // create state
    const [createName, setCreateName] = useState("");
    const [createDescription, setCreateDescription] = useState("");

    // update state
    const [updateSlug, setUpdateSlug] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");

    // delete state
    const [deleteSlug, setDeleteSlug] = useState("");

    // cover state
    const [coverSlug, setCoverSlug] = useState("");
    const [coverWorkId, setCoverWorkId] = useState("");

    const { data: collections } = FetchCollections();
    const { data: coverWorks } = FetchCollectionWorks(coverSlug);

    const createCollection = CreateCollection();
    const updateCollection = UpdateCollection();
    const deleteCollection = DeleteCollection();
    const updateCover = UpdateCollectionCover();

    const handleCreate : SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await createCollection.mutateAsync({
            name: createName,
            ...(createDescription && { description: createDescription }),
        });
        setCreateName("");
        setCreateDescription("");
    };

    const handleUpdate : SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await updateCollection.mutateAsync({
            slug: updateSlug,
            ...(updateName && { name: updateName }),
            ...(updateDescription && { description: updateDescription }),
        });
        setUpdateSlug("");
        setUpdateName("");
        setUpdateDescription("");
    };

    const handleDelete : SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete? This action cannot be reversed!")){
            return;
        }
        await deleteCollection.mutateAsync(deleteSlug);
        setDeleteSlug("");
    };

    const handleCover : SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await updateCover.mutateAsync({
            slug: coverSlug,
            work_id: parseInt(coverWorkId),
        });
        setCoverSlug("");
        setCoverWorkId("");
    };

    const selectClass = "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white";
    const inputClass = "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm";
    const cardClass = "border border-neutral-200 rounded-lg p-4";
    const labelClass = "text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4";

    return (
        <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Collections</h2>
                {/* Create */}
                <div className={cardClass}>
                    <h3 className={labelClass}>Create</h3>
                    <form onSubmit={handleCreate} className="space-y-3">
                        <input
                            type="text"
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            placeholder="Collection name"
                            required
                            className={inputClass}
                        />
                        <input
                            type="text"
                            value={createDescription}
                            onChange={(e) => setCreateDescription(e.target.value)}
                            placeholder="Description (optional)"
                            className={inputClass}
                        />
                        <button
                            type="submit"
                            disabled={createCollection.isPending}
                            className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                        >
                            {createCollection.isPending ? "Creating..." : "Create"}
                        </button>
                        {createCollection.isSuccess && <p className="text-green-600 text-sm">Created successfully</p>}
                        {createCollection.isError && <p className="text-red-600 text-sm">Failed to create</p>}
                    </form>
                </div>

                {/* Update */}
                <div className={cardClass}>
                    <h3 className={labelClass}>Edit</h3>
                    <form onSubmit={handleUpdate} className="space-y-3">
                        <select
                            value={updateSlug}
                            onChange={(e) => setUpdateSlug(e.target.value)}
                            required
                            className={selectClass}
                        >
                            <option value="">Select a collection</option>
                            {collections?.map((collection) => (
                                <option key={collection.id} value={collection.slug}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={updateName}
                            onChange={(e) => setUpdateName(e.target.value)}
                            placeholder="New name (optional)"
                            className={inputClass}
                        />
                        <input
                            type="text"
                            value={updateDescription}
                            onChange={(e) => setUpdateDescription(e.target.value)}
                            placeholder="New description (optional)"
                            className={inputClass}
                        />
                        <button
                            type="submit"
                            disabled={updateCollection.isPending || !updateSlug}
                            className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                        >
                            {updateCollection.isPending ? "Updating..." : "Update"}
                        </button>
                        {updateCollection.isSuccess && <p className="text-green-600 text-sm">Updated successfully</p>}
                        {updateCollection.isError && <p className="text-red-600 text-sm">Failed to update</p>}
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
                            <option value="">Select a collection</option>
                            {collections?.map((collection) => (
                                <option key={collection.id} value={collection.slug}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={deleteCollection.isPending || !deleteSlug}
                            className="w-full bg-red-600 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                        >
                            {deleteCollection.isPending ? "Deleting..." : "Delete"}
                        </button>
                        {deleteCollection.isSuccess && <p className="text-green-600 text-sm">Deleted successfully</p>}
                        {deleteCollection.isError && <p className="text-red-600 text-sm">Failed to delete</p>}
                    </form>
                </div>

                {/* Update Cover */}
                <div className={cardClass}>
                    <h3 className={labelClass}>Update Cover</h3>
                    <form onSubmit={handleCover} className="space-y-3">
                        <select
                            value={coverSlug}
                            onChange={(e) => {
                                setCoverSlug(e.target.value);
                                setCoverWorkId("");
                            }}
                            required
                            className={selectClass}
                        >
                            <option value="">Select a collection</option>
                            {collections?.map((collection) => (
                                <option key={collection.id} value={collection.slug}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={coverWorkId}
                            onChange={(e) => setCoverWorkId(e.target.value)}
                            required
                            disabled={!coverSlug}
                            className={selectClass}
                        >
                            <option value="">Select a work</option>
                            {coverWorks?.map((work) => (
                                <option key={work.id} value={work.id}>
                                    {work.title}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={updateCover.isPending || !coverSlug || !coverWorkId}
                            className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm disabled:opacity-50"
                        >
                            {updateCover.isPending ? "Updating..." : "Update Cover"}
                        </button>
                        {updateCover.isSuccess && <p className="text-green-600 text-sm">Cover updated successfully</p>}
                        {updateCover.isError && <p className="text-red-600 text-sm">Failed to update cover</p>}
                    </form>
                </div>
        </div>
    );
}