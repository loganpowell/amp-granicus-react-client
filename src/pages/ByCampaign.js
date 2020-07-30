import React, { useEffect, useContext } from "react"
import { isPlainObject } from "@thi.ng/checks"
import { VegaLite } from "react-vega"
import * as K from "@-0/keys"
import { CTX } from "../context"
import { log } from "../utils/data"
import { Filter } from "../components"
import { matrix3x3, matrix_campaign } from "../viz_specs"

export const ByCampaign = ({ data }) => {
    return (
        <>
            <Filter
                selections={{
                    id: "campaign",
                    sender: "sender",
                    limit: "limit",
                    sort: "sort",
                }}
            />
            <VegaLite data={{ data }} spec={matrix_campaign} />
            {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
        </>
    )
}
