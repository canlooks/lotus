import {createRoot} from 'react-dom/client'
import React, {Component, lazy, ReactElement, Suspense, useEffect, useRef, useState} from 'react'

createRoot(document.getElementById('app')!).render(<App/>)

function App() {
    return (
        <>
            <h1>This is async component testing.</h1>
            <Suspense fallback={<h2>Loading...</h2>}>
                <AsyncComponent/>
            </Suspense>
        </>
    )
}

let promise: Promise<ReactElement>

function asyncFn() {
    // promise ||= new Promise((resolve, reject) => setTimeout(() => reject(<h3>Hello</h3>), 1500))
    const address = 'http://localhost:4173'
    try {
        promise ||= import(/* vite-ignore */address)
    } catch (e) {
        console.log('error handled')
    }
}

function AsyncComponent() {
    console.log('render')
    asyncFn()
    return promise
}