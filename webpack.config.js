module.exports = {
    entry: './src/js/main.js',

    output: {
        filename: 'main.js'
    },

    module: {
        loaders: [
            { test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json']
    },
    externals: {
        'mePlayer': 'mePlayer'
    }
};
