import { tooltip_topics, time_axis } from "./utils"
import { primary_color, secondary_color, accent_color } from "../colors"

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
                title: "Unsubscribe Rate",
                mark: {
                    type: "bar",
                    clip: true,
                    color: accent_color,
                    //xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "unsubscribe_rate",
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
                    tooltip: tooltip_topics,
                    //tooltip: [
                    //    { field: "unsubscribe_rate", type: "quantitative" },
                    //    { field: "created_at", type: "temporal" },
                    //    { field: "subject", type: "nominal" },
                    //],
                },
            },

            {
                title: "Percent Opened | Click Rate",
                layer: [
                    {
                        mark: {
                            type: "bar",
                            clip: true,
                            color: secondary_color,
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
                            color: primary_color,
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
            {
                title: "Punchcard",
                mark: {
                    type: "rect",
                    tooltip: true,

                    //type: "circle",
                    //clip: true,
                    //color: "black",
                    //xOffset: -2,
                    //stroke: "transparent",
                },
                width: 300,
                height: 200,
                encoding: {
                    //column: {
                    //    field: "Punchcard",
                    //    header: {
                    //        titleFontSize: 15,
                    //        titleLineHeight: 20,
                    //        labelFontSize: 0,
                    //    },
                    //},
                    color: {
                        field: "engagement_rate",
                        type: "quantitative",
                        scale: { scheme: "magma", domain: [0, 100] }, //<- 🎨: https://vega.github.io/vega/docs/schemes/
                        sort: "descending", // invert the color scheme
                        aggregate: "mean",
                    },
                    //color: {
                    //    field: "emails_delivered",
                    //    type: "quantitative",
                    //    scale: { scheme: "magma" }, //<- 🎨: https://vega.github.io/vega/docs/schemes/
                    //    sort: "descending", // invert the color scheme
                    //    aggregate: "sum",
                    //},
                    //size: {
                    //    field: "engagement_rate",
                    //    type: "quantitative",
                    //    aggregate: "median",
                    //    scale: { zero: false },
                    //},

                    y: {
                        field: "created_at",
                        type: "ordinal",
                        timeUnit: "day",
                        sort: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                        axis: { title: "day of week" },
                        //bin: { maxbins: 7 },
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
                        //bin: { maxbins: 24 },

                        timeUnit: "hours",
                        axis: {
                            title: "time sent (24hr ET)",
                            format: "%H", // { labels: "%H" },
                        },
                        scale: {
                            domain: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                10,
                                11,
                                12,
                                13,
                                14,
                                15,
                                16,
                                17,
                                18,
                                19,
                                20,
                                21,
                                22,
                                23,
                                24,
                            ],
                        },
                    },
                },
            },
        ],
    },
}
