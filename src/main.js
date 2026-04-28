import { createApp } from 'vue'
import App from './App.vue'
import router from './config'
import '../public/css/app.css'

const app = createApp(App)
app.use(router)
app.mount('#app')