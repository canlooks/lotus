import {defineConfig} from 'vite'
import path from 'path'
import WebSocket from 'ws'

export default defineConfig(() => ({
    root: path.resolve('test'),
    server: {
        port: 7000
    },
    plugins: [
        {
            name: 'import-remote-module',
            resolveId(id) {
                if (id === 'test-remote-module') {
                    return '\0' + id
                }
            },
            async load(id) {
                if (id === '\0test-remote-module') {
                    try {
                        const res = await fetch('http://localhost:4173/remote/entry.mjs')
                        return await res.text()
                    } catch (e) {
                        return ''
                    }
                }
            },
            configureServer(viteDevServer) {
                const ws = new WebSocket('http://localhost:4173')
                ws.on('message', (data) => {
                    console.log(data.toString())
                    console.log(viteDevServer.moduleGraph.idToModuleMap.keys()!)
                    const reloadModule = viteDevServer.moduleGraph.idToModuleMap.get('\0test-remote-module')
                    reloadModule && viteDevServer.reloadModule(reloadModule)
                    // viteDevServer.ws.send({type: 'full-reload'})
                })
                // ws.on('custom-update', () => {
                //     console.log('custom-update')
                //     ws.send({type: 'full-reload'})
                // })
            }
        }
    ]
}))