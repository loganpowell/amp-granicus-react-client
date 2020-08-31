import React from "react"
import { Card } from "antd"

export const TableCard = entry => {
    return (
        <Card
            size='small'
            title='Small size card'
            extra={<a href='#'>More</a>}
            style={{ width: 300 }}
        >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
        </Card>
    )
}
