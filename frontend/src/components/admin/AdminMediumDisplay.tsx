import {useState} from "react";
import CreateMedium from "../hooks/auth/mediums/CreateMedium.tsx";
import DeleteMedium from "../hooks/auth/mediums/DeleteMedium.tsx";
import UpdateMedium from "../hooks/auth/mediums/UpdateMedium.tsx";
import FetchMediums from "../hooks/fetch/FetchMediums.tsx";

export default function AdminMediumDisplay(){
    const [createName, setCreateName] = useState("");
    const createMedium = CreateMedium();

    const [deleteSlug, setDeleteSlug] = useState("");
    const deleteMedium = DeleteMedium();

    const [patchSlug, setPatchSlug] = useState("");
    const [patchName, setPatchName] = useState("");
    const patchMedium = UpdateMedium();

    const {data : mediums} = FetchMediums();

    const handleCreate = async (e) => {
        e.preventDefault();
        await createMedium.mutateAsync(createName);
        setCreateName("");
    }
    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteMedium.mutateAsync(deleteSlug);
        setDeleteSlug("");
    }

    const handlePatch = async (e) => {
        e.preventDefault();
        await patchMedium.mutateAsync({slug: patchSlug, name: patchName});
        setPatchSlug("");
        setPatchName("")
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
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Medium name"
                required
                className={inputClass}
            />
            <button
                type="submit"
                disabled={createMedium.isPending}
                className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm disabled:opacity-50"
            >
                {createMedium.isPending ? "Creating..." : "Create"}
            </button>
            {createMedium.isSuccess && <p className="text-green-600 text-sm">Created successfully</p>}
            {createMedium.isError && <p className="text-red-600 text-sm">Failed to create</p>}
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
                <option value="">Select a medium</option>
                {mediums?.map((medium) => (
                    <option key={medium.id} value={medium.slug}>
                        {medium.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={patchName}
                onChange={(e) => setPatchName(e.target.value)}
                placeholder="New name"
                required
                className={inputClass}
            />
            <button
                type="submit"
                disabled={patchMedium.isPending || !patchSlug}
                className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm disabled:opacity-50"
            >
                {patchMedium.isPending ? "Updating..." : "Update"}
            </button>
            {patchMedium.isSuccess && <p className="text-green-600 text-sm">Updated successfully</p>}
            {patchMedium.isError && <p className="text-red-600 text-sm">Failed to update</p>}
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
                <option value="">Select a medium</option>
                {mediums?.map((medium) => (
                    <option key={medium.id} value={medium.slug}>
                        {medium.name}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                disabled={deleteMedium.isPending || !deleteSlug}
                className="w-full bg-red-600 text-white rounded-lg py-2 text-sm disabled:opacity-50"
            >
                {deleteMedium.isPending ? "Deleting..." : "Delete"}
            </button>
            {deleteMedium.isSuccess && <p className="text-green-600 text-sm">Deleted successfully</p>}
            {deleteMedium.isError && <p className="text-red-600 text-sm">Failed to delete</p>}
        </form>
    </div>
        </div>
    )
}