import path from 'path'
import fs from 'fs'
import {WebSocket, WebSocketServer} from 'ws'
import {Server} from 'http'
import {build, PluginOption} from 'vite'
import chokidar from 'chokidar'

export const changeProtocol = 'change://'

export function sub() {
    return {
        configurePreviewServer(server) {
            const {config} = server
            const {build: {outDir}, configFile, root} = config

            /**
             * 调用`build API`
             */

            build({
                configFile,
                build: {
                    watch: {}
                }
            }).then()

            const absoluteOutDir = path.isAbsolute(outDir) ? outDir : path.join(root, outDir)

            /**
             * 使用中间件暴露`outDir`内的文件
             */

            server.middlewares.use((req, res, next) => {
                if (!req.url) {
                    next()
                    return
                }

                // 暴露`outDir`内的所有文件
                // url除去开头的`/`后拼接至`absoluteOutDir`
                const target = path.join(absoluteOutDir, req.url.replace(/^\/+/, ''))
                const extname = path.extname(target)
                const extensions = extname ? [extname] : config.resolve.extensions
                let i = 0
                for (; i < extensions.length; i++) {
                    const extname = extensions[i]
                    try {
                        const file = fs.readFileSync(path.join(target, extname))
                        res.end(file)
                        break
                    } catch (e) {
                    }
                }

                if (i === extensions.length) {
                    next()
                }
            })

            /**
             * 使用Websocket+chokidar实现热更新
             */

            const wsServer = new WebSocketServer({
                server: server.httpServer as Server
            })
            const clientSet = new Set<WebSocket>()
            wsServer.on('connection', wsClient => {
                clientSet.add(wsClient)
                wsClient.on('close', () => {
                    clientSet.delete(wsClient)
                })
            })
            chokidar.watch(absoluteOutDir).on('change', filePath => {
                const relative = path.relative(root, filePath)
                for (const wsClient of clientSet) {
                    wsClient.send(`${changeProtocol}${relative}`)
                }
            })
        }
    } as PluginOption
}