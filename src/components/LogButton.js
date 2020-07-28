import React, { useContext, useEffect } from "react"

import { getIn } from "@thi.ng/paths"
import { CTX } from "../context"
import { Button } from "antd"

export const LogButton = () => {
    const { useCursor, $store$ } = useContext(CTX)

    const [count, countCursor] = useCursor(["count"], "LogButton count")

    const increment = crs => () => crs.swap(num => num + 1)
    const decrement = crs => () => crs.swap(num => num - 1)

    const store = $store$.deref()
    const num = getIn(store, ["count"])
    const src = getIn(store, ["img"])

    useEffect(() => {
        //log("cleaning up countCursor")
        return () => {
            countCursor.release()
        }
    }, [count, countCursor])

    return (
        <>
            <img {...{ src, alt: "sport" }} />
            <br />
            <Button type='primary' onClick={increment(countCursor)}>
                inc {num}
            </Button>
            <br />
        </>
    )
}
