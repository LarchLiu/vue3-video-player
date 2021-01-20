import { createApp } from 'vue'
import App from './App.vue'
import Vue3VideoPlayer from './index'

const app = createApp(App)

app.use(Vue3VideoPlayer, {
  lang: 'zh-CN'
}).mount('#app')
