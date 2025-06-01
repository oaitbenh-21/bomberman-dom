class EventManager {
  constructor() { 
    this.customEvents = {};
    this.nativeListeners = new Map(); // Tracks native event handlers
  }

  isNativeEvent(eventName) {
    const nativeEvents = ['keydown', 'keyup', 'click', 'scroll', 'mousedown', 'mouseup'];
    return nativeEvents.includes(eventName);
  }

  on(eventName, callback, element = window) {
    if (!this.customEvents[eventName]) { // the event isn't registered
      this.customEvents[eventName] = []; // register the event

      // Setup native event listener if applicable
      if (this.isNativeEvent(eventName)) {
        const handler = (e) => this.emit(eventName, e);
        element.addEventListener(eventName, handler);
        this.nativeListeners.set(eventName, { element, handler });
      }
    }
    // event registered
    this.customEvents[eventName].push(callback); // overite the event 
  }

  off(eventName, callback) {
    if (!this.customEvents[eventName]) return;

    // Remove the callback
    this.customEvents[eventName] = this.customEvents[eventName].filter(
      cb => cb !== callback
    );

    // If no more callbacks, remove native listener
    if (this.customEvents[eventName].length === 0) {
      const nativeListener = this.nativeListeners.get(eventName);
      if (nativeListener) {
        nativeListener.element.removeEventListener(eventName, nativeListener.handler);
        this.nativeListeners.delete(eventName);
      }
      delete this.customEvents[eventName];
    }
  }

  emit(eventName, data) {
    const listeners = this.customEvents[eventName];
    if (listeners) {
      listeners.forEach(cb => cb(data));
    }
  }
}


export default EventManager;
