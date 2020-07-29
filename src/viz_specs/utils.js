import dayjs from "dayjs"

// prettier-ignore
export const tooltip_bulletins = [
    { field: "created_at",        type: "temporal" },
    { field: "subject",           type: "nominal" },
    { field: "name",              type: "nominal" },
    { field: "sender_email",      type: "nominal" },
    { field: "emails_delivered",  type: "quantitative" },
    { field: "unsubscribes",      type: "quantitative" },
    { field: "total_click_count", type: "quantitative" },
    { field: "percent_opened",    type: "quantitative" },
    { field: "click_rate",        type: "quantitative" },
    { field: "engagement_rate",   type: "quantitative" },
    { field: "days_gap",          type: "quantitative" },
    { field: "bulletin_id",       type: "nominal" },
    { field: "campaign_id",       type: "nominal" },
    { field: "topic_id",          type: "nominal" },
]

// prettier-ignore
export const tooltip_subs = [
    { field: "bulletins_sent",              type: "quantitative" },
    { field: "new_topic_subscriptions",     type: "quantitative" },
    { field: "subscriptions",               type: "quantitative" },
    { field: "network",                     type: "quantitative" },
    { field: "direct",                      type: "quantitative" },
    { field: "deleted",                     type: "quantitative" },
    { field: "upload",                      type: "quantitative" },
    { field: "overlay",                     type: "quantitative" },
    { field: "signup",                      type: "quantitative" },
    { field: "other",                       type: "quantitative" },
    { field: "topic_id",                    type: "quantitative" },
    { field: "id",                          type: "nominal" },
    { field: "code",                        type: "nominal" },
    { field: "name",                        type: "nominal" },
    { field: "created_at",                  type: "temporal" },
    { field: "total_subscriptions",         type: "quantitative" },
]

export const tooltip_senders = [
    { field: "days_gap", type: "quantitative" },
    { field: "created_at", type: "temporal" },
    { field: "id", type: "nominal" },
    { field: "campaign_id", type: "nominal" },
    { field: "sender_email", type: "nominal" },
    { field: "subject", type: "nominal" },
    { field: "delivery_status_name", type: "nominal" },
    { field: "addresses_count", type: "quantitative" },
    { field: "success_count", type: "quantitative" },
    { field: "failed_count", type: "quantitative" },
    { field: "percent_success", type: "quantitative" },
    { field: "immediate_email_recipients", type: "quantitative" },
    { field: "emails_delivered", type: "quantitative" },
    { field: "emails_failed", type: "quantitative" },
    { field: "percent_emails_delivered", type: "quantitative" },
    { field: "opens_count", type: "quantitative" },
    { field: "percent_opened", type: "quantitative" },
    { field: "nonunique_opens_count", type: "quantitative" },
    { field: "links_count", type: "quantitative" },
    { field: "click_rate", type: "quantitative" },
    { field: "clicks_count", type: "quantitative" },
    { field: "nonunique_clicks_count", type: "quantitative" },
    { field: "digest_email_recipients", type: "quantitative" },
    { field: "unique_click_count", type: "quantitative" },
    { field: "total_click_count", type: "quantitative" },
    { field: "unsubscribes", type: "quantitative" },
    { field: "engagement_rate", type: "quantitative" },
    { field: "subject_chars", type: "quantitative" },
]
/*
    "days_gap": null,
    "created_at": "2020-07-28T19:00:17.000Z",
    "id": "43499216",
    "campaign_id": "20200518wcdecs1ccdtars",
    "sender_email": "anthony.j.calabrese@census.gov",
    "subject": "Welcome to the 2020 Census Data Products Newsletter",
    "delivery_status_name": "Succeeded",
    "addresses_count": 1,
    "success_count": 1,
    "failed_count": 0,
    "percent_success": 100,
    "immediate_email_recipients": 1,
    "emails_delivered": 1,
    "emails_failed": 0,
    "percent_emails_delivered": 100,
    "opens_count": 1,
    "percent_opened": 100,
    "nonunique_opens_count": 1,
    "links_count": 14,
    "click_rate": 100,
    "clicks_count": 1,
    "nonunique_clicks_count": 1,
    "digest_email_recipients": 0,
    "unique_click_count": 1,
    "total_click_count": 1,
    "unsubscribes": 0,
    "engagement_rate": 2,
    "subject_chars": 51
*/

export const date_range_filter = (days = 360, past = 0) => {
    const nom = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    const now = dayjs()
    const end = now.subtract(past, "day")
    const beg = end.subtract(days, "day")
    return [
        { year: beg.year(), month: nom[beg.month()], date: beg.date() },
        { year: end.year(), month: nom[end.month()], date: end.date() },
    ]
}
