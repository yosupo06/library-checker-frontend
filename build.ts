import * as fs from 'fs';
import * as path from 'path';
import { build, BuildOptions } from 'esbuild';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isDev = NODE_ENV === 'development';
const watch = process.env.WATCH === 'true' || false;

const define: BuildOptions['define'] = {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
};

if (watch) {
    console.log('Watch mode')
}

build({
    bundle: true,
    outfile: 'public/index.js',
    platform: 'browser',
    target: ['es2021', 'chrome104'],
    define,
    // Reactのメインファイル
    entryPoints: [path.resolve(__dirname, 'src/index.tsx')],
    minify: !!process.env.MIN || !isDev,
    sourcemap: true,
    treeShaking: true,
    loader: {
        '.ttf': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
    },
    watch: watch && {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else console.log('watch build succeeded:', result)            
        },
    },
}).then(() => {
    console.log('build finished');
    if (watch) {
        console.log('watching...')
    }
}).catch(() => process.exit(1));
