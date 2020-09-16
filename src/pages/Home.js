import React, { useEffect, useContext } from "react"
import { isPlainObject } from "@thi.ng/checks"
import { VegaLite } from "react-vega"
import * as K from "@-0/keys"
//import { CTX } from "../context"
import { log, JL } from "../utils/data"
import { Filter } from "../components"
import { facet_lines, matrix3x3 } from "../viz_specs"

export const Home = ({ data }) => {
    //const filtered = data.filter(x => x.emails_sent > 100)
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
            <VegaLite
                data={{ data: data.data }}
                style={{ width: "85%" }}
                spec={facet_lines}
                //logLevel={4}
            />
            {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
        </>
    )
}
