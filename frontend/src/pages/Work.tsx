import FetchWork from "../components/hooks/fetch/FetchWork.tsx"
import {Navigate, useParams} from "react-router-dom";
import WorkDisplay from "../components/art/WorkDisplay.tsx";
import {RouterPath} from "../enums/RouterPath.ts";
export default function Work(){
    const {slug = ""} = useParams();
    const {data, isLoading, isError} = FetchWork(slug);
    return(
        <main>
            {
                isLoading && (
                    <div>
                        <p>Loading works...</p>
                    </div>
                )}

            {
                isError && (
                    <Navigate to={RouterPath.NOTFOUND}/>
                )}

            {data  && (
                <div>
                    <WorkDisplay key = {data.id} work={data}/>
                </div>
            )}
        </main>
    )
}