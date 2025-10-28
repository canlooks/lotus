import {memo, useEffect, useRef} from 'react'
import {RemoteProps} from '../index'

export const Remote = memo(({
    component: Component = 'div',
    name,
    address,
    initialProps,
    container,
    ...props
}: RemoteProps) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        (async () => {
            await import(/* @vite-ignore */address)
            if (typeof globalThis !== 'undefined' && name in globalThis.$lotus) {
                const el = typeof container === 'undefined' ? ref.current!
                    : typeof container === 'function' ? container() : container
                el && globalThis.$lotus?.[name]?.(el, initialProps)
            }
        })()
    }, [])

    return typeof container === 'undefined'
        ? <Component {...props} ref={ref}/>
        : null
})