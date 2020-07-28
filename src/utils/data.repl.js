import { getIn, setIn } from "@thi.ng/paths"
import { isPlainObject, isArray, isPrimitive } from "@thi.ng/checks"
import { log } from "../utils"
import { map, transduce, comp, push } from "@thi.ng/transducers"
import { tbs, LT, LB } from "../data"
import { squash } from "./data"
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
smash(LB.data.listCampaigns.items) //?
