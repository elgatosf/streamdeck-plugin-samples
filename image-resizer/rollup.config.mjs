import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import path from 'node:path';
import url from 'node:url';
import copy from 'rollup-plugin-copy';

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = 'com.elgato.image-resizer.sdPlugin';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/plugin.ts',
	output: {
		file: `${sdPlugin}/bin/plugin.js`,
		sourcemap: isWatching,
		sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
			return url.pathToFileURL(path.resolve(path.dirname(sourcemapPath), relativeSourcePath))
				.href;
		},
	},
	plugins: [
		{
			name: 'watch-externals',
			buildStart: function () {
				this.addWatchFile(`${sdPlugin}/manifest.json`);
			},
		},
		typescript({
			mapRoot: isWatching ? './' : undefined,
		}),
		nodeResolve({
			browser: false,
			exportConditions: ['node'],
			preferBuiltins: true,
		}),
		commonjs({
			ignoreDynamicRequires: true,
		}),
		copy({
			copyOnce: true,
			errorOnExist: false,
			overwrite: false,
			targets: [
				{
					src: 'node_modules/@img/',
					dest: 'com.elgato.image-resizer.sdPlugin/bin/node_modules',
				},
				{
					src: 'node_modules/sharp/',
					dest: 'com.elgato.image-resizer.sdPlugin/bin/node_modules',
				},
			],
		}),
		json(),
		!isWatching && terser(),
		{
			name: 'emit-module-package-file',
			generateBundle() {
				this.emitFile({
					fileName: 'package.json',
					source: `{ "type": "module" }`,
					type: 'asset',
				});
			},
		},
	],
	external: ['sharp'],
};

export default config;
