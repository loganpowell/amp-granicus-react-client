import React, { useState, useContext, useEffect } from "react"
import { getIn } from "@thi.ng/paths"
import * as K from "@-0/keys"

import { Layout, Menu } from "antd"
import {
    MailOutlined,
    UserOutlined,
    NotificationOutlined,
} from "@ant-design/icons"

import { CTX } from "../context"
import { antHURL } from "../components"

//import { log } from "../utils"

//const { SubMenu } = Menu
const { Content, Footer, Sider } = Layout

export const Chrome = ({ children }) => {
    const { useCursor } = useContext(CTX)
    const [path, pathCursor] = useCursor([K.$$_PATH], "Route Path")

    //log({ path })

    useEffect(() => {
        return () => {
            pathCursor.release()
        }
    }, [path, pathCursor])

    const [open, setOpen] = useState(true)

    return (
        <Layout>
            <Content
                style={{
                    minHeight: "100vh",
                    //overflow: "hidden",
                }}
            >
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider
                        collapsible
                        collapsed={open}
                        onCollapse={() => setOpen(!open)}
                        width={200}
                        style={{ background: "white" }}
                    >
                        <Menu
                            mode='inline'
                            selectedKeys={[`/` + getIn(path, [0]) || "/sender"]}
                            //defaultOpenKeys={["sub1"]}
                            style={{
                                height: "100%",
                                /*backgroundColor: "black" */
                            }}
                        >
                            <Menu.Item
                                icon={<UserOutlined />}
                                onClick={antHURL}
                                key='/sender'
                            >
                                By Sender
                            </Menu.Item>
                            <Menu.Item
                                icon={<MailOutlined />}
                                onClick={antHURL}
                                key='/topic'
                            >
                                By Topic
                            </Menu.Item>
                            <Menu.Item
                                icon={<NotificationOutlined />}
                                onClick={antHURL}
                                key='/campaign'
                            >
                                By campaign
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content
                        style={{
                            padding: "0 24px",
                            minHeight: 280,
                            overflow: "hidden",
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                ©2020 US CENSUS BUREAU: Digital Marketing Team (Chief: Anthony
                Calabrese)
            </Footer>
        </Layout>
    )
}
