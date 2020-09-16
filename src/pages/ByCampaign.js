import React, { useState, useContext } from "react"
import { isPlainObject } from "@thi.ng/checks"
import { VegaLite } from "react-vega"
import { Button, Typography } from "antd"

//import * as K from "@-0/keys"
//import { CTX } from "../context"
//import { log } from "../utils/data"
import { primary_color } from "../colors"
import { Filter } from "../components"
import { matrix_campaign, matrix_campaign_h } from "../viz_specs"

const { Title } = Typography
export const ByCampaign = ({ data = [] }) => {
    const above100sent = data.filter(x => x.emails_sent > 100)
    //const above100sent = data
    const [isVertical, setIsVertical] = useState(true)
    return (
        <>
            <Title style={{ color: primary_color, marginTop: "1em" }}>
                By Campaign
            </Title>
            <Filter
                selections={{
                    id: "campaign",
                    sender: "sender",
                    limit: "limit",
                    sort: "sort",
                }}
            />

            <div
                style={{
                    backgroundColor: "white",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                }}
            >
                <Button
                    type='primary'
                    size='medium'
                    style={{ marginBottom: "1rem", width: "8rem" }}
                    onClick={() => setIsVertical(!isVertical)}
                >
                    View {isVertical ? "Horizontal" : "Vertical"}
                </Button>
                {isVertical ? (
                    <VegaLite
                        data={{ data: above100sent }}
                        spec={matrix_campaign}
                    />
                ) : (
                    <VegaLite
                        data={{ data: above100sent }}
                        spec={matrix_campaign_h}
                    />
                )}
            </div>
            {/*<pre>{JSON.stringify(above100sent, null, 2)}</pre>*/}
        </>
    )
}
