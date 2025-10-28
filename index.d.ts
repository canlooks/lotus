import {Container} from 'react-dom/client'
import {ComponentPropsWithRef, ComponentType, ElementType, ReactElement} from 'react'

declare global {
    namespace globalThis {
        var $lotus: Lotus.Initializers
    }

    interface Window {
        $lotus: Lotus.Initializers
    }
}

declare namespace Lotus {
    /**
     * --------------------------------------------------------------------------
     * defineRoot
     */

    type Initializer = (container: Container, initialProps?: any) => void

    type Initializers = Record<string, Initializer>

    function defineRoot(name: string, component: ComponentType): void

    /**
     * --------------------------------------------------------------------------
     * remote
     */

    type MergeProps<P, OverrideProps> = P & Omit<OverrideProps, keyof P>

    type OverridableProps<P, C extends ElementType> = { component?: C } & MergeProps<P, ComponentPropsWithRef<C>>

    type DefineElement<T = Element | null | undefined> = T | (() => T)

    type RemoteOwnProps = {
        name: string
        address: string
        /**
         * 传递至远程组件的初始属性，这些属性变化不会重新渲染远程组件
         */
        initialProps?: any
        /**
         * 指定容器节点。若定义了`container`，则`Remote`将不会渲染容器节点
         */
        container?: DefineElement
    }

    type RemoteProps<C extends ElementType = 'div'> = OverridableProps<RemoteOwnProps, C>

    function Remote<C extends ElementType = 'div'>(props: RemoteProps<C>): ReactElement
}

export = Lotus