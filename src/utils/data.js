//import { getIn, setIn } from "@thi.ng/paths"
import { isPlainObject, isArray } from "@thi.ng/checks"
import { map, transduce, comp, push, scan } from "@thi.ng/transducers"
import { getIn } from "@thi.ng/paths"

export const log = console.log
export const json = arg => JSON.stringify(arg, null, 2)
export const JL = arg => log(json(arg))

export const isEmpty = coll => {
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
 *collapse(coll)
 * // => {
 *     "one": 1,
 *     "two": 2,
 *     "three/0/a": 111,
 *     "three/0/b": "🤞",
 *     "three/0/c": "🕗",
 *     "three/1/a": 333,
 *     "three/1/b": "😻",
 *     "three/1/c": "🍑",
 *     "four/five/0/id": 6,
 *     "four/five/0/bloop": "blop",
 *     "four/five/1/id": 7,
 *     "four/five/1/bloop": "poop"
 *  }
 */
export const collapse = (coll, sep = "/", crumbs = [], acc = {}) => {
    //log({ coll })
    coll = coll === null ? {} : coll
    Object.entries(coll).forEach(([key, val]) => {
        isArray(val) || isPlainObject(val)
            ? collapse(val, sep, [...crumbs, key], acc)
            : (acc[[...crumbs, key].join(sep)] = val)
    })
    return acc
}
/**
 * when all last key qualifiers are unique, this function
 * removes unnecessarily specific keys
 *
 * @example
 *
 * const coll = {
 *    "one": 1,
 *    "two": 2,
 *    "three/0/a": 111,
 *    "three/0/b": "🤞",
 *    "three/0/c": "🕗",
 *    "three/1/a": 333,
 *    "three/1/b": "😻",
 *    "three/1/c": "🍑",
 *    "four/five/0/id": 6,
 *    "four/five/0/bloop": "blop",
 *    "four/five/1/id": 7,
 *    "four/five/1/bloop": "poop"
 * }
 *
 * prune(coll)
 * // => { one: 1, two: 2, a: 333, b: '😻', c: '🍑', id: 7, bloop: 'poop' }
 */
export const prune = (coll, sep = "/", acc = {}) => {
    Object.entries(coll).forEach(([k, v]) => {
        const key = k.split(sep).slice(-1)
        acc[key] = v
    })
    return acc
}

