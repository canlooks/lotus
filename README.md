# @canlooks/lotus

## In sub project

### 1. Use vite plugin (recommended).
In addition to modify config, plugin also enables hot updates for development.

```ts
// vite.config.mts

import vitePluginMicro from '@canlooks/lotus/vite'

export default {
    plugins: [
        vitePluginMicro({
            entry: 'path of entry file'
        })
    ]
    // ... other configs
}
```

or modify `vite` config manually.

```ts
export default {
    base: '',
    build: {
        rollupOptions: {
            input: 'path of entry file',
            output: {
                entryFileNames: '[name].js'
            }
        }
    }
    // ... other configs
}
```

### 2. Edit entry file.

```ts
import {defineRoot} from '@canlooks/lotus'
import App from './App.tsx'

// Pass in entry component and name it.
defineRoot('name-of-sub-project', App)
```

### 3. Develop and build.

`vite preview` for development, `vite build` for production.

---

## In main project

Render `<Remote/>` anywhere.

```tsx
import {Remote} from '@canlooks/lotus'

export default function Index() {
    return (
        <Remote
            name="name-of-sub-project"
            // The url address of the sub project entry file.
            address="http://localhost:4173/index.js"
        />
    )
}
```