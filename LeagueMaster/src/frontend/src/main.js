import { createApp } from 'vue';
import App from './App.vue';
import WebSocketPlugin from './plugins/websockets.js';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(WebSocketPlugin);

const createWindow = () => {
  const ws = new WebSocket("ws://localhost:3000");

  ws.addEventListener("open", () => {
    console.log("WebSocket connection established");
  });

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);
  });

  ws.addEventListener("close", () => {
    console.log("WebSocket connection closed");
  });

  app.config.globalProperties.$ws = ws;
};

createWindow();
setTimeout(createWindow, 2000);

app.mount('#app');
