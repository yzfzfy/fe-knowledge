const path = require('path');

module.exports = {
    // mode: 'development',
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: require.resolve('less-loader'),
                        options: {
                            sourceMap: true,
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: {
                                    '@default-color': 'red',
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