/*
  [{
    "id": "12036044",
    "campaign_id": "NA",
    "sender_email": "martin.brockman@census.gov",
    "created_at": "2014-05-13T12:45:32.000Z",
    "subject": "Advance Monthly Sales for Retail and Food Services",
    "delivery_status_name": "Delivered",
    "addresses_count": 6491,
    "success_count": 6286,
    "failed_count": 205,
    "percent_success": 96.841780927438,
    "immediate_email_recipients": 6491,
    "emails_delivered": 6286,
    "emails_failed": 205,
    "percent_emails_delivered": 96.841780927438,
    "opens_count": 731,
    "percent_opened": 11.62901686286987,
    "nonunique_opens_count": 954,
    "links_count": 17,
    "click_rate": 2.6885141584473433,
    "nonunique_clicks_count": 169,
    "nonunique_nonunique_clicks_count": 189,
    "digest_email_recipients": 0,
    "unique_click_count": 164,
    "total_click_count": 189,
    "unsubscribes": 1
  }, ...]


//  
//  ~~~888~~~   ,88~-_   888~-_     ,88~-_   
//     888     d888   \  888   \   d888   \  
//     888    88888    | 888    | 88888    | 
//     888    88888    | 888    | 88888    | 
//     888     Y888   /  888   /   Y888   /  
//     888      `88_-~   888_-~     `88_-~   
//                                           
//  

  TODO: add other derived values (e.g., subject_is_question: bool...)
  // sendcheckit ///////////////////////////////////////////////

    //https://sendcheckit.com/api/?subject=are%20you%20frustrated%20with%20your%20data?
const sendcheckit_reponse = {
  flesch_score: 87.9,
  scannability_score: 8.790000000000001,
  flesch_grade: 2,
  num_words: 6,
  num_syllables: 8,
  num_characters: 34,
  re_found: false,
  fwd_found: false,
  free_found: false,
  spam_words_found: false,
  personalization_detected: false,
  low_friction_words_found: false,
  medium_friction_words_found: false,
  is_a_question: true,
  all_caps_found: false,
  most_complicated_word: "frustrated",
  exclamation_found: false,
  excessive_punctuation_found: false,
  contains_emoji: false,
  all_lowercase: true,
  medium_friction_words_in_subject: [],
  spam_words_in_subject: [],
  sentiment: "negative",
  sentiment_score: -0.5,
  most_complicated_word_score: 36.6,
  rating: 103,
  letter_rating: "A+",
}
/////////////////////////////////////////////// sendcheckit //

// grammarly (unofficial) ///////////////////////////////////////////////

// https://github.com/stewartmcgown/grammarly-api

//
//        /                                                               888
//  e88~88e 888-~\   /~~~8e  888-~88e-~88e 888-~88e-~88e   /~~~8e  888-~\ 888 Y88b  /
//  888 888 888          88b 888  888  888 888  888  888       88b 888    888  Y888/
//  "88_88" 888     e88~-888 888  888  888 888  888  888  e88~-888 888    888   Y8/
//   /      888    C888  888 888  888  888 888  888  888 C888  888 888    888    Y
//  Cb      888     "88_-888 888  888  888 888  888  888  "88_-888 888    888   /
//   Y8""8D                                                                   _/
//

/////////////////////////////////////////////// grammarly (unofficial) //
*/

export const augment = props => {
    const {
        opens_count,
        nonunique_opens_count,
        total_click_count,
        emails_delivered,
        unsubscribes,
        subject = "",
        addresses_count,
        ...rest
    } = props
    const engagement_rate = ~~(
        ((opens_count + total_click_count) / emails_delivered) *
        100
    )
    const subject_words = subject.split(" ").length
    const unsubscribe_rate = (unsubscribes / emails_delivered) * 100
    const impressions = total_click_count + nonunique_opens_count
    return {
        emails_sent: addresses_count,
        ...props,
        unsubscribes,
        unsubscribe_rate,
        engagement_rate,
        impressions,
        avg_impressions: impressions,
        opens_count: nonunique_opens_count,
        unique_opens_count: opens_count,
        addresses_count,
        ...(subject_words && { subject_words }),
        ...rest,
    }
}

export const diff = [
    () => ({}),
    acc => acc,
    (acc, cur) => {
        //log({ acc, cur })
        const { created_at: c_a } = acc
        const { created_at, ...rest } = cur
        const time_acc = new Date(c_a).getTime()
        const time_cur = new Date(created_at).getTime()
        const days_gap = Math.abs((time_cur - time_acc) / (1000 * 3600 * 24))

        return {
            days_gap: isNaN(days_gap) ? null : days_gap > 30 ? 30 : ~~days_gap,
            created_at,
            ...rest,
        }
    },
]

const divy = coll => {
    const {
        bulletins_sent: x,
        direct,
        overlay,
        signup,
        upload,
        other,
        all_network,
        deleted_subscriptions,
        new_subscriptions,
        ...rest
    } = coll
    return {
        bulletins_sent: x,
        new_topic_subscriptions: new_subscriptions,
        subscriptions: ~~(new_subscriptions / x),
        deleted: -~~(deleted_subscriptions / x),
        network: ~~(all_network / x),
        direct: ~~(direct / x),
        upload: ~~(upload / x),
        overlay: ~~(overlay / x),
        signup: ~~(signup / x),
        other: ~~(other / x),
        ...rest,
    }
}

const xform = comp(
    map(x => collapse(x)),
    map(x => prune(x))
)

const augMap = comp(xform, map(augment), scan(diff))
const divyUp = comp(xform, map(divy))

