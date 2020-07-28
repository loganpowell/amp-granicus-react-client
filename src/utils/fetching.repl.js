import GQL from "nanographql"
import fetch from "node-fetch"
import {
    listBulletins,
    listSenders,
    listCampaigns,
    listSubs,
    listTopics,
} from "../queries"
import { log, JL, squash } from "./data"
import { grafetch } from "./fetching"

// TODO: move to router.js

/**
 * format:
 * { data: { listBulletins: { items: [{}, ...] } } }
 */
grafetch({
    gql: listBulletins({ bulletin: { bgn: 2010, id: "3404745" } }),
}).then(({ data: { listBulletins: { items } } }) => squash(items))
//.then(JL)

/**
 * format (hence flatMap)
 *    {
 *        data: {
 *            listSenders: {
 *                items: [
 *                    {
 *                        bulletins: {
 *                            items: [{}, ...]
 *                        }
 *                    },
 *                    ...
 *                ]
 *            }
 *        }
 *    }
 */

grafetch({
    gql: listSenders({
        sender: { id: ["logan", "mary"], limit: 1000 },
        bulletin: { limit: 100, sort: "DESC" },
    }),
}).then(({ data: { listSenders: { items } } }) =>
    items.flatMap(({ bulletins: { items } }) => squash(items))
)
//.then(JL)

grafetch({
    gql: listCampaigns({
        campaign: { id: ["v1", "cc"], limit: 1000 },
        bulletin: { limit: 100, sort: "DESC", sender: "anthony" },
    }),
}).then(({ data: { listCampaigns: { items } } }) =>
    items.flatMap(({ bulletins: { items } }) => squash(items))
)
//.then(JL) //?

grafetch({
    gql: listSubs({
        topic: { name: ["Counts", "API"], limit: 1000 },
        bulletin: { bgn: "2019-10", end: "2021", limit: 100 },
    }),
}).then(({ data: { listTopics: { items } } }) =>
    items.flatMap(({ bulletins: { items } }) => squash(items))
)
//.then(JL) //?

// here, since we can't access topic attrs in bulletin, we
// merge them in before squashing
grafetch({
    gql: listTopics({
        topic: { name: "API", limit: 1000 },
        bulletin: { bgn: "2019-10", end: "2021", limit: 100 },
    }),
})
    .then(({ data: { listTopics: { items } } }) =>
        items.flatMap(({ code, name, id, bulletins: { items } }) =>
            squash(items.map(item => ({ topic_id: id, name, code, ...item })))
        )
    )
    .then(JL) //?
