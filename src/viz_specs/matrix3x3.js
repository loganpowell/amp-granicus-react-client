import {
    tooltip_bulletins,
    //date_range_filter
} from "./utils"

export const matrix3x3 = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    usermeta: { embedOptions: { renderer: "svg" } },
    data: { name: "data" }, // react-vega note: vega-lite data attribute is a plain object instead of an array
    repeat: {
        row: ["opens_count", "total_click_count", "unsubscribes"],
        column: ["failed_count", "links_count", "emails_delivered"],
    },
    // when using the `repeat` convention, must wrap the spec for each graph within a `spec`
    spec: {
        mark: {
            // can also just assign as string: "point" instead of object syntax
            type: "point",
            // tooltip based on encoding
            //tooltip: true

            //clip: true
        },
        height: 300,
        width: 300,

        // type options: "quantitative" = int/float, "temporal" = timestamp, "ordinal" = sm, md, lg, "nominal" = Logan, William
        encoding: {
            color: {
                //field: "sender_email",
                //type: "temporal",

                //bin: true,
                condition: {
                    selection: "picked",
                    field: "percent_opened",
                    type: "quantitative",
                    scale: { scheme: "magma", type: "quantile" }, //<- 🎨: https://vega.github.io/vega/docs/schemes/
                    sort: "descending", // invert the color scheme
                    //bin: { maxbins: 10 },
                },
                value: "lightgrey",
            },
            size: {
                field: "opens_count",
                type: "quantitative",
                //bin: true,
                //scale: {
                //    type: "quantile",
                //    //domain: [0, 100000]
                //}
            },
            //detail: {
            //    field: "created_at",
            //    type: "temporal",
            //},
            // clickables!
            href: { field: "url", type: "nominal" },
            // single field tooltip
            //tooltip: { field: "subject", type: "nominal" },

            // multi-field tooltip
            tooltip: tooltip_bulletins,
            // scale not suited to `repeat`ed visualizations unless all the same range
            y: {
                field: { repeat: "row" },
                type: "quantitative",
                //scale: {
                //    /* domain: [10, 160], zero: false */
                //},
            },
            x: {
                field: { repeat: "column" },
                type: "quantitative",
            },
        },
        selection: {
            // all the results that have the same field value are highlighted
            picked: {
                type: "single",
                on: "mouseover",
                //nearest: true
            },
            //brush: { type: "interval" }
        },

        // TODO: Add filters as URL params (e.g., s = subject rang, o = opens range, d, c)
        transform: [
            // removes data from the target field
            //{ filter: { field: "days_gap", range: [0, 30] } },
            //{ filter: { field: "opens_count", range: [100, 400000] } },
            //{ filter: { field: "subject_length", range: [0, 200] } },
            //{
            //    filter: {
            //        field: "created_at",
            //        // consider date picker
            //        range: date_range_filter(days, past), // FIXME: build into data
            //        //[
            //        //    { "year": new Date().getFullYear() - 3, "month": "december", "date": 31 },
            //        //    { "year": new Date().getFullYear() - 0, "month": "december", "date": 31 }
            //        //]
            //    },
            //},
            /**
             * TODO: lambda that exposes a url that takes an id and returns the
             * content.govdelivery for the view:
             * 1. fetch: https://api.govdelivery.com/api/account/USCENSUS/bulletins/sent.xml?start_at=${bulletin_id}
             * 2. convert XML -> JSON (or just use XML if #3 is not hard)
             * 3. pull out the first item from the response (public id)
             * 4. redirect the user to https://content.govdelivery.com/accounts/USCENSUS/bulletins/${public id}
             *
             * 56d553 <- working ID
             */
            {
                // absolute links
                //calculate: "'https://content.govdelivery.com/accounts/USCENSUS/bulletins/' + datum.bulletin_id",
                // use router | relative links
                calculate: "'./bulletin/' + datum.bulletin_id",
                as: "url",
            },

            // UI
            //{ filter: { selection: "brush" } } // removes data by interaction with the UI
        ],
    },
}
