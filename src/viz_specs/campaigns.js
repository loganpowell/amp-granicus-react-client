import { tooltip_topics, time_axis } from "./utils"
import {
    primary_color,
    secondary_color,
    accent_color,
    muted_color,
} from "../colors"
export const matrix_campaign = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: {
        name: "data",
    },
    facet: {
        row: {
            //sort: {
            //    // 🚀 : https://github.com/vega/vega-lite/pull/3854#issuecomment-394954455
            //    op: "median",
            //    field: "engagement_rate",
            //    order: "descending",
            //},
            field: "campaign_id",
            type: "nominal",
            title: null,
            header: {
                labelOrient: "top",
                labelAlign: "left",
                labelFontSize: 14,
                labelPadding: 15,
                //labelAngle: -90,
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
                width: 500,
                height: 15,
                layer: [
                    {
                        mark: {
                            type: "rect",
                            color: muted_color,

                            clip: true,
                        },

                        encoding: {
                            x: {
                                field: "percent_success",
                                aggregate: "mean",
                                scale: {
                                    domain: [0, 100],
                                },
                                title:
                                    "Clicked | Opened | Delivered | Engaged (Ave. %)",
                            },
                            tooltip: [
                                // has to be an array...
                                {
                                    field: "percent_success",
                                    type: "quantitative",
                                    title: "Delivered (Ave. %)",
                                },
                            ],
                        },
                    },
                    {
                        mark: {
                            type: "rect",
                            color: secondary_color,
                            //tooltip: true,
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
                            tooltip: [
                                {
                                    field: "percent_opened",
                                    type: "quantitative",
                                    title: "Opened (Ave. %)",
                                },
                            ],
                        },
                    },
                    {
                        mark: {
                            type: "rect",
                            color: primary_color,
                            //tooltip: true,
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
                            tooltip: [
                                {
                                    field: "click_rate",
                                    type: "quantitative",
                                    title: "Clicked (Ave. %)",
                                },
                            ],
                        },
                    },
                    {
                        mark: {
                            type: "tick",
                            color: accent_color,
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
                            //tooltip: [ // BUG 🐛
                            //    {
                            //        field: "engagement_rate",
                            //        type: "quantitative",
                            //        title: "Engaged (Ave. %)",
                            //    },
                            //],
                        },
                    },
                ],
            },
        ],
    },
}
