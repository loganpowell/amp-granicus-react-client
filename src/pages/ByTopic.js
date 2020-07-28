import React from "react"
import { VegaLite } from "react-vega"
import { punchcard, matrix3x3 } from "../viz_specs"
import { Filter } from "../components"

export const ByTopic = ({ data }) => {
    return (
        <>
            <Filter
                selections={{
                    name: "topic name",
                    limit: "limit",
                    code: "topic code",
                    id: "topic id",
                    bgn: "start date",
                    end: "end date",
                    sort: "sort",
                }}
            />
            <VegaLite data={{ data }} spec={matrix3x3} />
            {/*<VegaLite data={{ data }} spec={punchcard} />*/}
        </>
    )
}

//export const ByTopic = ({ data }) => {
//    return (
//        <div style={{ width: "100%" }}>
//            <VegaLite data={{ data }} spec={punchcard} />
//        </div>
//    )
//}
