import React from "react"
import { Card, Table, Tooltip, Typography } from "antd"

import { primary_color } from "../colors"
import { Filter, SelectPie, Bar } from "../components"
import { coll_aggregator_sender, log, metric_name, averaged } from "../utils"

//import { VegaLite } from "react-vega"
//import { matrix_senders } from "../viz_specs"

const { Title } = Typography

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

//
//                            d8          ,e,
//  888-~88e-~88e  e88~~8e  _d88__ 888-~\  "   e88~~\  d88~\
//  888  888  888 d888  88b  888   888    888 d888    C888
//  888  888  888 8888__888  888   888    888 8888     Y88b
//  888  888  888 Y888    ,  888   888    888 Y888      888D
//  888  888  888  "88___/   "88_/ 888    888  "88__/ \_88P
//
//

const data_metrics = summary =>
    Object.entries(summary).reduce((a, c, i, d) => {
        const [k, v] = c
        if (
            metric_name(k).split("#").length === 1 ||
            k === "emails_sent" ||
            k === "impressions"
        ) {
            a.push({
                key: i,
                metric: metric_name(k),
                value: v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            })
        }
        return a
    }, [])

const metric_columns = [
    {
        title: "Metric",
        dataIndex: "metric",
        //responsive: ["md"],
        ellipsis: { showTitle: false },
        render: metric => {
            return (
                <Tooltip placement='topLeft' title={metric}>
                    {metric}
                </Tooltip>
            )
        },
    },
    { title: "Value", dataIndex: "value" },
]

//
//  888                888 888             d8   ,e,
//  888-~88e  888  888 888 888  e88~~8e  _d88__  "  888-~88e  d88~\
//  888  888b 888  888 888 888 d888  88b  888   888 888  888 C888
//  888  8888 888  888 888 888 8888__888  888   888 888  888  Y88b
//  888  888P 888  888 888 888 Y888    ,  888   888 888  888   888D
//  888-_88"  "88_-888 888 888  "88___/   "88_/ 888 888  888 \_88P
//
//

const data_bulletins = (reports = []) =>
    reports.map((report, key) => ({
        key,
        name: report.subject,
        date: new Date(report.created_at).toLocaleDateString(),
    }))

const bulletin_columns = reports => [
    {
        title: "Bulletin Name",
        dataIndex: "name",
        key: "name",
        //responsive: ["md"],
        ellipsis: { showTitle: false },
        render: subject => {
            const match = reports.find(report => report.subject === subject)
            const id = match["id"]
            return (
                <Tooltip
                    placement='topLeft'
                    //title={JSON.stringify(match, null, 2)}
                    title={subject}
                >
                    <a
                        href={
                            "https://admin.govdelivery.com/reports/bulletin_details/" +
                            id
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {subject}
                    </a>
                </Tooltip>
            )
        },
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
        responsive: ["lg"],
    },
]

//
//                            /
//  888-~88e    /~~~8e  e88~88e  e88~~8e
//  888  888b       88b 888 888 d888  88b
//  888  8888  e88~-888 "88_88" 8888__888
//  888  888P C888  888  /      Y888    ,
//  888-_88"   "88_-888 Cb       "88___/
//  888                  Y8""8D
//

const { Grid } = Card

const grid_style = {
    width: "25%",
    height: "22rem",
    border: "none",
    padding: "1rem",
}

export const BySender = ({ data = [] }) => {
    const xformed = coll_aggregator_sender(data)
    const average = averaged(xformed)
    return (
        <>
            <Title style={{ color: primary_color, marginTop: "1em" }}>
                By Sender
            </Title>
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
                return (
                    <Card
                        title={sender}
                        key={idx}
                        style={{ marginBottom: "1rem" }}
                    >
                        <Grid style={grid_style}>
                            <Table
                                dataSource={data_metrics(summary)}
                                columns={metric_columns}
                                size='small'
                                pagination={false}
                            />
                        </Grid>
                        <Grid style={grid_style}>
                            <Heading>KPIs (Avg. %)</Heading>
                            <SelectPie summary={summary} averages={average} />
                        </Grid>
                        <Grid style={grid_style}>
                            <Heading>KPIs (Avg. #)</Heading>
                            <Bar summary={summary} />
                        </Grid>
                        <Grid style={grid_style}>
                            <Table
                                dataSource={data_bulletins(reports)}
                                columns={bulletin_columns(reports)}
                                size='small'
                                pagination={{
                                    position: ["bottomCenter"],
                                    simple: true,
                                    defaultPageSize: 6,
                                    showSizeChanger: false,
                                }}
                                //pagination={false}
                            />
                        </Grid>
                    </Card>
                )
            })}
            {/*<pre>{JSON.stringify(average, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(xformed, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
        </>
    )
}
