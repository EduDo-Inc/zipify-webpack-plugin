### Zipify files produced by webpack
Motivation: build AWS lambdas directly into .zip archives
## Usage example
This is example of webpack.config.js for using this plugin with typescript
```js
{
    mode: 'production',
    entry: loadEntries(),
    output: {
        filename: '[name].js',
        path:  __dirname + 'dist-lambdas',
        library: {
            type: 'commonjs2'
        }
    },
    plugins: [new ZipifyPlugin({
        exclude: [/\.txt$/],
        zippedFileName: 'index.js'
    })],
    module: {
        rules: [{ test: /\.ts$/, use: 'ts-loader' }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    target: 'node',
}
```