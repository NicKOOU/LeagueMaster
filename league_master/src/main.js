import { createApp } from 'vue';
import App from './App.vue';
import WebSocketPlugin from './plugins/websockets.js';
import router from './router';

const app = createApp(App);
app.use(WebSocketPlugin);
app.use(router);

app.mount('#app');