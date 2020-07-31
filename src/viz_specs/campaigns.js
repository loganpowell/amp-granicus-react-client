import { tooltip_topics, time_axis } from "./utils"

export const matrix_campaign = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: {
        name: "data",
    },
    //transform: [
    //    {
    //        joinaggregate: [
    //            { op: "median", field: "engagement_rate", as: "Engagement" },
    //        ],
    //        //"groupby": ["Origin"]
    //    },
    //],
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
            /*
            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "#e63946",
                    //xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "unsubscribe_rate",
                        type: "quantitative",
                        scale: {
                            domain: [0, 0.02],
                        },
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    tooltip: tooltip_topics,
                    //tooltip: [
                    //    { field: "unsubscribe_rate", type: "quantitative" },
                    //    { field: "created_at", type: "temporal" },
                    //    { field: "subject", type: "nominal" },
                    //],
                },
            },

            {
                layer: [
                    {
                        mark: {
                            type: "bar",
                            clip: true,
                            color: "#00a8e8",
                            //xOffset: -2,
                        },
                        encoding: {
                            y: {
                                field: "percent_opened",
                                type: "quantitative",
                                scale: {
                                    domain: [0, 100],
                                },
                            },

                            x: {
                                field: "created_at",
                                type: "temporal",
                            },
                            //color: {
                            //    field: "emails_delivered",
                            //    scale: { scheme: "magma", type: "quantile" },
                            //    sort: "descending", // invert the color scheme
                            //},
                            tooltip: tooltip_topics,
                        },
                    },
                    {
                        mark: {
                            type: "bar",
                            clip: true,
                            color: "#003459",
                            //xOffset: -2,
                        },
                        encoding: {
                            y: {
                                field: "click_rate",
                                type: "quantitative",
                                scale: {
                                    domain: [0, 100],
                                },
                            },

                            x: {
                                field: "created_at",
                                type: "temporal",
                                //timeUnit: "yearweek",
                            },
                            //color: {
                            //    field: "emails_delivered",
                            //    scale: { scheme: "magma", type: "quantile" },
                            //    sort: "descending", // invert the color scheme
                            //},
                            tooltip: tooltip_topics,
                        },
                    },
                ],
            },
            */
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
