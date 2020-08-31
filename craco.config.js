const CracoLessPlugin = require("craco-less")
const { ESLINT_MODES } = require("@craco/craco")
const { primary_color } = require("./src/colors")

module.exports = {
    eslint: {
        configure: {
            rules: {
                "no-unused-vars": "off",
            },
        },
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            // primary
                            "@primary-color": primary_color,

                            // layout
                            //"@layout-body-background": "@primary-color",
                            //"@layout-sider-background-light": "red",
                            //"@layout-sider-background": "red",
                            "@layout-trigger-background": "@primary-color",

                            // other...
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
}
