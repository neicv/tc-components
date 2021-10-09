const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin= require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devMode  = process.env.NODE_ENV !== 'production';
const prodMode = !devMode;

module.exports = {
    mode: 'development',
    entry: './src/js/app.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        port: 3000,
        hot: devMode
    },
    devtool: devMode ? 'source-map' : false,
    plugins: [
        new HTMLPlugin({
            template: './src/index.html',
            // favicon: devMode ?  path.resolve(__dirname, './src/favicon/favicon.ico') : path.resolve(__dirname, './public/favicon/favicon.ico'),
            favicon: path.resolve(__dirname, './src/favicon/favicon.ico'),
            minify: {
                removeComments: prodMode,
                collapseWhitespace: prodMode
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns:
            [
                // {
                //     from: path.resolve(__dirname, './src/fonts'),
                //     to: path.resolve(__dirname, './public/fonts')
                // },
                // {
                //     from: path.resolve(__dirname, './src/favicon'),
                //     to: path.resolve(__dirname, './public/favicon')
                // },
                // {
                //     from: path.resolve(__dirname, './src/assets'),
                //     to: path.resolve(__dirname, './public/assets')
                // },
                // {
                //     from: path.resolve(__dirname, './src/vendor'),
                //     to: path.resolve(__dirname, './public/vendor')
                // },
                {
                    from: path.resolve(__dirname, './src/css'),
                    to: path.resolve(__dirname, './public/css')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '' //'[id].[hash].css'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                    publicPath: (resourcePath, context) => {
                            // publicPath is the relative path of the resource to the context
                            // e.g. for ./css/admin/main.css the publicPath will be ../../
                            // while for ./css/main.css the publicPath will be ../
                            return path.relative(path.dirname(resourcePath), context) + '/'},
                    url: false,
                    // only enable hot in development
                    hmr: devMode,
                    // if hmr does not work, this is a forceful method.
                    reloadAll: true,
                    },
                },
                'css-loader',
                ],
                sideEffects: true,
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                        hmr: devMode,
                        reloadAll: true
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: 'file-loader?limit=100000',
                // loader: 'url-loader?limit=100000',
                options: {
                    outputPath: 'fonts/',
                    name: devMode ? '[name].[ext]' : '[contenthash].[ext]',
                    publicPath: url => 'fonts/' + url
                },
            },
            {
				test: /\.(png|jpg|gif|svg)$/,
				exclude: [
	                path.resolve(__dirname, './node_modules'), ],
				use: {
				    loader: 'file-loader',
				    options: {
                        //name: '[path][name]-[hash].[ext]',
                        name: devMode ? '[name].[ext]' : '[name]-[hash].[ext]',
					    outputPath: 'assets'
					},
				},
			},
            {
                // test: /\.jsx?$/,
                test: /\.js$/,
                exclude: /\/node_modules\//,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    // if no .babelrc in root dir - uncomment:
                    // presets: ["@babel/preset-env"],
                    // sourceMaps: true,
                    // plugins: [
                    //     ["@babel/plugin-transform-react-jsx", {
                    //         "pragma": "m",
                    //         "pragmaFrag": "'['"
                    //     }]
                    // ]
                }
            },
        ],
    },
}
