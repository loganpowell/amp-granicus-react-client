import { tooltip_subs } from "./utils"

export const facet_lines = {
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
    },
    resolve: { axis: { x: "independent", y: "independent" } },
    spec: {
        width: "container",
        layer: [
            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "#e63946",
                    xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "deleted",
                        type: "quantitative",
                        scale: {
                            domain: [-1000, 1000],
                        },
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    tooltip: tooltip_subs,
                },
            },
            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "#00a8e8",
                    xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "subscriptions",
                        type: "quantitative",
                        scale: {
                            domain: [-1000, 1000],
                        },
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    tooltip: tooltip_subs,
                },
            },
            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "#007ea7",
                    xOffset: -2,
                },
                encoding: {
                    y: {
                        field: "upload",
                        type: "quantitative",
                        scale: {
                            domain: [-1000, 1000],
                        },
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    tooltip: tooltip_subs,
                },
            },
            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "#003459",
                },
                encoding: {
                    y: {
                        field: "network",
                        type: "quantitative",
                        scale: {
                            domain: [-1000, 1000],
                        },
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    tooltip: tooltip_subs,
                },
            },

            {
                mark: {
                    type: "bar",
                    clip: true,
                    color: "#003459",
                    xOffset: 2,
                },
                encoding: {
                    y: {
                        field: "direct",
                        type: "quantitative",
                        scale: {
                            domain: [-1000, 1000],
                        },
                    },

                    x: {
                        field: "created_at",
                        type: "temporal",
                        //timeUnit: "yearweek",
                    },
                    tooltip: tooltip_subs,
                },
            },
        ],
    },
}
