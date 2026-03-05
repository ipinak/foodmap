import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n/index.js'

// Allow standalone theming without touching source code:
//   <script>window.FoodMapConfig = { theme: { accent: '#0070f3' } }</script>
const config = (typeof window !== 'undefined' && window.FoodMapConfig) ?? {}

createApp(App, { theme: config.theme ?? {} }).use(i18n).mount('#app')
