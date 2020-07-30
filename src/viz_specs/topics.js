import { tooltip_topics, time_axis } from "./utils"

export const matrix_topics = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: {
        name: "data",
    },
    facet: {
        row: { field: "name", type: "nominal" },
    },
    config: {
        lineBreak: ":",
        bar: { width: 2 },
        //axisY: { maxExtent: 20 },
        axisTemporal: time_axis,
    },
    resolve: { axis: { x: "independent", y: "independent" } },
    spec: {
        width: "container",

        hconcat: [
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
                                    domain: [0, 2],
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
            {
                mark: {
                    type: "circle",
                    //clip: true,
                    color: "black",
                    //xOffset: -2,
                },
                width: 300,
                height: 200,
                encoding: {
                    color: {
                        field: "emails_delivered",
                        type: "quantitative",
                        scale: { scheme: "magma" }, //<- 🎨: https://vega.github.io/vega/docs/schemes/
                        sort: "descending", // invert the color scheme
                        aggregate: "median",
                    },
                    size: {
                        field: "engagement_rate",
                        type: "quantitative",
                        aggregate: "median",
                        scale: { domain: [0, 1] },
                    },

                    y: {
                        field: "created_at",
                        type: "ordinal",
                        timeUnit: "day",
                        sort: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                        axis: { title: "day of week" },
                        scale: {
                            domain: [
                                "mon",
                                "tue",
                                "wed",
                                "thu",
                                "fri",
                                "sat",
                                "sun",
                            ],
                        },
                    },
                    x: {
                        field: "created_at",
                        type: "ordinal",
                        timeUnit: "hours",
                        axis: {
                            title: "time sent (ET: 24hr)",
                            format: "%H", // { labels: "%H" },
                        },
                    },
                    tooltip: tooltip_topics,
                },
            },
        ],
    },
}
