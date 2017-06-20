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

  once(label, callback) {
    let fired = false;

    const magic = (...args) => {
      this.removeListener(label, callback);

      if (!fired) {
        fired = true;
        callback(...args);
      }
    };

    this.addListener(label, magic);
  }

  removeListener(label, callback) {
    let listeners = this.listener.get(label);

    if (listeners) {
      this.listener.set(label, listeners.filter(listener => !(isFunction(listener) && listener === callback)));
    }

  }

  emit(label, ...args) {
    const listeners = this.listener.get(label);

    if (listeners && listeners.length) {
      listeners.forEach(listener => listener(...args));
    }
  }
}

export default EventEmitter;
