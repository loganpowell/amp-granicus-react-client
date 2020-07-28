export const punchcard = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: {
        name: "data",
    },
    // when using the `repeat` convention, must wrap the spec for each graph within a `spec`
    //repeat: {
    //    row: ["opens_count", "total_click_count", "unsubscribes"],
    //    column: ["days_gap", "subject_length", "emails_delivered"]
    //}, spec: { mark, encoding, etc. }
    mark: {
        // can also just assign as string: "point" instead of object syntax
        type: "circle",
        // tooltip based on encoding
        tooltip: true,

        //clip: true
    },
    //height: 300,
    width: 500,
    encoding: {
        color: {
            field: "emails_delivered",
            type: "quantitative",
            scale: { scheme: "magma" }, //<- 🎨: https://vega.github.io/vega/docs/schemes/
            sort: "descending", // invert the color scheme
            aggregate: "sum",
        },
        size: {
            field: "engagement_rate",
            type: "quantitative",
            aggregate: "median",
        },

        y: {
            field: "created_at",
            type: "ordinal",
            timeUnit: "day",
            sort: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        },
        x: { field: "created_at", type: "ordinal", timeUnit: "hours" },
    },
    config: {
        // customize mark
        style: {
            circle: {
                color: "black",
            },
        },
    },
}
