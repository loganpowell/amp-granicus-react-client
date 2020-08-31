import React from "react"
import { Card, Table, Tooltip } from "antd"

import { primary_color } from "../colors"
import { Filter, SelectPie, Bar } from "../components"
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

                // metrics table
                const datasource_metrics = Object.entries(summary).reduce(
                    (a, c, i, d) => {
                        const [k, v] = c
                        if (
                            metric_name(k).split("#").length === 1 ||
                            k === "success_count" ||
                            k === "impressions"
                            //&&
                        ) {
                            a.push({
                                key: i,
                                metric: metric_name(k),
                                value: v,
                            })
                        }
                        return a
                    },
                    []
                )
                const metric_columns = [
                    {
                        title: "Metric",
                        dataIndex: "metric",
                    },
                    { title: "Value", dataIndex: "value", responsive: ["md"] },
                ]
                const grid_style = {
                    width: "24%",
                    textAlign: "center",
                    height: "22rem",
                    border: "none",
                    padding: "1rem",
                }

                // bulletin table
                const data_bulletins = reports.map((report, key) => ({
                    key,
                    name: report.subject,
                    date: new Date(report.created_at).toLocaleDateString(),
                }))
                const bulletin_columns = [
                    {
                        title: "Bulletin Name",
                        dataIndex: "name",
                        key: "name",
                        //responsive: ["md"],
                        ellipsis: { showTitle: false },
                        render: name => {
                            const match = reports.find(
                                report => report.subject === name
                            )
                            const id = match["id"]
                            return (
                                <Tooltip
                                    placement='topLeft'
                                    //title={JSON.stringify(match, null, 2)}
                                    title={name}
                                >
                                    <a
                                        href={
                                            "https://admin.govdelivery.com/reports/bulletin_details/" +
                                            id
                                        }
                                    >
                                        {name}
                                    </a>
                                </Tooltip>
                            )
                        },
                    },
                    {
                        title: "Date",
                        dataIndex: "date",
                        key: "date",
                    },
                ]

                const Heading = ({ children }) => (
                    <h3
                        style={{
                            marginBottom: "1rem",
                            textAlign: "center",
                        }}
                    >
                        {children}
                    </h3>
                )
                return (
                    <Card
                        title={sender}
                        key={idx}
                        style={{ marginBottom: "1rem" }}
                    >
                        <Card.Grid style={grid_style}>
                            <Table
                                dataSource={datasource_metrics}
                                columns={metric_columns}
                                size='small'
                                pagination={false}
                            />
                        </Card.Grid>
                        <Card.Grid style={grid_style}>
                            <Heading>KPIs on Average by Rate</Heading>
                            <SelectPie summary={summary} />
                        </Card.Grid>
                        <Card.Grid style={grid_style}>
                            <Heading>KPIs on Average by Count</Heading>
                            <Bar summary={summary} />
                        </Card.Grid>
                        <Card.Grid style={grid_style}>
                            <Table
                                dataSource={data_bulletins}
                                columns={bulletin_columns}
                                size='small'
                                pagination={{
                                    position: ["bottomCenter"],
                                    simple: true,
                                    defaultPageSize: 6,
                                    showSizeChanger: false,
                                }}
                                //pagination={false}
                            />
                        </Card.Grid>
                    </Card>
                )
            })}
            <pre>{JSON.stringify(xformed, null, 2)}</pre>
        </>
    )
}
