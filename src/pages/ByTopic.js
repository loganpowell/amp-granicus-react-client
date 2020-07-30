import React from "react"
import { VegaLite } from "react-vega"
import { Filter } from "../components"
import { punchcard, matrix3x3, matrix_topics } from "../viz_specs"

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
            <VegaLite data={{ data }} spec={matrix_topics} />
            {/*<VegaLite data={{ data }} spec={punchcard} />*/}
            {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
        </>
    )
}
