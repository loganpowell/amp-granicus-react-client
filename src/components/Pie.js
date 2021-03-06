import React, { useState } from "react"
import { ResponsivePie } from "@nivo/pie"
import { Select, Tooltip } from "antd"
import { Bullet } from "./Bullet"
//import { InfoCircleOutlined } from "@ant-design/icons"

import { primary_color, muted_color } from "../colors"
import { metric_name } from "../utils"

export const Pie = ({ data }) => {
    const color = d => d.color
    const value = d => d.value
    return (
        <ResponsivePie
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.7}
            startAngle={-180}
            padAngle={2}
            cornerRadius={3}
            colors={color}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableSlicesLabels={false}
            animate={false}
            //motionStiffness={90}
            //motionDamping={15}
            // radial labels
            enableRadialLabels={true}
            radialLabel={value}
            radialLabelsLinkHorizontalLength={0}
            radialLabelsLinkDiagonalLength={10}
        />
    )
}
const isPercent = k => metric_name(k).split("#").length === 1
const xform_pie = summary => {
    const xf = Object.entries(summary).reduce((a, c, i, d) => {
        const [k, v] = c

        if (isPercent(k)) {
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

    return xf
}

const xform_bullet = (summary, averages) => {
    const xf = Object.entries(summary).reduce((a, c, i, d) => {
        const [k, v] = c
        if (isPercent(k)) {
            a[k] = [
                {
                    id: k,
                    ranges: [averages[k], 100],
                    measures: [v],
                    markers: [averages[k]],
                },
            ]
        }
        return a
    }, {})
    return xf
}
const { Option } = Select

export const SelectPie = ({ summary, averages }) => {
    const xformed_pie = xform_pie(summary)
    const xformed_bullet = xform_bullet(summary, averages)

    const [selection, setSelection] = useState({
        pie: xformed_pie["percent_emails_delivered"],
        bullet: xformed_bullet["percent_emails_delivered"],
    })

    const select = e => {
        setSelection({ pie: xformed_pie[e], bullet: xformed_bullet[e] })
        //console.log({ e })
    }

    return (
        <>
            <Select
                defaultValue='percent_emails_delivered'
                onChange={select}
                style={{ display: "block", margin: "0 1rem" }}
            >
                {Object.entries(xformed_pie).map(([k, v], i) => (
                    <Option value={k} key={i}>
                        {metric_name(k)}
                    </Option>
                ))}
            </Select>
            {/*<Tooltip
                placement='topLeft'
                title='Average from time period selected'
            >
                <InfoCircleOutlined style={{ marginLeft: "1rem" }} />
            </Tooltip>*/}
            <div style={{ height: "68%" }}>
                <Pie data={selection["pie"]} />
            </div>
            <div style={{ height: "7%", margin: "0 1rem" }}>
                <Bullet data={selection["bullet"]} />
            </div>
        </>
    )
}
