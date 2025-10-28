import {DockingCallback} from '../index'

export function defineRoot(name: string, callback: DockingCallback) {
    if (typeof globalThis === 'undefined') {
        return callback
    }
    globalThis.$lotus ||= {}
    return globalThis.$lotus[name] = callback
}