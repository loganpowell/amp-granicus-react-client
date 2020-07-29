import React from "react"
import { VegaLite } from "react-vega"
import { Filter } from "../components"
import { matrix_senders } from "../viz_specs"

export const BySender = ({ data }) => {
    return (
        <>
            <Filter
                selections={{
                    id: "email",
                    limit: "limit",
                    camp: "campaign",
                    sort: "sort",
                }}
            />
            <VegaLite
                data={{ data }}
                style={{ width: "85%" }}
                spec={matrix_senders}
            />
            {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
        </>
    )
}
