import { getIn, setIn } from "@thi.ng/paths"
import { isPlainObject, isArray, isPrimitive } from "@thi.ng/checks"
import { log } from "../utils"
import { map, transduce, comp, push } from "@thi.ng/transducers"
import { tbs, LT, LB, bySender } from "../data"
import {
    squash,
    collect_by_path,
    aggregate_by_key,
    coll_by_path_aggregate,
    apply_kv_ops,
    coll_aggregator_sender,
} from "./data"
import { isObject } from "vega"

//unnest(tbs.data.listTopics.items, ["id"], ["bulletins", "items"]) //?

const test_coll = {
    one: 1,
    two: 2,
    three: [
        { a: 111, b: "🤞", c: "🕗" },
        { a: 333, b: "😻", c: "🍑" },
    ],
    four: {
        five: [
            {
                id: 6,
                bloop: "blop",
            },
            {
                id: 7,
                bloop: "poop",
            },
        ],
    },
}

const isEmpty = coll => {
    return isPlainObject(coll) && !Object.keys(coll).length
        ? true
        : isArray(coll) && !coll.length
        ? true
        : false
}

/**
 * @example
 *
 * const coll = {
 *     one: 1,
 *     two: 2,
 *     three: [
 *         { a: 111, b: "🤞", c: "🕗" },
 *         { a: 333, b: "😻", c: "🍑" },
 *     ],
 *     four: {
 *         five: [
 *             {
 *                 id: 6,
 *                 bloop: "blop",
 *             },
 *             {
 *                 id: 7,
 *                 bloop: "poop",
 *             },
 *         ],
 *     },
 * }
 *
 * collapse(coll)
 * // => {
 * //    "one": 1,
 * //    "two": 2,
 * //    "three/0/a": 111,
 * //    "three/0/b": "🤞",
 * //    "three/0/c": "🕗",
 * //    "three/1/a": 333,
 * //    "three/1/b": "😻",
 * //    "three/1/c": "🍑",
 * //    "four/five/0/id": 6,
 * //    "four/five/0/bloop": "blop",
 * //    "four/five/1/id": 7,
 * //    "four/five/1/bloop": "poop"
 * // }
 */
export const collapse = (coll, crumbs = [], acc = {}, sep = "/") => {
    Object.entries(coll).forEach(([key, val]) => {
        if (isPrimitive(val)) {
            const composite = `${[...crumbs, key].join(sep)}`
            //if (!acc[key]) return (acc[key] = val)
            return (acc[composite] = val)
        }
        if (isArray(val)) {
            val.forEach((obj, idx) => {
                collapse(obj, [...crumbs, key, idx], acc, sep)
            })
        }
        if (isPlainObject(val)) {
            collapse(val, [...crumbs, key], acc, sep)
        }
    })
    return acc
}

export const prune = (coll, acc = {}, sep = "/") => {
    Object.entries(coll).forEach(([k, v]) => {
        const key = k.split(sep).slice(-1)
        acc[key] = v
    })
    return acc
}

//collapse(test_coll) //?
//LT.data.listTopics.items.map(xy => collapse(xy)) //?
//LB.data.listCampaigns.items.map(xy => collapse(xy)).map(z => prune(z)) //?

const xf_smash = comp(
    map(x => collapse(x)),
    map(x => prune(x))
)

export const smash = coll => transduce(xf_smash, push(), coll)
//smash(LB.data.listCampaigns.items) //?

let coll = collect_by_path(["sender_email"], bySender)

let aggr = aggregate_by_key([
    { a: 1, b: 2, c: 3 },
    { a: 2, b: 5, c: 9 },
    { a: 1, b: 4, c: 6 },
]) //?

Object.entries(coll).reduce((a, c, i, d) => {
    let [sender, reports] = c
    a[sender] = aggregate_by_key(reports)
    return a
}, {})

let prep = coll_by_path_aggregate(["sender_email"], bySender)

//JSON.stringify(prep, null, 4) //?

apply_kv_ops({
    a: [(a, c, i, d) => a + c, 0],
    b: [(a, c, i, d) => (a.push(c), a), []],
})(aggr) //?

let test = [
    {
        sender_email: "test1@some.com",
        success_count: 100,
        percent_opened: 2,
        click_rate: 4,
        unsubscribe_rate: 1,
    },
    {
        sender_email: "test1@some.com",
        success_count: 200,
        percent_opened: 4,
        click_rate: 6,
        unsubscribe_rate: 2,
    },
    {
        sender_email: "test3@some.com",
        success_count: 300,
        percent_opened: 6,
        click_rate: 8,
        unsubscribe_rate: 3,
    },
]
coll_aggregator_sender(test) //?
