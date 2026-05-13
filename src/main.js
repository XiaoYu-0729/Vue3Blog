import { createApp } from 'vue'
import App from './App.vue'
import router from './config'
import { createPinia } from 'pinia'
import '../public/css/app.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)  // Pinia 先注册
app.use(router)  // 然后 Router 再注册
app.mount('#app')