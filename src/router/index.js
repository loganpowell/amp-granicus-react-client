import React, { useContext, useLayoutEffect, createElement } from "react"
import { Spin } from "antd"

import { getIn } from "@thi.ng/paths"
import { isArray } from "@thi.ng/checks"
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
        URL,
        URL_domain, // array
        URL_subdomain, // array
        URL_hash, // string
        URL_path, // array
    } = match

    log({ match })
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
    const [, p_b] = path

    const RES =
        new EquivMap([
            // home page (empty path = "subscriptions")
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
                    [K.URL_PAGE]: "subs",
                },
            ],
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
                                description:
                                    "Email marketing metrics by campaign",
                                //img_url,
                            },
                            [K.DOM_BODY]: list,
                        }
                    },
                    [K.URL_PAGE]: "campaign",
                },
            ],

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
                                description:
                                    "Email marketing metrics by sender",
                                //img_url,
                            },
                            [K.DOM_BODY]: list,
                        }
                    },
                    [K.URL_PAGE]: "sender",
                },
            ],
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
                    [K.URL_PAGE]: "topic",
                },
            ],
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
                                description:
                                    "Email marketing metrics by bulletin",
                                //img_url,
                            },
                            [K.DOM_BODY]: list,
                        }
                    },
                    [K.URL_PAGE]: "subs",
                },
            ],
            [
                { ...match, [K.URL_PATH]: ["test"] },
                { [K.URL_DATA]: () => "hello world", [K.URL_PAGE]: "test" },
            ], // get match || 404 data
        ]).get(match) || log("FUCK")

    let data = RES[K.URL_DATA]
    let page = RES[K.URL_PAGE]
    //log("routed:", { page, data })

    return { [K.URL.DATA]: await data(), [K.URL.PAGE]: page }
}

const h = createElement

//const Page1 = ({ data }) => {
//    return h(
//        "pre",
//        { className: "ass" },
//        h("h1", null, `PAGE 1:`),
//        h(LogButton),
//        JSON.stringify(data, null, 2)
//    )
//}

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

    //layouteffect needed due to async shit...
    useLayoutEffect(() => {
        // re-render when loading state changes
        log("re-rendered Page:", { loading, Page })
        // cleanup

        return () => {
            log("cleaning up:", { loading, Page })
            pageCursor.release()
            loadingCursor.release()
        }
    }, [loading, loadingCursor, Page, pageCursor])

    const store = $store$.deref()
    log({ store })

    const RenderPage =
        {
            //"page-1": Page1,
            //"page-2": Page2,
            sender: BySender,
            subs: Home,
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
            topic: ByTopic,
            campaign: ByCampaign,
        }[Page] || Home
    // FIXME: @-0/browser Command accommodate URL_path:
    // [] -> when data gets merged into the store
    // en-masse (make sure to preserve the primary
    // properties: { _PAGE_TEMPLATE, _ROUTE_LOADING,
    // etc... }) TODO: allocate a `0` prop/key for empty/home path?

    return loading || loading === undefined ? (
        <div className='spinner_container'>
            <div className='spinner'>
                <Spin size='large' />
            </div>
        </div>
    ) : (
        <RenderPage data={getIn(store, store[K.$$_PATH])} />
    )
}
