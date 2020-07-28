import { jsonToGraphQLQuery as jq, EnumType } from "json-to-graphql-query"
import { isEmpty, log, json, JL, grafetch, squash, squish } from "../utils"
import { isArray, isPlainObject } from "@thi.ng/checks"
import { getIn } from "@thi.ng/paths"

const __bulletin = {
    id: true,
    campaign_id: true,
    sender_email: true,
    created_at: true,
    detail: {
        subject: true,
        delivery_status_name: true,
        addresses_count: true,
        success_count: true,
        failed_count: true,
        percent_success: true,
        immediate_email_recipients: true,
        emails_delivered: true,
        emails_failed: true,
        percent_emails_delivered: true,
        opens_count: true,
        percent_opened: true,
        nonunique_opens_count: true,
        links_count: true,
        click_rate: true,
        clicks_count: true,
        nonunique_clicks_count: true,
        digest_email_recipients: true,
        unique_click_count: true,
        total_click_count: true,
        unsubscribes: true,
    },
    //topics: {
    //    items: {
    //        topic: {
    //            id: true,
    //            code: true,
    //            name: true,
    //            description: true,
    //        },
    //    },
    //},
    //links: {
    //    id: true,
    //    link_url: true,
    //    unique_click_count: true,
    //    total_click_count: true,
    //},
}

export const E = {
    DESC: new EnumType("DESC"),
    ASC: new EnumType("ASC"),
}

//
//                         /
//    /~~~8e  888-~\ e88~88e  d88~\
//        88b 888    888 888 C888
//   e88~-888 888    "88_88"  Y88b
//  C888  888 888     /        888D
//   "88_-888 888    Cb      \_88P
//                    Y8""8D
//

/**
 * exhaustive collection of all supported filter arguments
 * to be used either individually or run through as
 */
export const args = {
    name: ({ name }) => {
        // handle array args
        const mult = isArray(name)

        // will return an empty object if no name arg
        const filter = {
            ...(name && { name: { contains: name } }),
        }
        // will return an array to be merged as an 'or'
        const filter_array =
            (mult && name.map(n => ({ name: { contains: n } }))) || []

        return name && mult ? filter_array : name ? filter : {}
    },
    code: ({ code }) => {
        const mult = isArray(code)
        const filter = {
            ...(code && { code: { eq: code } }),
        }
        const filter_array =
            (mult && code.map(n => ({ code: { eq: n } }))) || []
        return code && mult ? filter_array : code ? filter : {}
    },
    id: ({ id }) => {
        const mult = isArray(id)
        const filter = {
            ...(id && { id: { contains: id } }),
        }
        const filter_array =
            (mult && id.map(n => ({ id: { contains: n } }))) || []
        return id && mult ? filter_array : id ? filter : {}
    },
    dates: ({ bgn, end }) => {
        bgn = bgn ? bgn.toString() : undefined
        end = end ? end.toString() : undefined
        const date = {
            created_at:
                bgn && end
                    ? { between: [bgn, end] }
                    : bgn
                    ? { gt: bgn }
                    : end
                    ? { eq: end }
                    : null,
        }

        return {
            ...(date.created_at && date),
        }
    },
    sender: ({ sender }) => {
        const mult = isArray(sender)
        const filter = {
            ...(sender && { sender_email: { contains: sender } }),
        }
        const filter_array =
            (mult && sender.map(n => ({ sender_email: { contains: n } }))) || []
        return sender && mult ? filter_array : sender ? filter : {}
    },
    camp: ({ camp }) => {
        const mult = isArray(camp)
        const filter = {
            ...(camp && { campaign_id: { contains: camp } }),
        }
        const filter_array =
            (mult && camp.map(n => ({ campaign_id: { contains: n } }))) || []
        return camp && mult ? filter_array : camp ? filter : {}
    },
}

