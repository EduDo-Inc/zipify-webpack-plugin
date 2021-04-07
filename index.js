'use strict';

const path = require('path')
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')
const webpack = require('webpack')
const { RawSource } = webpack.sources || require('webpack-sources')
const JSZip = require('jszip')

function ZipifyPlugin(options) {
	this.options = options || {};
}

ZipifyPlugin.prototype.apply = function(compiler) {
	const options = this.options

	const process = async (compilation) => {
		// assets from child compilers will be included in the parent
		// so we should not run in child compilers
		if (compilation.compiler.isChild()) {
			return
		}

		for (const nameAndPath in compilation.assets) {
			if (!compilation.assets.hasOwnProperty(nameAndPath)) continue

			// match against include and exclude, which may be strings, regexes, arrays of the previous or omitted
			if (!ModuleFilenameHelpers.matchObject({ include: options.include, exclude: options.exclude }, nameAndPath)) continue
            
            const source = compilation.assets[nameAndPath].source()
            const zip = new JSZip()
            zip.file(path.basename(nameAndPath), source)
            const zipContents = await zip.generateAsync({ type: 'nodebuffer' })

			const outputPath = options.path || compilation.options.output.path

			const outputPathAndFilename = path.resolve(
				compilation.options.output.path,
				outputPath,
				path.dirname(nameAndPath),
                path.basename(nameAndPath, path.extname(nameAndPath)) + '.zip'
			)

			const relativeOutputPath = path.relative(
				compilation.options.output.path,
				outputPathAndFilename
			)
            compilation.emitAsset(relativeOutputPath, new RawSource(zipContents))
		}
	}

	compiler.hooks.thisCompilation.tap(ZipifyPlugin.name, compilation => {
        compilation.hooks.processAssets.tapPromise(
            {
                name: ZipifyPlugin.name,
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER,
            },
            () => process(compilation)
        );
    });
};

module.exports = ZipifyPlugin