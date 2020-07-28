import GQL from "nanographql"
import fetch from "node-fetch"
import dotenv from "dotenv"
//import { listBulletins } from "../queries"
//import { log, JL, squash } from "./data"
dotenv.config()

export const GQL_URL = process.env.REACT_APP_AMP_URL
export const GQL_KEY = process.env.REACT_APP_AMP_KEY

/**
 * @example
 * grafetch({
 *     gql: listBulletins({ bulletin: { bgn: 2010, id: "3404745" } }),
 * }).then(({ data: { listBulletins: { items } } }) => squash(items)) //?
 *
 * [
 *   {
 *     "id": "33582515",
 *     "campaign_id": "20180322gssubs1ccstars",
 *     "sender_email": "anthony.j.calabrese@census.gov",
 *     "created_at": "2018-07-22T13:00:07.000Z",
 *     "subject": "How to Find What You Need on Census.gov",
 *     "delivery_status_name": "Delivered",
 *     "addresses_count": 254,
 *     "success_count": 248,
 *     "failed_count": 6,
 *     "percent_success": 97.63779527559055,
 *     "immediate_email_recipients": 254,
 *     "emails_delivered": 248,
 *     "emails_failed": 6,
 *     "percent_emails_delivered": 97.63779527559055,
 *     "opens_count": 67,
 *     "percent_opened": 27.016129032258064,
 *     "nonunique_opens_count": 124,
 *     "links_count": 22,
 *     "click_rate": 2.8225806451612905,
 *     "clicks_count": 7,
 *     "nonunique_clicks_count": 9,
 *     "digest_email_recipients": 0,
 *     "unique_click_count": 7,
 *     "total_click_count": 9,
 *     "unsubscribes": 1
 *   },
 *   ...
 * ]
 */
export const grafetch = ({
    gql = undefined,
    arg = {},
    api = GQL_URL,
    key = GQL_KEY,
}) => {
    let query = GQL(gql)
    return fetch(api, {
        method: "POST",
        headers: {
            "x-api-key": key,
            "Content-Type": "application/json",
        },
        body: query(arg),
    })
        .then(r => r.json())
        .catch(console.error)
}
