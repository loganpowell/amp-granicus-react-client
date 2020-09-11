import React, { useContext, useLayoutEffect } from "react"
import { Spin } from "antd"

import { getIn } from "@thi.ng/paths"
import { EquivMap } from "@thi.ng/associative"

import { parse } from "@-0/utils"
import * as K from "@-0/keys"

//import { Chrome } from "../layout"
import { log, JL } from "../utils"
import {
    fetchCampaigns,
    fetchSenders,
    //fetchSubs,
    fetchTopics,
    fetchBulletins,
    fetchSubs,
} from "../queries"

import { CTX } from "../context"
import { ByCampaign, ByTopic, BySender, Home } from "../pages"
import { LogButton, Filter } from "../components"

//
//                             d8
//  888-~\  e88~-_  888  888 _d88__  e88~~8e   d88~\
//  888    d888   i 888  888  888   d888  88b C888
//  888    8888   | 888  888  888   8888__888  Y88b
//  888    Y888   ' 888  888  888   Y888    ,   888D
//  888     "88_-~  "88_-888  "88_/  "88___/  \_88P
//
//

const sort_by_campaign_id_fn = (a, b) =>
    a.campaign_id.toUpperCase() < b.campaign_id.toUpperCase() ? -1 : 1
/**
 *
 * Even if you don't end up using `spule` - you may find the
 * [`@thi.ng/associative`](https://github.com/thi-ng/umbrella/tree/develop/packages/associative)
 * library __very handy__ indeed!
 *
 * Value semantics have so many benefits. As a router,
 * here's one.
 *
 * TODO: Graphql Example
 */

