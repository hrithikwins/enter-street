// Original author: Bruno Simon <https://threejs-journey.com>
// GLTF auto-generated by: https://github.com/pmndrs/gltfjsx

import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './index.css'
import { App } from './App'

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<span>loading...</span>}>
    <App />
  </Suspense>,
)
