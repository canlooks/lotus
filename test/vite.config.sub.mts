import {defineConfig} from 'vite'
import path from 'path'
import micromation from '../src'

export default defineConfig({
    // base: '/@micro',
    publicDir: path.resolve('test/pub'),
    build: {
        outDir: path.resolve('test/dist'),
        emptyOutDir: true
    },
    plugins: [
        micromation({
            exports: {
                sub: path.resolve('test/sub.tsx')
            },
            external: [/react/, /react-dom/]
        })
    ]
})