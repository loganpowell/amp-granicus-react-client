import React, { createContext } from "react"
import { run$ } from "@-0/spool"
import { $store$ } from "@-0/browser"
import { parse } from "@-0/utils"
import * as K from "@-0/keys"
import { createCursor } from "../hooks"

export const useCursor = createCursor($store$)

export const Pre = ({ data }) => {
    const json = JSON.stringify(data, null, 2)
    //log("Pre, json:", json)
    return <pre>{json}</pre>
}

export const CTX = createContext({
    run$,
    useCursor,
    $store$,
    parse,
    DefaultView: Pre,
})
