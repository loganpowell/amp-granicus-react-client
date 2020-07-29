import React, { useEffect, useContext } from "react"
import { isPlainObject } from "@thi.ng/checks"
import { VegaLite } from "react-vega"
import * as K from "@-0/keys"
import { facet_lines, matrix3x3 } from "../viz_specs"
//import { CTX } from "../context"
//import { log, flatten_listTopics, JL } from "../utils/data"
import { Filter } from "../components"

export const Home = ({ data }) => {
    return (
        <>
            <Filter
                selections={{
                    id: "topic ID",
                    code: "topic code",
                    name: "topic name",
                    bgn: "start date",
                    end: "end date",
                    sort: "sort",
                    limit: "limit",
                }}
            />
            {/* Home is an empty path = []:: [K.DOM_BODY]: { data: list } <- reassign object: */}
            <VegaLite data={{ data: data.data }} spec={facet_lines} />
        </>
    )
}