/**
 *
 * @example
 * gen_args({
 *     name: ["logan", "william"],
 *     sender: "mary",
 *     camp: ["mspio", "x"],
 * })
 * // => {
 *   "filter": {
 *     "or": [
 *       {
 *         "name": {
 *           "contains": "logan"
 *         }
 *       },
 *       {
 *         "name": {
 *           "contains": "william"
 *         }
 *       },
 *       {
 *         "sender_email": {
 *           "contains": "mary"
 *         }
 *       },
 *       {
 *         "campaign_id": {
 *           "contains": "mspio"
 *         }
 *       },
 *       {
 *         "campaign_id": {
 *           "contains": "x"
 *         }
 *       }
 *     ]
 *   }
 * }
 *
 * gen_args({ sender: "mary" })
 * //=> {
 *   "filter": {
 *     "sender_email": {
 *       "contains": "mary"
 *     }
 *   }
 * }
 *
 * gen_args({ sender: "mary", camp: "mspio" })
 * //=> {
 *   "filter": {
 *     "or": [
 *       {
 *         "sender_email": {
 *           "contains": "mary"
 *         }
 *       },
 *       {
 *         "campaign_id": {
 *           "contains": "mspio"
 *         }
 *       }
 *     ]
 *   }
 * }
 */
export const gen_args = params => {
    const { limit, sort } = params
    const _limit = ({ limit }) => {
        // all params from qs (URL) come back as strings
        return limit ? { limit: parseInt(limit) } : {}
    }
    const _sort = ({ sort }) => {
        return sort && sort === "DESC"
            ? { sortDirection: E.DESC }
            : sort && sort === "ASC"
            ? { sortDirection: E.ASC }
            : {}
    }

    const run = Object.values(args)
    const filters = [
        ...run.map(fn => {
            return fn(params)
        }),
    ]

    const cleaned = filters.filter(x => !isEmpty(x))
    const someArrays = cleaned.some(isArray)
    const prep = {
        ...(cleaned.length && { filter: {} }),
        ...(limit && _limit({ limit })),
        ...(sort && _sort({ sort })),
    }
    const num = cleaned.length

    let coll = someArrays || num > 1 ? [] : {}

    cleaned.forEach(xs => {
        //log({ xs })
        if (isArray(xs) && isArray(coll)) {
            xs.forEach(x => coll.push(x))
        } else if (isPlainObject(xs) && isArray(coll)) {
            coll.push(xs)
        } else coll = xs
    })

    const out = {
        ...prep,
        ...(!isEmpty(coll) && {
            filter: isPlainObject(coll) ? coll : { or: coll },
        }),
    }

    return out
}

//
//  888 ,e,          d8   ,d88~~\          888
//  888  "   d88~\ _d88__ 8888    888  888 888-~88e   d88~\
//  888 888 C888    888   `Y88b   888  888 888  888b C888
//  888 888  Y88b   888    `Y88b, 888  888 888  8888  Y88b
//  888 888   888D  888      8888 888  888 888  888P   888D
//  888 888 \_88P   "88_/ \__88P' "88_-888 888-_88"  \_88P
//
//

const subs = ({ topic, bulletin }) => ({
    query: {
        listTopics: {
            __args: topic,
            items: {
                bulletins: {
                    __args: bulletin,
                    items: {
                        topic_id: true,
                        topic: {
                            id: true,
                            code: true,
                            name: true,
                            //description: true,
                        },
                        //bulletin_id: true,
                        //bulletin: {
                        //    detail: {
                        //        subject: true,
                        //    },
                        //},
                        created_at: true,
                        to_date: {
                            total_subscriptions: true,
                            //    bulletins_sent: true,
                            //    deleted_subscriptions: true,
                            //    new_subscriptions: true,
                        },
                        this_period: {
                            bulletins_sent: true,
                            deleted_subscriptions: true,
                            new_subscriptions: true,
                            allocated: {
                                direct: true,
                                overlay: true,
                                signup: true,
                                upload: true,
                                other: true,
                                all_network: true,
                            },
                        },
                    },
                },
            },
        },
    },
})

