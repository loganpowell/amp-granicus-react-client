import React, { useContext } from "react"
import { CMD_SUB$, CMD_ARGS, CMD_WORK, URL_PATH } from "@-0/keys"
import { registerCMD, run$ } from "@-0/spool"
import { parse } from "@-0/utils"
import { HURL, DOMnavigated$ } from "@-0/browser"
import { CTX } from "../context"
import { log } from "../utils/data"

export const antHURLer = ({ key, domEvent }) => {
    const href = key
    const w_href = window.location.href
    const parsed = parse(w_href)
    const w_path = `/${parsed[URL_PATH].join("/")}`
    if (href === w_href || href === w_path) return
    DOMnavigated$.next({
        target: { location: { href } },
        currentTarget: domEvent.currentTarget,
    })
    return domEvent
}

export const ANT_HURL = registerCMD({
    [CMD_SUB$]: "_ANT_HURL",
    [CMD_ARGS]: ev => ev,
    [CMD_WORK]: antHURLer,
})

// custom HURL function for ant.design menu component onClick handler
export const antHURL = ({ item, key, keyPath, domEvent }) => {
    log({ item, key, keyPath, domEvent })
    domEvent.preventDefault()
    run$.next({ ...ANT_HURL, args: { key, domEvent } })
}

export const Link = ({ to, children }) => {
    const { run$ } = useContext(CTX)
    const path = `/${to}`
    log({ path })
    return (
        <a
            href={path}
            onClick={e => {
                e.preventDefault()
                run$.next({ ...HURL, args: e })
            }}
        >
            {children}
        </a>
    )
}
