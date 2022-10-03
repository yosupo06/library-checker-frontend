import { resolve } from 'path';
import { build, BuildOptions } from 'esbuild';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const watch = process.env.WATCH === 'true' || false;
const API_URL = process.env.API_URL ?? 'https://grpcweb-apiv1.yosupo.jp:443';

const define: BuildOptions['define'] = {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'process.env.APP_ENV_API_URL': JSON.stringify(API_URL)
};

build({
    bundle: true,
    outfile: 'public/index.js',
    platform: 'browser',
    target: ['es2021', 'chrome104'],
    define,
    entryPoints: [resolve(__dirname, 'src/index.tsx')],
    minify: NODE_ENV === 'production',
    sourcemap: true,
    treeShaking: true,
    loader: {
        '.ttf': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
        '.svg': 'dataurl',
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
