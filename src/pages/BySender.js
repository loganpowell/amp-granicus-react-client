import React from "react"
import { Card, Table } from "antd"

import { primary_color } from "../colors"
import { Filter, Pie, SelectPie } from "../components"
import { coll_aggregator_sender, log, metric_name } from "../utils"

//import { VegaLite } from "react-vega"
//import { matrix_senders } from "../viz_specs"

export const BySender = ({ data }) => {
    const xformed = coll_aggregator_sender(data)
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
            {/*<VegaLite
                data={{ data }}
                style={{ width: "85%" }}
                spec={matrix_senders}
            />*/}
            {Object.entries(xformed).map(([sender, metrics], idx) => {
                const { summary, reports } = metrics
                const {
                    success_count,
                    percent_emails_delivered,
                    percent_opened,
                    click_rate,
                    unsubscribe_rate,
                    engagement_rate,
                } = summary
                // first: summary table

                const datasource = Object.entries(summary).reduce(
                    (a, c, i, d) => {
                        const [k, v] = c
                        a.push({
                            key: i,
                            metric: metric_name(k),
                            value: v,
                        })
                        return a
                    },
                    []
                )
                const columns = [
                    {
                        title: "Metric",
                        dataIndex: "metric",
                        responsive: ["md"],
                    },
                    { title: "Value", dataIndex: "value", responsive: ["md"] },
                ]
                const grid_style = {
                    width: "24%",
                    textAlign: "center",
                    height: "20rem",
                    border: "none",
                }
                // second: donut chart
                const pie_data = [
                    {
                        id: "percent_opened",
                        label: "Percent Opened",
                        value: percent_opened,
                        color: primary_color,
                    },
                    {
                        id: "percent_unopened",
                        label: "Percent Unopened",
                        value: 100 - percent_opened,
                        color: "#F0F2F5",
                    },
                ]
                //log({ percent_opened })
                return (
                    <Card
                        title={sender}
                        key={idx}
                        style={{ marginBottom: "1rem" }}
                    >
                        <Card.Grid style={grid_style}>
                            <Table
                                dataSource={datasource}
                                columns={columns}
                                size='small'
                                pagination={false}
                            />
                        </Card.Grid>
                        <Card.Grid style={grid_style}>
                            <SelectPie summary={summary} />
                            {/*<Pie data={pie_data} />*/}
                        </Card.Grid>
                    </Card>
                    //<br />
                )
            })}
            <pre>{JSON.stringify(xformed, null, 2)}</pre>
        </>
    )
}
