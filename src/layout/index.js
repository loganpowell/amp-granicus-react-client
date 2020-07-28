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
            {/*<Header className='header'>
            <div className='logo' />
            <Menu theme='dark' mode='horizontal' defaultSelectedKeys={["2"]}>
                <Menu.Item key='1'>nav 1</Menu.Item>
                <Menu.Item key='2'>nav 2</Menu.Item>
                <Menu.Item key='3'>nav 3</Menu.Item>
            </Menu>
        </Header>*/}
            <Content
                style={{
                    minHeight: "100vh",
                    //overflow: "hidden",
                }}
            >
                {/*<Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>*/}
                <Layout
                    //className='site-layout-background'
                    style={{ minHeight: "100vh" }}
                >
                    <Sider
                        collapsible
                        collapsed={open}
                        onCollapse={() => setOpen(!open)}
                        //className='site-layout-background'
                        width={200}
                        style={{ background: "white" }}
                    >
                        <Menu
                            mode='inline'
                            //theme='dark'

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
                            {/*<SubMenu
                            key='sub1'
                            icon={<UserOutlined />}
                            title='subnav 2'
                        >
                            <Menu.Item key='2'>option2</Menu.Item>
                            <Menu.Item key='3'>option3</Menu.Item>
                            <Menu.Item key='4'>option4</Menu.Item>
                        </SubMenu>*/}
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
