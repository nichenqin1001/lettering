let isFunction = function (obj) {
  return typeof obj == 'function' || false;
};

class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  addListener(label, callback) {
    this.listeners[label] || (this.listeners[label] = []);
    this.listeners[label].push(callback);
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
    let listeners = this.listeners[label];

    if (listeners) {
      this.listeners[label] = listeners.filter(listener => !(isFunction(listener) && listener === callback));
    }

  }

  emit(label, ...args) {
    const listeners = this.listeners[label];

    if (listeners && listeners.length) {
      listeners.forEach(listener => listener(...args));
    }
  }
}

export default EventEmitter;
