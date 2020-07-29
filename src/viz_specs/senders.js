import { tooltip_senders } from "./utils"

export const matrix_senders = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: {
        name: "data",
    },
    facet: {
        row: { field: "sender_email", type: "nominal" },
    },
    config: {
        bar: { width: 2 },
        //axisY: { style: "" },
    },
    //resolve: { axis: { x: "independent", y: "independent" } },
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
                        field: "unsubscribes",
                        type: "quantitative",
                        //scale: {
                        //    domain: [0, 500],
                        //},
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    tooltip: tooltip_senders,
                },
            },
            {
                mark: {
                    type: "bar",
                    clip: true,
                    //color: "#00a8e8",
                    //xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "engagement_rate",
                        type: "quantitative",
                        //scale: {
                        //    domain: [0, 1],
                        //},
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    color: {
                        field: "emails_delivered",
                        scale: { scheme: "magma", type: "quantile" },
                        sort: "descending", // invert the color scheme
                    },
                    tooltip: tooltip_senders,
                },
            },
            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "black",
                    //xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "opens_count",
                        type: "quantitative",
                        //scale: {
                        //    domain: [0, 1],
                        //},
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
                    tooltip: tooltip_senders,
                },
            },
            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "black",
                    //xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "click_rate",
                        type: "quantitative",
                        //scale: {
                        //    domain: [0, 1],
                        //},
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
                    tooltip: tooltip_senders,
                },
            },
        ],
    },
}
