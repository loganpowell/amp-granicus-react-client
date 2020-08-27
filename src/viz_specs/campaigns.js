import { tooltip_topics, time_axis } from "./utils"

export const matrix_campaign = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: {
        name: "data",
    },
    facet: {
        row: {
            sort: {
                // 🚀 : https://github.com/vega/vega-lite/pull/3854#issuecomment-394954455
                op: "median",
                field: "engagement_rate",
                order: "descending",
            },
            field: "campaign_id",
            type: "nominal",
            header: {
                title: null,
                labelOrient: "top",
                labelAlign: "center",
                labelFontSize: 12,
            },
        },
    },
    config: {
        lineBreak: ":",
        bar: { width: 2 },
        //axisY: { maxExtent: 20 },
        axisTemporal: time_axis,
        tick: { thickness: 4, bandSize: 22 },
    },
    resolve: { axis: { x: "independent", y: "independent" } },
    spec: {
        width: "container",

        hconcat: [
            {
                width: 800,
                layer: [
                    {
                        mark: {
                            type: "rect",
                            color: "#eee",
                            tooltip: true,
                            clip: true,
                        },

                        encoding: {
                            x: {
                                field: "percent_success",
                                aggregate: "mean",
                                scale: {
                                    domain: [0, 100],
                                },
                            },
                        },
                    },
                    {
                        mark: {
                            type: "rect",
                            color: "#ddd",
                            tooltip: true,
                            clip: true,
                        },
                        encoding: {
                            x: {
                                field: "percent_opened",
                                aggregate: "mean",
                                scale: {
                                    domain: [0, 100],
                                },
                            },
                        },
                    },
                    {
                        mark: {
                            type: "rect",
                            color: "#ccc",
                            tooltip: true,
                            clip: true,
                        },
                        encoding: {
                            x: {
                                field: "click_rate",
                                aggregate: "mean",
                                scale: {
                                    domain: [0, 100],
                                },
                            },
                        },
                    },
                    {
                        mark: {
                            type: "tick",
                            color: "#e63946",
                            tooltip: true,
                            clip: true,
                        },
                        encoding: {
                            x: {
                                field: "engagement_rate",
                                aggregate: "mean",
                                scale: {
                                    domain: [0, 100],
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
}
