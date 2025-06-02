import Signal from './signal.js';

class StateManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
    this.refs = new Map();
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = newState ;//{ ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  createRef(initialValue = null) {
    const signal = new Signal(initialValue);
    return {
      get current() {
        return signal.get();
      },
      set current(value) {
        signal.set(value);
      }
    };
  }

  setRef(key, value) {
    this.refs.set(key, value);
  }

  getRef(key) {
    return this.refs.get(key);
  }

  removeRef(key) {
    this.refs.delete(key);
  }
}
export { StateManager }; // Export the class for direct use if needed
const state = new StateManager();

// Proper named exports
export const setRef = state.setRef.bind(state);
export const getRef = state.getRef.bind(state);
export const removeRef = state.removeRef.bind(state);
export const createRef = state.createRef.bind(state);

// Default export for full state
export default state;
