import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import multi from '@rollup/plugin-multi-entry';
import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';
import del from 'rollup-plugin-delete';
import svelte from 'rollup-plugin-svelte';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import sass from 'sass';
import clc from 'cli-color';

const svelteConfig = require('./svelte.config.js');
const production = !process.env.ROLLUP_WATCH;
const distDir = '../wwwroot';
const app = './example/main.ts';

export default [
	{
		input: [app],
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: `${distDir}/build/bundle.js`
		},
		plugins: [
			del({
				runOnce: !production,
				force: true,
				targets: [`${distDir}/build/bundle*`, `${distDir}/webfonts`, `${distDir}/build/assets`]
			}),
			copy({
				targets: [
					{ src: ['**/*.woff', '**/*.woff2'], dest: `${distDir}/webfonts` }
				]
			}),
			multi(),
			svelte({
				compilerOptions: {
					generate: 'dom',
					dev: !production,
					css: false
				},
				emitCss: true,
				preprocess: svelteConfig.createPreprocessors(production),
				onwarn: svelteConfig.onwarn
			}),
			scss({
				sourceMapEmbed: true,
				output: true,
				watch: ['src/style/'],
				processor: css => postcss([
					autoprefixer()
				]),
				sass: sass
			}),
			resolve({
				browser: true,
				dedupe: ['svelte', 'svelte/transition', 'svelte/internal']
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
				tsconfig: "./tsconfig.json"
			}),
			injectProcessEnv({
				NODE_ENV: production ? 'production' : 'development'
			}),
			production && terser()
		],
		watch: {
			clearScreen: false
		},
		onwarn: function (message) {
            if (message.message = "@rollup/plugin-typescript: Typescript 'sourceMap' compiler option must be set to generate source maps.") {
                return;
            }

            console.log(clc.yellow(message.message));
        }
	}
];
