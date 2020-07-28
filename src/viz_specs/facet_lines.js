export const facet_lines = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: {
        name: "data",
    },
    // when using the `repeat` convention, must wrap the spec for each graph within a `spec`
    //repeat: {
    //row: ["opens_count", "total_click_count", "unsubscribes"],
    //column: ["days_gap", "subject_length", "emails_delivered"]
    //},
    //spec: { mark, encoding, etc. }

    //height: 300,
    //width: "container",
    facet: { row: { field: "name" } },
    legend: { columns: 2 },
    spec: {
        mark: {
            // can also just assign as string: "point" instead of object syntax
            type: "area",
            // tooltip based on encoding
            tooltip: true,
            //interpolate: "monotone",
            clip: true,
        },
        encoding: {
            y: {
                //field: "created_at",
                //type: "ordinal",
                //timeUnit: "day",
                //sort: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                field: "allocated_new_subscriptions",
                //aggregate: "allocated_direct",
                type: "quantitative",
                scale: {
                    domain: [0, 2000],
                },
            },
            x: {
                field: "created_at",
                type: "ordinal",
                timeUnit: "yearmonth",
            },
            //order: {
            //    field: "created_at",
            //    type: "temporal",
            //},
            //color: {
            //    field: "name",
            //    type: "nominal",
            //    //scale: { scheme: "magma" }, //<- 🎨: https://vega.github.io/vega/docs/schemes/
            //    //sort: "descending", // invert the color scheme
            //    //aggregate: "sum",
            //},
            //size: {
            //    field: "engagement_rate",
            //    type: "quantitative",
            //    aggregate: "median",
            //},
        },
        //config: {
        //    // customize mark
        //    style: {
        //        circle: {
        //            color: "black",
        //        },
        //    },
        //},
    },
}
