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
            <div style={{ backgroundColor: "white", padding: "1.5rem 0" }}>
                <VegaLite data={{ data }} spec={matrix_topics} />
            </div>
            {/*<VegaLite data={{ data }} spec={punchcard} />*/}
            {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
        </>
    )
}
