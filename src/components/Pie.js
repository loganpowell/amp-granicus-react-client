import React, { useState } from "react"
import { ResponsivePie } from "@nivo/pie"
import { Menu, Dropdown, Button, Select } from "antd"
import { DownOutlined } from "@ant-design/icons"

import { primary_color, muted_color } from "../colors"
import { metric_name } from "../utils"

export const Pie = ({ data }) => (
    <ResponsivePie
        data={data}
        //margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.7}
        padAngle={2}
        cornerRadius={3}
        colors={d => d.color}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableSlicesLabels={false}
        //slicesLabelsSkipAngle={10}
        //slicesLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        // radial labels
        enableRadialLabels={true}
        radialLabel={d => d.value}
        radialLabelsLinkHorizontalLength={0}
        radialLabelsLinkDiagonalLength={10}
    />
)

const xform_summary = summary => {
    //const {
    //    success_count,
    //    percent_emails_delivered,
    //    percent_opened,
    //    click_rate,
    //    unsubscribe_rate,
    //    engagement_rate,
    //} = summary

    const xformed = Object.entries(summary).reduce((a, c, i, d) => {
        const [k, v] = c
        if (k !== "success_count") {
            a[k] = [
                {
                    id: k,
                    label: metric_name(k),
                    value: v,
                    color: primary_color,
                },
                {
                    id: k + "_not",
                    label: "Not " + metric_name(k),
                    value: ~~((100 - v) * 100) / 100,
                    color: muted_color,
                },
            ]
        }
        return a
    }, {})

    return xformed
}

const { Item } = Menu
const { Option } = Select

export const SelectPie = ({ summary }) => {
    const xformed = xform_summary(summary)

    const [selection, setSelection] = useState(
        xformed["percent_emails_delivered"]
    )

    const select = e => {
        setSelection(xformed[e])
        console.log({ e })
    }

    return (
        <>
            <Select defaultValue='percent_emails_delivered' onChange={select}>
                {Object.entries(xformed).map(([k, v], i) => (
                    <Option value={k} key={i}>
                        {metric_name(k)}
                    </Option>
                ))}
            </Select>
            <Pie data={selection} />
        </>
    )
}
