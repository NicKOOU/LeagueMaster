const WebSocketPlugin = {
  install(app) {
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
  },
};

export default WebSocketPlugin;
