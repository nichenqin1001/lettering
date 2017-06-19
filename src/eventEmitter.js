let isFunction = function (obj) {
  return typeof obj == 'function' || false;
};

class EventEmitter {
  constructor() {
    this.listener = new Map();
  }

  addListener(label, callback) {
    this.listener.has(label) || this.listener.set(label, []);
    this.listener.get(label).push(callback);
  }

  removeListener(label, callback) {
    let listeners = this.listeners.get(label),
      index;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        return (isFunction(listener) && listener === callback) ?
          i = index :
          i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(label, listeners);
        return true;
      }
    }
    return false;
  }

  emit(label, ...args) {
    const listeners = this.listener.get(label);

    if (listeners && listeners.length) {
      listeners.forEach(listener => listener(...args));
      return true;
    }

    return false;
  }
}

export default EventEmitter;