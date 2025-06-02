export default class Socket {
    constructor() {
        this.socket = new WebSocket("ws://localhost:8080");
        this.socket.addEventListener('open', () => {
            const event = new CustomEvent('socket-ready');
            window.dispatchEvent(event);
        });
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
    close() {
        this.socket.close();
    }
}
