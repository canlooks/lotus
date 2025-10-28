import {createRoot} from 'react-dom/client'
import {lazy, Suspense, useEffect, useRef, useState} from 'react'

createRoot(document.getElementById('app')!).render(
    <>
        <h1>Parent</h1>
        <Child/>
    </>
)

// @ts-ignore
const SubModule = lazy(() => import('subModule/sub'))

function Child() {
    return (
        <div>
            <Suspense fallback="404">
                <SubModule/>
            </Suspense>
        </div>
    )
}