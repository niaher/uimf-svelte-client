const sveltePreprocess = require('svelte-preprocess');
const autoprefixer = require('autoprefixer');

function createPreprocessors(production) {
    return sveltePreprocess({
        sourceMap: !production,
        defaults: {
            script: 'ts',
            style: 'scss'
        },
        postcss: {
            plugins: [autoprefixer()]
        },
        typescript: {
            tsconfigFile: './tsconfig.json'
        }
    });
}

module.exports = {
    preprocess: createPreprocessors(false),
    createPreprocessors: createPreprocessors,
    onwarn: (warning, handler) => {
        // Ignore some warnings.
        if (warning.code === 'unused-export-let' ||
            warning.code === 'css-unused-selector') {
            return;
        }

        handler(warning)
    }
};