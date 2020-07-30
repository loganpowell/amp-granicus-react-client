import React, { useState, useContext } from "react"
import { Button, Input, Form, message, Tooltip, Select } from "antd"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { HURL } from "@-0/browser"
import { isArray } from "@thi.ng/checks"

import { CTX } from "../context"
import { log } from "../utils"

const { Item } = Form
const { Option } = Select

// Triggered on select
const createFilterStub = (fields, setFields, name) => {
    let complete = fields.filter(f => f.name !== "")
    let stub = fields.find(f => f.name === "")
    //log({ stub, fields })
    stub.name = name
    //stub.key = name
    let updatedFields = [...complete, stub]
    //log({ complete, stub, updatedFields })
    setFields(updatedFields)
}

const filterSelects = options => (fields, setFields, field) => {
    return (
        <Select
            style={{ width: 120 }}
            value={field.name}
            //onClick={e => log({ target: e.target })}
            onSelect={value => {
                //log({ value }) // FIXME
                createFilterStub(fields, setFields, value)
            }}
        >
            {Object.entries(options).map(([k, v], idx) => {
                return (
                    <Option value={k} key={idx}>
                        {v}
                    </Option>
                )
            })}
        </Select>
    )
}

const updateFields = (fields, setFields, all = []) => {
    let outs = all.map(({ name, value }, idx) => ({
        name,
        value,
        key: idx + 1,
    }))

    setFields(outs)
}

const updateInput = ({ fields, setFields, _old, _new, key }) => {
    const target = fields.find(f => f.key === key)
    const done = fields.filter(f => f.key !== key)
    target.value = _new
    setFields([...done, target])
}

const getLastKey = arr => {
    if (!arr.length) {
        return 0
    } else if (arr.length === 1) {
        return arr[0]["key"]
    } else return arr.sort((a, b) => b.key - a.key)[0]["key"]
}

export const Filter = ({ selections }) => {
    const { parse, run$ } = useContext(CTX)
    const { URL_query, URL_path } = parse()

    let _fields = []

    Object.entries(URL_query).forEach(([k, v], idx) => {
        if (isArray(v)) {
            return v.forEach((member, _idx) =>
                _fields.push({
                    key: getLastKey(_fields) + 1,
                    name: k,
                    value: member,
                })
            )
        } else
            _fields.push({
                key: getLastKey(_fields) + 1,
                name: k,
                value: v,
            })
    })

    const [fields, setFields] = useState(_fields)

    const for_HURL = {
        target: {
            href: `/${URL_path}?${fields
                .flatMap(({ name, value }) =>
                    name !== "" || value !== "" ? [`${name}=${value}`] : []
                )
                .join("&")}`,
        },
        currentTarget: document.body,
    }

    const selector = filterSelects(selections)
    return (
        <>
            <Form
                fields={fields}
                onFieldsChange={(dif, all) => {
                    //log({ dif, all })
                    updateFields(fields, setFields, all)
                }}
                name='nested'
                style={{ marginBottom: "2rem" }}
            >
                <Button
                    type='dashed'
                    block
                    style={{ margin: "1.5rem 0" }}
                    size='large'
                    onClick={() => {
                        let key = getLastKey(fields) + 1
                        //log({ key, lastnum })

                        return fields.some(
                            ({ name, value }) => name === "" || value === ""
                        )
                            ? message.warning(
                                  "please complete empty filter first 😉"
                              )
                            : setFields([
                                  ...fields,
                                  {
                                      key,
                                      name: "",
                                      value: "",
                                  },
                              ])
                    }}
                >
                    <PlusOutlined /> New Filter
                </Button>
                {fields
                    .sort((a, b) => a.key - b.key)
                    .map(field => (
                        //log({ field }),
                        <Item
                            fieldKey={field.key}
                            key={field.key}
                            style={{ display: "flex" }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please complete filter or delete",
                                },
                            ]}
                        >
                            <Input
                                addonBefore={selector(fields, setFields, field)}
                                value={field.value}
                                onChange={e => {
                                    const _old = e.target.defaultValue
                                    const _new = e.target.value
                                    //log("onChange in Input:", {
                                    //    _old,
                                    //    _new,
                                    //})
                                    updateInput({
                                        fields,
                                        setFields,
                                        _old,
                                        _new,
                                        key: field.key,
                                    })
                                }}
                                addonAfter={
                                    <Tooltip title='delete'>
                                        <MinusCircleOutlined
                                            onClick={() =>
                                                setFields(
                                                    fields.filter(
                                                        f => f.key !== field.key
                                                    )
                                                )
                                            }
                                        />
                                    </Tooltip>
                                }
                            />
                        </Item>
                    ))}
                <Button
                    type='primary'
                    size='medium'
                    onClick={() => {
                        //log({ for_HURL })
                        return fields.some(
                            ({ name, value }) => name === "" || value === ""
                        )
                            ? message.warning(
                                  "please complete empty filter first 😉"
                              )
                            : run$.next({ ...HURL, args: for_HURL })
                    }}
                >
                    GO
                </Button>
            </Form>
        </>
    )
}
