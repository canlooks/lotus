import {defineConfig} from 'vite'
import path from 'path'
import micromation from '../src'

export default defineConfig({
    root: path.resolve('test'),
    publicDir: path.resolve('hidden'),
    build: {
        outDir: path.resolve('main_dist')
    },
    plugins: [
        micromation({
            imports: {
                subModule: 'http://localhost:4173'
            }
        })
    ]
})