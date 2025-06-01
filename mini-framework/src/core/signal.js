class Signal {
  static currentEffect = null;
  constructor(initialValue) {
    this._value = initialValue;
    this.subscribers = new Set();
    this.isSignal = true;
  }

  get() {
    if (Signal.currentEffect) {
      this.subscribers.add(Signal.currentEffect);
    }
    return this._value;
  }

  set(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.subscribers.forEach(fn => fn());
    }
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this.set(newValue);
  }


}

function effect(fn) {
  Signal.currentEffect = fn;
  fn(); // run once to collect dependencies
  Signal.currentEffect = null;
}
export default Signal;
