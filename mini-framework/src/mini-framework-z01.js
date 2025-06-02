import VirtualDOM from './core/dom.js';
import Router from './core/router.js';
import stateSingleton, { StateManager } from './core/state.js';
import EventManager from './core/events.js';
import Signal from './core/signal.js';

class MiniFramework {
  constructor(root = document) {
    this.DOM = new VirtualDOM();
    this.Router = new Router();
    this.State = stateSingleton;
    this.Events = new EventManager(root);
    this.root = root;
  }

  createStore(initialState) {
    return new StateManager(initialState);
  }

  createRouter() {
    return new Router();
  }

  createEventManager() {
    return new EventManager(this.root);
  }

  createVirtualDOM() {
    return new VirtualDOM();
  }

  createSignal(initialValue) {
    return new Signal(initialValue);
  }
}

const miniFramework = new MiniFramework();

// === Public API Exports ===

// Virtual DOM API
export const createElement = (...args) => miniFramework.DOM.createElement(...args);
export const render = (...args) => miniFramework.DOM.render(...args);
export const appendTo = (...arg) => miniFramework.DOM.appendTo(...arg);

// State Management
export const createStore = (...args) => miniFramework.createStore(...args);
export const setRef = miniFramework.State.setRef.bind(miniFramework.State);
export const getRef = miniFramework.State.getRef.bind(miniFramework.State);
export const removeRef = miniFramework.State.removeRef.bind(miniFramework.State);
export const createRef = miniFramework.State.createRef.bind(miniFramework.State);

// Routing
export const createRouter = (...args) => miniFramework.createRouter(...args);

// Event Handling
export const createEventManager = () => miniFramework.createEventManager();

// Signals & Effects
export const createSignal = (...args) => miniFramework.createSignal(...args);

export const effect = (fn) => {
  let stopped = false;

  const wrapped = () => {
    if (stopped) return;
    Signal.currentEffect = wrapped;
    fn();
    Signal.currentEffect = null;
  };

  wrapped();

  // Return stop function
  return () => {
    stopped = true;
  };
};


// Direct access to core singletons if needed
export const dom = miniFramework.DOM;
export const router = miniFramework.Router;
export const state = miniFramework.State;
export const events = miniFramework.Events;

export default miniFramework;