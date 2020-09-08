import React from "react"
import { ResponsiveBullet } from "@nivo/bullet"
import { primary_color } from "../colors"
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const Bullet = ({ data }) => (
    <ResponsiveBullet
        data={data}
        //margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
        //spacing={46}
        titleAlign='start'
        titleOffsetX={-150}
        axisPosition='after'
        markerSize={1}
        measureSize={0.4}
        animate={false}
        motionStiffness={90}
        motionDamping={12}
        rangeColors='greys'
        markerColors='red'
        measureColors={primary_color}
    />
)