export const squish = coll => transduce(divyUp, push(), coll)
export const squash = coll => transduce(augMap, push(), coll)

/*
{acc: {…}, cur: {…}}
acc:
code: "USCENSUS_292"
created_at2: undefined
days_gap: NaN
engagement_rate: NaN
name: "Economic Studies"
topic_id: "73957"
Symbol(vega_id): 18737
__proto__: Object
cur:
code: "USCENSUS_292"
engagement_rate: NaN
name: "Economic Studies"
topic_id: "73957"
__proto__: Object
*/
//diff[2](
//    { created_at: "2018-05-10T13:14:15.000Z" },
//    { created_at: "2013-10-24T13:02:00.000Z" }
//) //?

/**
 * @example
 * let test = [{a:1, b:2, c:3}, {a:2, b:5, c:9}, {a:1, b:4, c:6}]
 *
 * collect_by_path(["a"], test) //?
 *
 * { 1: [{a:1, b:2, c:3}, {a:1, b:4, c:6}], 2: [{a:2, b:5, c:9}] }
 */
export const collect_by_path = (path, entries = []) => {
    let collection = {}
    entries.forEach(entry => {
        const prop = getIn(entry, path)
        if (collection[prop]) {
            return collection[prop].push(entry)
        }
        return (collection[prop] = [entry])
    })
    return collection
}

/**
 * @example
 * let test = [{a:1, b:2, c:3}, {a:2, b:5, c:9}, {a:1, b:4, c:6}]
 *
 * aggregate_by_key(test) //?
 *
 * { a: [ 1, 2, 1 ], b: [ 2, 5, 4 ], c: [ 3, 9, 6 ] }
 */
export const aggregate_by_key = (reports = []) => {
    let aggregates = {}
    reports.forEach(report => {
        Object.entries(report).forEach(([k, v]) => {
            if (aggregates[k]) {
                return aggregates[k].push(v)
            }
            return (aggregates[k] = [v])
        })
    })
    return aggregates
}

/**
 * @example
 * let test = [{a:1, b:2, c:3}, {a:2, b:5, c:9}, {a:1, b:4, c:6}]
 *
 * coll_by_path_aggregate(["a"], test) //?
 *
 * {
 *  1: {
 *      aggregate:{a:[1,1], b:[2,4], c:[3,6]},
 *      reports:[{a:1, b:2, c:3}, {a:1, b:4, c:6}]
 *  },
 *  2: {
 *      aggregate:{a:[2], b:[5], c:[9]},
 *      reports:[{a:2, b:5, c:9}]
 *  }
 * }
 */
export const coll_by_path_aggregate = (path = [], entries = []) => {
    let coll = collect_by_path(path, entries)
    return Object.entries(coll).reduce((a, c, i, d) => {
        let [sender, reports] = c
        a[sender] = { aggregate: aggregate_by_key(reports), reports }
        return a
    }, {})
}

/**
 * @example
 * let ex = { a: [ 1, 2, 1 ], b: [ 2, 5, 4 ], c: [ 3, 9, 6 ] }
 * apply_kv_ops({a: [(a, c, i, d) => a + c, 0], b: [(a, c, i, d) => (a.push(c), a), []]})(ex) //?
 * { a: 4, b: [2, 5, 4] }
 */
export const apply_kv_ops = (key_reduction_map = {}) => (aggregate = {}) => {
    return Object.entries(aggregate).reduce((a, c, i, d) => {
        let [_key, arr] = c
        if (key_reduction_map[_key]) {
            a[_key] = arr.reduce(...key_reduction_map[_key])
        }
        return a
    }, {})
}

