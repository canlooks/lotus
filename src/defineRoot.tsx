import {ComponentType} from 'react'
import {createRoot} from 'react-dom/client'

export function defineRoot(name: string, Component: ComponentType) {
    if (typeof globalThis !== 'undefined') {
        globalThis.$lotus ||= {}
        globalThis.$lotus[name] = (container, initialProps) => {
            createRoot(container).render(<Component {...initialProps}/>)
        }
    }
}