import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import { createPinia } from 'pinia';
import 'ant-design-vue/dist/reset.css';

createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
