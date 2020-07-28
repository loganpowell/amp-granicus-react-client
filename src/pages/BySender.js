import React from "react"
import { VegaLite } from "react-vega"
import { matrix3x3 } from "../viz_specs"
import { Filter } from "../components"

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
            <VegaLite data={{ data }} spec={matrix3x3} />
        </>
    )
}