/**
 * @example
 * let test = [
 *   {
 *       sender_email: "test1@some.com",
 *       success_count: 100,
 *       percent_opened: 2,
 *       click_rate: 4,
 *       unsubscribe_rate: 1,
 *   },
 *   {
 *       sender_email: "test1@some.com",
 *       success_count: 200,
 *       percent_opened: 4,
 *       click_rate: 6,
 *       unsubscribe_rate: 2,
 *   },
 *   {
 *       sender_email: "test3@some.com",
 *       success_count: 300,
 *       percent_opened: 6,
 *       click_rate: 8,
 *       unsubscribe_rate: 3,
 *   },
 * ]
 *
 * coll_aggregator_sender(test) //?
 *
 * { 'test1@some.com':
 *   { reports: [ [Object], [Object] ],
 *     summary:
 *      { success_count: 300,
 *        percent_opened: 3,
 *        click_rate: 5,
 *        unsubscribe_rate: 1.5 } },
 *  'test3@some.com':
 *   { reports: [ [Object] ],
 *     summary:
 *      { success_count: 300,
 *        percent_opened: 6,
 *        click_rate: 8,
 *        unsubscribe_rate: 3 } } }
 */
export const coll_aggregator_sender = data => {
    const filtered = data.filter(x => x.emails_sent > 100)
    const collection = coll_by_path_aggregate(["sender_email"], filtered)
    const avg = [(a, c, i, { length }) => ~~((a + c / length) * 100) / 100, 0]
    const sum = [(a, c, i, d) => a + c, 0]

    let out = {}

    Object.entries(collection).forEach(([sender, metrics]) => {
        out[sender] = {
            summary: apply_kv_ops({
                emails_sent: sum,
                success_count: sum,
                percent_emails_delivered: avg,
                percent_opened: avg,
                click_rate: avg,
                engagement_rate: avg,
                unsubscribe_rate: avg,
                impressions: sum,
                addresses_count: avg,
                emails_delivered: avg,
                opens_count: avg,
                unique_opens_count: avg,
                nonunique_clicks_count: avg,
                unique_click_count: avg,
                avg_impressions: avg,
            })(metrics["aggregate"]),
            reports: metrics["reports"],
        }
    })
    return out
}

/**
 * @example
 *
 * const agr_coll = {
 * 'test1@some.com':
 *   { reports: [ [Object], [Object] ],
 *     summary:
 *      { success_count: 300,
 *        percent_opened: 3,
 *        click_rate: 5,
 *        unsubscribe_rate: 1.5 } },
 *  'test3@some.com':
 *   { reports: [ [Object] ],
 *     summary:
 *      { success_count: 300,
 *        percent_opened: 6,
 *        click_rate: 8,
 *        unsubscribe_rate: 3 } } }
 * averaged(agr_coll) //?
 * {
 *  success_count: 300,
 *  percent_opened: 4.5,
 *  click_rate: 6.5,
 *  unsubscribe_rate: 4
 * }
 */
export const averaged = agr_coll =>
    Object.entries(agr_coll).reduce((a, c, i, { length }) => {
        const [_, stats] = c
        const { summary } = stats
        Object.entries(summary).forEach(([k, v]) => {
            a[k] = a[k]
                ? ~~((a[k] + v / length) * 100) / 100
                : ~~((v / length) * 100) / 100
        })
        return a
    }, {})

export const metric_name = k =>
    k === "success_count"
        ? "Succeeded (#)"
        : k === "percent_emails_delivered"
        ? "Delivered (%)"
        : k === "percent_opened"
        ? "Opened (%)"
        : k === "click_rate"
        ? "Clicked (%)"
        : k === "unsubscribe_rate"
        ? "Deleted (%)"
        : k === "engagement_rate"
        ? "Engaged (%)"
        : k === "impressions"
        ? "Impressions (#)"
        : k === "addresses_count"
        ? "Sent (#)"
        : k === "emails_delivered"
        ? "Delivered (#)"
        : k === "opens_count"
        ? "Opens (#)"
        : k === "unique_opens_count"
        ? "Unique Opens (#)"
        : k === "nonunique_clicks_count"
        ? "Clicks (#)"
        : k === "unique_click_count"
        ? "Unique Clicks (#)"
        : k === "avg_impressions"
        ? "Impressions (#)"
        : k === "emails_sent"
        ? "Sent (#)"
        : "(#)"
