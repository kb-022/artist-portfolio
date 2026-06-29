import type {Work} from "../../types.ts";

export default function WorkDisplay({work}: {work : Work}){
    return(
    <div>
        <div>{work.title}</div>
        <div>{work.description}</div>
        <img src={work.image} alt={work.title}/>
        <div>{work.year}</div>
        <div>{work.art_type}</div>
        <div>{work.collection_medium_name}</div>
    </div>
    )
}