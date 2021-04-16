### Zipify files produced by webpack
Motivation: build AWS lambdas directly into .zip archives
## Installation
Package is [available](https://www.npmjs.com/package/@edudo/zipify-webpack-plugin) on npm
```
yarn add -D @edudo/zipify-webpack-plugin
```
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
