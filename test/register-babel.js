require("@babel/register")({
    presets: ["@babel/preset-env"],
    plugins: [
        [
            "babel-plugin-webpack-alias-7",
            { config: "../webpack.config.js" }
        ],
        [
            "@babel/plugin-transform-runtime",
            {
                absoluteRuntime: false,
                corejs         : false,
                helpers        : true,
                regenerator    : true,
                useESModules   : false
            }
        ],
        [
            "transform-react-jsx",
            { pragma: "m" }
        ]
    ]
});