export const routerCfg = async url => {
    const match = parse(url)
    const {
        URL_query, // object
        URL, // string
        URL_domain, // array
        URL_subdomain, // array
        URL_hash, // string
        URL_path, // array
    } = match

    let {
        camp,
        name,
        code,
        id,
        limit = 100,
        bgn,
        end,
        sort = "DESC",
        sender,
    } = URL_query

    //limit = parseInt(limit)
    const path = match[K.URL.PATH]

    log({ match })

    const RES = new EquivMap([
        //
        //  888
        //  888-~88e  e88~-_  888-~88e-~88e  e88~~8e
        //  888  888 d888   i 888  888  888 d888  88b
        //  888  888 8888   | 888  888  888 8888__888
        //  888  888 Y888   ' 888  888  888 Y888    ,
        //  888  888  "88_-~  888  888  888  "88___/
        //
        //

        [
            { ...match, [K.URL.PATH]: [] },
            {
                [K.URL.DATA]: async () => {
                    let list = await fetchSubs({
                        topic: {
                            ...(code && { code }),
                            ...(id && { id }),
                            ...(name && { name }),
                            limit: 1000,
                        },
                        bulletin: {
                            ...(bgn && { bgn }),
                            ...(end && { end }),
                            limit,
                            sort,
                        },
                    })
                    return {
                        [K.DOM_HEAD]: {
                            title: "Subscription Metrics",
                            description: "Subscription Metrics",
                            //img_url,
                        },
                        [K.DOM_BODY]: { data: list },
                    }
                },
                [K.URL_PAGE]: "subscriptions",
            },
        ],
        //
        //                                                      ,e,       /
        //   e88~~\   /~~~8e  888-~88e-~88e 888-~88e    /~~~8e   "  e88~88e 888-~88e
        //  d888          88b 888  888  888 888  888b       88b 888 888 888 888  888
        //  8888     e88~-888 888  888  888 888  8888  e88~-888 888 "88_88" 888  888
        //  Y888    C888  888 888  888  888 888  888P C888  888 888  /      888  888
        //   "88__/  "88_-888 888  888  888 888-_88"   "88_-888 888 Cb      888  888
        //                                  888                      Y8""8D
        //

        [
            { ...match, [K.URL.PATH]: ["campaign"] },
            {
                [K.URL.DATA]: async () => {
                    let list = await fetchCampaigns({
                        campaign: { ...(id && { id }), limit: 1000 },
                        bulletin: {
                            limit,
                            sort,
                            ...(sender && { sender }),
                        },
                    })
                    return {
                        [K.DOM_HEAD]: {
                            title: "Campaign Metrics",
                            description: "Email marketing metrics by campaign",
                            //img_url,
                        },
                        [K.DOM_BODY]: list.sort(sort_by_campaign_id_fn),
                    }
                },
                [K.URL_PAGE]: "campaigns",
            },
        ],
        //
        //                                  888
        //   d88~\  e88~~8e  888-~88e  e88~\888  e88~~8e  888-~\
        //  C888   d888  88b 888  888 d888  888 d888  88b 888
        //   Y88b  8888__888 888  888 8888  888 8888__888 888
        //    888D Y888    , 888  888 Y888  888 Y888    , 888
        //  \_88P   "88___/  888  888  "88_/888  "88___/  888
        //
        //

        [
            { ...match, [K.URL.PATH]: ["sender"] },
            {
                [K.URL.DATA]: async () => {
                    let list = await fetchSenders({
                        sender: { limit: 1000, ...(id && { id }) },
                        bulletin: { ...(camp && { camp }), limit, sort },
                    })
                    return {
                        [K.DOM_HEAD]: {
                            title: "Sender Metrics",
                            description: "Email marketing metrics by sender",
                            //img_url,
                        },
                        [K.DOM_BODY]: list,
                    }
                },
                [K.URL_PAGE]: "senders",
            },
        ],
        //
        //    d8                      ,e,
        //  _d88__  e88~-_  888-~88e   "   e88~~\
        //   888   d888   i 888  888b 888 d888
        //   888   8888   | 888  8888 888 8888
        //   888   Y888   ' 888  888P 888 Y888
        //   "88_/  "88_-~  888-_88"  888  "88__/
        //                  888
        //

        [
            { ...match, [K.URL.PATH]: ["topic"] },
            {
                [K.URL.DATA]: async () => {
                    let list = await fetchTopics({
                        topic: {
                            ...(name && { name }),
                            ...(code && { code }),
                            ...(id && { id }),
                            limit: 1000,
                        },
                        bulletin: {
                            ...(bgn && { bgn }),
                            ...(end && { end }),
                            limit,
                            sort,
                        },
                    })
                    log({ list }) // FIXME
                    return {
                        [K.DOM_HEAD]: {
                            title: "Topic Metrics",
                            description: "Email marketing metrics by topic",
                            //img_url,
                        },
                        [K.DOM_BODY]: list,
                    }
                },
                [K.URL_PAGE]: "topics",
            },
        ],
        //
        //  888                888 888             d8   ,e,
        //  888-~88e  888  888 888 888  e88~~8e  _d88__  "  888-~88e
        //  888  888b 888  888 888 888 d888  88b  888   888 888  888
        //  888  8888 888  888 888 888 8888__888  888   888 888  888
        //  888  888P 888  888 888 888 Y888    ,  888   888 888  888
        //  888-_88"  "88_-888 888 888  "88___/   "88_/ 888 888  888
        //
        //

        [
            { ...match, [K.URL.PATH]: ["bulletin"] },
            {
                [K.URL.DATA]: async () => {
                    let list = await fetchBulletins({
                        bulletin: { bgn, end, camp, sender, id },
                    })
                    return {
                        [K.DOM_HEAD]: {
                            title: "Bulletin Metrics",
                            description: "Email marketing metrics by bulletin",
                            //img_url,
                        },
                        [K.DOM_BODY]: list,
                    }
                },
                [K.URL_PAGE]: "subs",
            },
        ],
        //
        //    d8                      d8
        //  _d88__  e88~~8e   d88~\ _d88__
        //   888   d888  88b C888    888
        //   888   8888__888  Y88b   888
        //   888   Y888    ,   888D  888
        //   "88_/  "88___/  \_88P   "88_/
        //
        //
    ]).get(match) || { [K.URL_DATA]: () => 404, [K.URL_PAGE]: "test" }

    let data = RES[K.URL_DATA]
    let page = RES[K.URL_PAGE]
    //log("routed:", { page, data })

    return { [K.URL.DATA]: await data(), [K.URL.PAGE]: page }
}

//const Page2 = ({ data }) => {
//    return h(
//        "pre",
//        { className: "boobs" },
//        h("h1", null, `PAGE 2:`),
//        JSON.stringify(data, null, 2)
//    )
//}

export const View = () => {
    const { useCursor, $store$ } = useContext(CTX)
    const [Page, pageCursor] = useCursor([K.$$_VIEW], "View Page")
    const [loading, loadingCursor] = useCursor([K.$$_LOAD], "View loading")

    useLayoutEffect(() => {
        // re-render when loading state changes
        //log("re-rendered Page:", { loading, Page })
        // cleanup

        return () => {
            //log("cleaning up:", { loading, Page })
            pageCursor.release()
            loadingCursor.release()
        }
    }, [loading, loadingCursor, Page, pageCursor])

    const store = $store$.deref()
    //log({ store })

    const RenderPage =
        {
            senders: BySender,
            subscriptions: Home,
            test: (
                <Filter
                    selections={{
                        id: "email",
                        limit: "limit",
                        camp: "campaign",
                        sort: "sort",
                    }}
                />
            ),
            topics: ByTopic,
            campaigns: ByCampaign,
        }[Page] ||
        (() => (
            <div className='spinner_container'>
                <div className='spinner'>
                    <Spin size='large' tip='fetching data...' />
                </div>
            </div>
        ))

    return loading ? (
        <div className='spinner_container'>
            <div className='spinner'>
                <Spin size='large' tip={`fetching data..`} />
            </div>
        </div>
    ) : (
        <RenderPage data={getIn(store, store[K.$$_PATH])} />
    )
}
