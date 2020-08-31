import React from "react"
import { ResponsiveBar } from "@nivo/bar"

import { metric_name } from "../utils"
import { primary_color, muted_color } from "../colors"

const xform_bar = summary => {
    //const {
    //    success_count,
    //    percent_emails_delivered,
    //    percent_opened,
    //    click_rate,
    //    unsubscribe_rate,
    //    engagement_rate,
    //} = summary
    const xf = Object.entries(summary).reduce((a, c, i, d) => {
        const [k, v] = c
        const isPercent = k => metric_name(k).split("#").length === 1
        if (!isPercent(k) && k !== "success_count" && k !== "impressions") {
            a.push({
                id: metric_name(k),
                label: metric_name(k),
                value: v,
                color: primary_color,
            })
        }
        return a
    }, [])

    return xf.sort((a, b) => a.value - b.value)
}

export const Bar = ({ summary }) => {
    const xformed = xform_bar(summary)
    return (
        <ResponsiveBar
            data={xformed}
            margin={{ top: 10, right: 10, bottom: 20, left: 100 }}
            padding={0.3}
            layout='horizontal'
            colors={primary_color}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisBottom={null}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={muted_color}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )
}