/**
 * @example
 *
 * listSubs({
 *    bulletin: { bgn: 2018, end: "2020" },
 *    topic: {
 *        name: ["Counts", "API"],
 *        code: "USCENSUS_11893",
 *    },
 * })
 *
 * //:
 * query {
 *     listTopics (
 *          filter: {
 *              or: [
 *                  {name: {contains: "Counts"}},
 *                  {name: {contains: "API"}},
 *                  {code: {eq: "USCENSUS_11893"}}
 *              ]
 *          },
 *          limit: 100
 *      ) {
 *         items {
 *             id
 *             code
 *             name
 *             description
 *             bulletins (
 *                  filter: {
 *                      created_at: {between: ["2018", "2020"]}
 *                  },
 *                  limit: 100,
 *                  sortDirection: DESC
 *              ) {
 *                 items {
 *                     created_at
 *                     to_date {
 *                         total_subscriptions
 *                         new_subscriptions
 *                         deleted_subscriptions
 *                         bulletins_sent
 *                     }
 *                     this_period {
 *                         total_subscriptions
 *                         new_subscriptions
 *                         deleted_subscriptions
 *                         bulletins_sent
 *                         allocated {
 *                             direct
 *                             overlay
 *                             signup
 *                             upload
 *                             other
 *                         }
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 */
export const listSubs = ({
    topic: {
        name = undefined,
        code = undefined,
        id = undefined,
        limit: t_limit = 100,
    },
    bulletin: {
        bgn = undefined,
        end = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    jq(
        subs({
            topic: gen_args({ name, code, id, limit: t_limit }),
            bulletin: gen_args({ bgn, end, limit: b_limit, sort }),
        }),
        { pretty: true }
    )

//listSubs({
//    bulletin: { bgn: 2018, end: "2020" },
//    topic: {
//        name: ["Counts", "API"],
//        code: "USCENSUS_11893",
//    },
//}) //?
export const fetchSubs = ({
    topic: {
        name = undefined,
        code = undefined,
        id = undefined,
        limit: t_limit = 100,
    },
    bulletin: {
        bgn = undefined,
        end = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    grafetch({
        gql: listSubs({
            topic: {
                name,
                code,
                id,
                limit: t_limit,
            },
            bulletin: {
                bgn,
                end,
                limit: b_limit,
                sort,
            },
        }),
    }).then(
        ({
            data: {
                listTopics: { items },
            },
        }) => {
            const flat = items.flatMap(({ bulletins: { items } }) => {
                //log({ items })
                return squish(items)
            })
            //log({ flat })
            return flat
        }
        //.sort(
        //    (pre, cur) =>
        //        new Date(cur.created_at).getTime() -
        //        new Date(pre.created_at).getTime()
        //)
    )

//
//    d8                      ,e,
//  _d88__  e88~-_  888-~88e   "   e88~~\  d88~\
//   888   d888   i 888  888b 888 d888    C888
//   888   8888   | 888  8888 888 8888     Y88b
//   888   Y888   ' 888  888P 888 Y888      888D
//   "88_/  "88_-~  888-_88"  888  "88__/ \_88P
//                  888
//

const topics = ({ topic, bulletin }) => ({
    query: {
        listTopics: {
            __args: topic,
            items: {
                id: true,
                code: true,
                name: true,
                //description: true,
                bulletins: {
                    __args: bulletin,
                    items: {
                        bulletin: __bulletin,
                    },
                },
            },
        },
    },
})

/**
 *
 * @example
 *
 * listTopics({
 *    bulletin: { bgn: 2018, end: "2020" },
 *    topic: {
 *        name: ["Counts", "API"],
 *        code: "USCENSUS_11893",
 *    },
 * })
 *
 * //:
 * query {
 *     listTopics (
 *         filter: {
 *             or: [
 *                 {name: {contains: "Counts"}},
 *                 {name: {contains: "API"}},
 *                 {code: {eq: "USCENSUS_11893"}}
 *             ]
 *         },
 *         limit: 100
 *     ) {
 *         items {
 *             id
 *             code
 *             name
 *             description
 *             bulletins (
 *                 filter: {
 *                     created_at: {between: ["2018", "2020"]}
 *                 },
 *                 limit: 100,
 *                 sortDirection: DESC
 *             ) {
 *                 items {
 *                     bulletin {
 *                         id
 *                         campaign_id
 *                         sender_email
 *                         created_at
 *                         detail {
 *                             subject
 *                             delivery_status_name
 *                             addresses_count
 *                             success_count
 *                             failed_count
 *                             percent_success
 *                             immediate_email_recipients
 *                             emails_delivered
 *                             emails_failed
 *                             percent_emails_delivered
 *                             opens_count
 *                             percent_opened
 *                             nonunique_opens_count
 *                             links_count
 *                             click_rate
 *                             clicks_count
 *                             nonunique_clicks_count
 *                             digest_email_recipients
 *                             unique_click_count
 *                             total_click_count
 *                             unsubscribes
 *                         }
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 */
export const listTopics = ({
    topic: {
        name = undefined,
        code = undefined,
        id = undefined,
        limit: t_limit = 100,
    },
    bulletin: {
        bgn = undefined,
        end = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    jq(
        topics({
            topic: gen_args({ name, code, id, limit: t_limit }),
            bulletin: gen_args({ bgn, end, limit: b_limit, sort }),
        }),
        { pretty: true }
    )

//listTopics({
//    bulletin: { bgn: 2018, end: "2020" },
//    topic: {
//        name: ["Counts", "API"],
//        code: "USCENSUS_11893",
//    },
//}) //?

export const fetchTopics = ({
    topic: {
        name = undefined,
        code = undefined,
        id = undefined,
        limit: t_limit = 100,
    },
    bulletin: {
        bgn = undefined,
        end = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    grafetch({
        gql: listTopics({
            topic: {
                name,
                code,
                id,
                limit: t_limit,
            },
            bulletin: {
                bgn,
                end,
                limit: b_limit,
                sort,
            },
        }),
    }).then(
        ({
            data: {
                listTopics: { items },
            },
        }) => {
            log({ fetchTopics: items }) // FIXME
            return items.flatMap(({ code, name, id, bulletins: { items } }) => {
                const filtered = items.filter(x => !!getIn(x, ["bulletin"]))
                //log({ filtered })
                return squash(
                    filtered.map(({ bulletin: { id: id2, ...rest } }) => ({
                        topic_id: id,
                        name,
                        code,
                        bulletin_id: id2,
                        ...rest,
                    }))
                )
                //.sort(
                //    (pre, cur) =>
                //        new Date(cur.created_at).getTime() -
                //        new Date(pre.created_at).getTime()
                //)
            })
        }
    )

//
//                                                      ,e,       /
//   e88~~\   /~~~8e  888-~88e-~88e 888-~88e    /~~~8e   "  e88~88e 888-~88e  d88~\
//  d888          88b 888  888  888 888  888b       88b 888 888 888 888  888 C888
//  8888     e88~-888 888  888  888 888  8888  e88~-888 888 "88_88" 888  888  Y88b
//  Y888    C888  888 888  888  888 888  888P C888  888 888  /      888  888   888D
//   "88__/  "88_-888 888  888  888 888-_88"   "88_-888 888 Cb      888  888 \_88P
//                                  888                      Y8""8D
//

const campaigns = ({ campaign, bulletin }) => ({
    query: {
        listCampaigns: {
            __args: campaign,
            items: {
                id: true,
                bulletins: {
                    __args: bulletin,
                    items: __bulletin,
                },
            },
        },
    },
})

/**
 * listCampaigns({
 *     bulletin: { sender: "mary" },
 *     campaign: { id: ["v1", "mspio"] },
 * })
 * //->
 * query {
 *     listCampaigns (
 *         filter: {
 *             or: [
 *                 {id: {contains: "v1"}},
 *                 {id: {contains: "mspio"}}
 *             ]
 *         },
 *         limit: 100
 *     ) {
 *         items {
 *             id
 *             bulletins (filter: {sender_email: {contains: "mary"}}, limit: 100, sortDirection: DESC) {
 *                 items {
 *                     id
 *                     campaign_id
 *                     sender_email
 *                     created_at
 *                     detail {
 *                         subject
 *                         delivery_status_name
 *                         addresses_count
 *                         success_count
 *                         failed_count
 *                         percent_success
 *                         immediate_email_recipients
 *                         emails_delivered
 *                         emails_failed
 *                         percent_emails_delivered
 *                         opens_count
 *                         percent_opened
 *                         nonunique_opens_count
 *                         links_count
 *                         click_rate
 *                         clicks_count
 *                         nonunique_clicks_count
 *                         digest_email_recipients
 *                         unique_click_count
 *                         total_click_count
 *                         unsubscribes
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 */
export const listCampaigns = ({
    campaign: { id = undefined, limit: c_limit = 100 },
    bulletin: {
        sender = undefined,
        //bgn = undefined,
        //end = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    jq(
        campaigns({
            campaign: gen_args({ id, limit: c_limit }),
            bulletin: gen_args({
                sender,
                /* bgn, end, */ limit: b_limit,
                sort,
            }),
        }),
        { pretty: true }
    )

//listCampaigns({
//    bulletin: { sender: "mary" },
//    campaign: { id: ["v1", "mspio"] },
//}) //?

export const fetchCampaigns = ({
    campaign: { id = undefined, limit: c_limit = 100 },
    bulletin: {
        sender = undefined,
        //bgn = undefined,
        //end = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    grafetch({
        gql: listCampaigns({
            campaign: { id, limit: c_limit },
            bulletin: {
                sender,
                //bgn,
                //end,
                limit: b_limit,
                sort,
            },
        }),
    }).then(({ data: { listCampaigns: { items } } }) =>
        items
            .flatMap(({ bulletins: { items } }) => squash(items))
            .sort(
                (pre, cur) =>
                    new Date(cur.created_at).getTime() -
                    new Date(pre.created_at).getTime()
            )
    )

//
//                                  888
//   d88~\  e88~~8e  888-~88e  e88~\888  e88~~8e  888-~\  d88~\
//  C888   d888  88b 888  888 d888  888 d888  88b 888    C888
//   Y88b  8888__888 888  888 8888  888 8888__888 888     Y88b
//    888D Y888    , 888  888 Y888  888 Y888    , 888      888D
//  \_88P   "88___/  888  888  "88_/888  "88___/  888    \_88P
//
//

const senders = ({ sender, bulletin }) => ({
    query: {
        listSenders: {
            __args: sender,
            items: {
                id: true,
                bulletins: {
                    __args: bulletin,
                    items: __bulletin,
                },
            },
        },
    },
})

/**
 * @example
 * listSenders({
 *    bulletin: { limit: 1000, sortDirection: E.DESC, camp: "2019" },
 *    sender: { id: "logan" },
 * })
 *
 * // =>
 * query {
 *     listSenders (
 *         filter: {id: {contains: "logan"}},
 *         limit: 100
 *     ) {
 *         items {
 *             id
 *             bulletins (
 *                 filter: {campaign_id: {contains: "mspio"}},
 *                 limit: 1000,
 *                 sortDirection: DESC
 *             ) {
 *                 items {
 *                     id
 *                     campaign_id
 *                     sender_email
 *                     created_at
 *                     detail {
 *                         subject
 *                         delivery_status_name
 *                         addresses_count
 *                         success_count
 *                         failed_count
 *                         percent_success
 *                         immediate_email_recipients
 *                         emails_delivered
 *                         emails_failed
 *                         percent_emails_delivered
 *                         opens_count
 *                         percent_opened
 *                         nonunique_opens_count
 *                         links_count
 *                         click_rate
 *                         clicks_count
 *                         nonunique_clicks_count
 *                         digest_email_recipients
 *                         unique_click_count
 *                         total_click_count
 *                         unsubscribes
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 */
export const listSenders = ({
    sender: { limit: s_limit = 100, id = undefined },
    bulletin: {
        //sender = undefined,
        //bgn = undefined,
        //end = undefined,
        camp = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    jq(
        senders({
            sender: gen_args({ limit: s_limit, id }),
            bulletin: gen_args({
                //sender,
                //bgn,
                //end,
                camp,
                limit: b_limit,
                sort,
            }),
        }),
        { pretty: true }
    )

export const fetchSenders = ({
    sender: { limit: s_limit = 100, id = undefined },
    bulletin: {
        //sender = undefined,
        //bgn = undefined,
        //end = undefined,
        camp = undefined,
        limit: b_limit = 100,
        sort = "DESC",
    },
}) =>
    grafetch({
        gql: listSenders({
            sender: { limit: s_limit, id },
            bulletin: {
                //sender,
                //bgn,
                //end,
                camp,
                limit: b_limit,
                sort,
            },
        }),
    }).then(({ data: { listSenders: { items } } }) =>
        //log(items),
        items
            .flatMap(({ bulletins: { items } }) => squash(items))
            .sort(
                (pre, cur) =>
                    new Date(cur.created_at).getTime() -
                    new Date(pre.created_at).getTime()
            )
    )
//listSenders({
//    bulletin: { limit: 1000, sort: "DESC", camp: "mspio" },
//    sender: { id: "logan" },
//}) //?

//
//  888                888 888             d8   ,e,
//  888-~88e  888  888 888 888  e88~~8e  _d88__  "  888-~88e  d88~\
//  888  888b 888  888 888 888 d888  88b  888   888 888  888 C888
//  888  8888 888  888 888 888 8888__888  888   888 888  888  Y88b
//  888  888P 888  888 888 888 Y888    ,  888   888 888  888   888D
//  888-_88"  "88_-888 888 888  "88___/   "88_/ 888 888  888 \_88P
//
//

const bulletins = ({ bulletin }) => ({
    query: {
        listBulletins: {
            __args: bulletin,
            items: __bulletin,
        },
    },
})

/**
 * @example
 * listBulletins({ bulletin: { bgn: 2010, id: "3404745" } })
 * //=>
 * query {
 *    listBulletins (
 *        filter: {
 *            or: [
 *                {id: {contains: "3404745"}},
 *                {created_at: {gt: "2010"}}
 *            ]
 *        }
 *    ) {
 *        items {
 *            id
 *            campaign_id
 *            sender_email
 *            created_at
 *            detail {
 *                subject
 *                delivery_status_name
 *                addresses_count
 *                success_count
 *                failed_count
 *                percent_success
 *                immediate_email_recipients
 *                emails_delivered
 *                emails_failed
 *                percent_emails_delivered
 *                opens_count
 *                percent_opened
 *                nonunique_opens_count
 *                links_count
 *                click_rate
 *                clicks_count
 *                nonunique_clicks_count
 *                digest_email_recipients
 *                unique_click_count
 *                total_click_count
 *                unsubscribes
 *            }
 *        }
 *    }
 * }
 */
export const listBulletins = ({
    bulletin: {
        bgn = undefined,
        end = undefined,
        camp = undefined,
        sender = undefined,
        id = undefined,
    },
}) =>
    jq(
        bulletins({
            bulletin: gen_args({ bgn, end, camp, sender, id }),
        }),
        { pretty: true }
    )

//listBulletins({ bulletin: { bgn: 2010, id: "3404745" } }) //?

export const fetchBulletins = ({
    bulletin: {
        bgn = undefined,
        end = undefined,
        camp = undefined,
        sender = undefined,
        id = undefined,
    },
}) =>
    grafetch({
        gql: listBulletins({
            bulletin: {
                bgn,
                end,
                camp,
                sender,
                id,
            },
        }),
    }).then(({ data: { listBulletins: { items } } }) =>
        squash(items).sort(
            (pre, cur) =>
                new Date(cur.created_at).getTime() -
                new Date(pre.created_at).getTime()
        )
    )
