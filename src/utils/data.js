//import { getIn, setIn } from "@thi.ng/paths"
import { isPlainObject, isArray } from "@thi.ng/checks"
import { map, transduce, comp, push, scan } from "@thi.ng/transducers"

export const log = console.log
export const json = arg => JSON.stringify(arg, null, 2)
export const JL = arg => log(json(arg))

// TODO -> make more generalized (across queries)
const flatten_listTopics = listTopics =>
    listTopics.reduce((a, c, i) => {
        const { id, code, name, bulletins } = c
        const { items } = bulletins
        const byDate = (prev, curr) =>
            new Date(prev.created_at).getTime() -
            new Date(curr.created_at).getTime()
        const nested = items.sort(byDate).reduce((acc, cur, idx) => {
            const { bulletin_id, topic_id, created_at, bulletin } = cur
            const { campaign_id, detail, sender_email } = bulletin
            const {
                subject,
                emails_delivered,
                unsubscribes,
                unique_click_count,
                total_click_count,
                opens_count,
                percent_opened,
            } = detail
            const subject_length = subject.length

            const days_gap = !acc.length
                ? 300 // if first date on record for topic, assign to 300 days
                : (new Date(created_at).getTime() -
                      new Date(acc[acc.length - 1]["created_at"]).getTime()) /
                  (1000 * 3600 * 24)
            const click_rate = total_click_count / emails_delivered
            const engagement_rate =
                (opens_count + total_click_count) / emails_delivered
            return acc.concat({
                topic_id,
                topic_code: code,
                topic_name: name,
                bulletin_id,
                sender_email,
                created_at,
                days_gap, // : days_gap > days_gap_max ? days_gap_max : days_gap, // handle with clip
                campaign_id,
                subject,
                subject_length, // : subject_length > 150 ? 150 : subject_length,
                emails_delivered,
                unsubscribes,
                unique_click_count,
                total_click_count,
                opens_count,
                percent_opened,
                click_rate, // click_rate > .2 ? .2 : click_rate,
                engagement_rate,
            })
        }, [])
        return a.concat(nested)
    }, [])

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
    "clicks_count": 169,
    "nonunique_clicks_count": 189,
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
        total_click_count,
        emails_delivered,
        unsubscribes,
        subject = "",
        ...rest
    } = props
    const engagement_rate = (opens_count + total_click_count) / emails_delivered
    const subject_chars = subject.length
    const unsubscribe_rate = unsubscribes / emails_delivered
    return {
        ...props,
        unsubscribes,
        unsubscribe_rate,
        engagement_rate,
        ...(subject_chars && { subject_chars }),
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
