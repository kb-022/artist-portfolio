import type {Work} from "../../types.ts";
import ProtectedImage from "../ProtectedImage.tsx";

export default function WorkDisplay({work}: {work : Work}){
    return(
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-neutral-100 flex items-center justify-center">
                    <ProtectedImage src={work.image} alt={work.title} className={"max-h-[60vh] w-full object-contain"}/>
                </div>
                <div className="p-6">
                    <div className="text-2xl font-semibold text-neutral-900">{work.title}</div>
                    <div className="text-sm text-neutral-500 mb-4">{work.year} · {work.collection_medium_name}</div>
                    <p className="text-base text-neutral-700 leading-relaxed">{work.description}</p>
                </div>
            </div>
        </main>
    )
}