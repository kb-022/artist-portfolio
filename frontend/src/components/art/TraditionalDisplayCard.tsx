import type {TraditionalWork} from "../../types.ts";
import {RouterPath} from "../../enums/RouterPath.ts";


interface TraditionalWorkCardProps{
    work: TraditionalWork;
}

export default function TraditionalDisplayCard({work}: TraditionalWorkCardProps){
    return(
        <a href={`${RouterPath.WORKS}/${work.slug}`}>
        <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
                <div className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">{work.title}</div>
                <p className="text-body mb-6">
                    {work.medium}
                </p>
            <img className="w-full" src={work.image} alt={work.title}/>
        </div>
        </a>
    )
}