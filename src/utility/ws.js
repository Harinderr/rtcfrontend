
let ws = null;

export const connectToWebSocket = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send("hlo");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  return ws;
};
