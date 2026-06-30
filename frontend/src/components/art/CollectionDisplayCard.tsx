import type {Work} from "../../types.ts";
import {RouterPath} from "../../enums/RouterPath.ts";
import ProtectedImage from "../ProtectedImage.tsx";

interface DigitalDisplayWorkCardProp{
    work: Work;
}


export default function TraditionalDisplayCard({work}: DigitalDisplayWorkCardProp){
    return(
        <a href={`${RouterPath.WORKS}/${work.slug}`}>
            <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
                <div className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{work.title}</div>
                <ProtectedImage src={work.image} alt={work.title} className={"w-full"}/>
            </div>
        </a>
    )
}