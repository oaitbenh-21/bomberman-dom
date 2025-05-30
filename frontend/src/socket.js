export default class Socket {
      constructor() {
          this.socket = new WebSocket("ws://localhost:8080");

      }
  
      send(data) {
          this.socket.send(data);
      }
  
      onMessage(callback) {
          this.socket.onmessage = (event) => {
              callback(event.data);
          };
      }
  
      onClose(callback) {
          this.socket.onclose = (event) => {
              callback(event);
          };
      }
  
      onOpen(callback) {
          this.socket.onopen = (event) => {
              callback(event);
          };
      }
  
      onError(callback) {
          this.socket.onerror = (event) => {
              callback(event);
          };
      }
  }
  