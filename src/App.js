import React from "react" //useMemo, //useLayoutEffect, //useEffect, //useContext, //createElement,

//import { getIn } from "@thi.ng/paths"
//import { isObject } from "@thi.ng/checks"
//import { EquivMap } from "@thi.ng/associative"
//import { Cursor } from "@thi.ng/atom"

//import "regenerator-runtime"
// import scrolly from "@mapbox/scroll-restorer"
// scrolly.start()

import { registerCMD, command$, out$, run$ } from "@-0/spool"
import {
    INJECT_HEAD,
    HURL,
    $store$,
    HURLer,
    DOMnavigated$,
    set$$tate,
    registerRouterDOM,
} from "@-0/browser"
import { parse, trace$, diff_keys } from "@-0/utils"
import * as K from "@-0/keys"

import { Button } from "antd"

import { log } from "./utils"
import { Chrome } from "./layout"
import { Link } from "./components"
import { CTX, useCursor, Pre } from "./context"
import { createCursor } from "./hooks"
import { routerCfg, View } from "./router"

import "./App.less"

// ⚠ <=> API SURFACE AREA TOO LARGE <=> ⚠ .
// import { button_x } from "./components"
// import { THEME } from "./theme"

//trace$("run$ ->", run$)
//trace$("command$ ->", command$)
//trace$("out$ ->", out$)

//const logger = registerCMD({
//    sub$: "logger",
//    args: ({ x }) => x,
//    work: log,
//})

// default value ({ run$  }) is applied when no Provider is found in the inheritance tree of the component (orphans)

//@ts-ignore

//
//                              d8                        d8
//   e88~~\  e88~-_  888-~88e _d88__  e88~~8e  Y88b  /  _d88__
//  d888    d888   i 888  888  888   d888  88b  Y88b/    888
//  8888    8888   | 888  888  888   8888__888   Y88b    888
//  Y888    Y888   ' 888  888  888   Y888    ,   /Y88b   888
//   "88__/  "88_-~  888  888  "88_/  "88___/   /  Y88b  "88_/
//
//

//prettier-ignore
const Provider = ({ children, CFG = {} }) => {
   
    //const DOMRoot     = CFG[K.CFG_ROOT] || document.body 
    // ⬆ ⚠ can't refer to the root node (circular reference)

    // default wrapper for pages before they are specified
    const DefaultView = CFG[K.CFG_VIEW] || Pre
    const router      = CFG[K.CFG_RUTR]
    // clean URL
    const knowns      = Object.values(K.CFG) || []
    const prfx        = router[K.ROUTER_PRFX] || null
    const [, others]  = diff_keys(knowns, CFG)
    const escRGX      = /[-/\\^$*+?.()|[\]{}]/g
    const escaped     = str => str.replace(escRGX, "\\$&")
    const RGX         = prfx ? new RegExp(escaped(prfx || ""), "g") : null

    if (router) registerRouterDOM(router)
    else throw new Error(`no \`${K.CFG_RUTR}\` found in Provider CFG`)
    
    // Prime store with CFG state
    $store$.swap(x => ({...CFG, ...x}))

    // FIXME: log
    log("$store$.deref():", $store$.deref() )

    return (
        <CTX.Provider value={{
            run$,
            useCursor,
            $store$,
            parse: () => parse(window.location.href, RGX),
            DefaultView,
            ...others
          }}>
            { children }
        </CTX.Provider>
    )
}

//export const root = document.getElementById("root")
const router = {
    [K.ROUTER.RUTR]: routerCfg,
    [K.ROUTER.PRFX]: "staging/",
    [K.ROUTER.POST]: INJECT_HEAD,
}

const App = () => (
    <Provider
        CFG={{
            //count: 0,
            [K.CFG_RUTR]: router /* circular dep!! [K.CFG_ROOT]: root*/,
        }}
    >
        <Chrome>
            <View />
        </Chrome>
    </Provider>
)

log("registered Commands:", out$.topics.entries())

log("starting...")

export default App
